import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const maxDuration = 60;

// Google'i poliitika: Places'i sisu tohib DB-s hoida kuni 30 paeva.
// Varskendame kui snapshot on vanem kui 25 paeva -> 5 paeva varu.
//
// FieldMask korgeim tasand on Enterprise ('rating', 'userRatingCount',
// 'regularOpeningHours'). Arve kaib KORGEIMA tasandi jargi, seega Pro-valjad
// ('nationalPhoneNumber', 'websiteUri') ja Essentials ('photos') on samas
// paringus TASUTA. Sellepdrast kusime kohe koik korraga.
//
// Miks see oluline on: 31.08 seisuga oli 1437 tookojal 1751-st EI telefoni
// EGA veebilehte -- kasutaja joudis profiilile ja sealt polnud kuhugi edasi
// minna. Andmed on Google'is olemas, me lihtsalt ei kusinud neid.
const STALE_DAYS = 25;
const BATCH = 50;          // rida korraga Supabase'ist
const CONCURRENCY = 6;     // paralleelseid Google'i paringuid
const BUDGET_MS = 45000;   // jata maxDuration = 60 sisse varu

const DTOK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Google regularOpeningHours.periods -> OSM-stiilis string, mida lib/hours.ts loeb.
// Google'i day: 0 = puhapaev ... 6 = laupaev -- sama indeks mis lib/hours.ts DAY-s.
// Mitu vahemikku samal paeval liidetakse uheks (varaseim avamine -> hiliseim
// sulgemine), sest compactHours naitab ainult esimest reeglit.
function hoursFromGoogle(roh: unknown): string | null {
  const periods = (roh as { periods?: unknown })?.periods;
  if (!Array.isArray(periods) || periods.length === 0) return null;

  // Uks periood ilma sulgemiseta = oopaevaringselt avatud
  if (periods.length === 1 && (periods[0] as { open?: unknown })?.open && !(periods[0] as { close?: unknown })?.close) {
    return '24/7';
  }

  const mins: (number | null)[][] = [[], [], [], [], [], [], []].map(() => [null, null] as (number | null)[]);
  for (const p of periods) {
    const o = (p as { open?: { day?: number; hour?: number; minute?: number } }).open;
    const c = (p as { close?: { hour?: number; minute?: number } }).close;
    if (!o || typeof o.day !== 'number' || o.day < 0 || o.day > 6 || !c) continue;
    const start = (o.hour ?? 0) * 60 + (o.minute ?? 0);
    const end = (c.hour ?? 0) * 60 + (c.minute ?? 0);
    if (end <= start) continue; // ule kesooe ulatuv vahemik -- jata vahele
    const cur = mins[o.day];
    cur[0] = cur[0] === null ? start : Math.min(cur[0], start);
    cur[1] = cur[1] === null ? end : Math.max(cur[1], end);
  }

  const hhmm = (m: number) => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  const span = (d: number) => (mins[d][0] === null ? '' : hhmm(mins[d][0] as number) + '-' + hhmm(mins[d][1] as number));

  // Grupeeri jarjestikused paevad sama ajaga, alusta esmaspaevast
  const order = [1, 2, 3, 4, 5, 6, 0];
  const out: string[] = [];
  let i = 0;
  while (i < order.length) {
    const key = span(order[i]);
    if (!key) { i++; continue; }
    let j = i;
    while (j + 1 < order.length && span(order[j + 1]) === key) j++;
    out.push((i === j ? DTOK[order[i]] : DTOK[order[i]] + '-' + DTOK[order[j]]) + ' ' + key);
    i = j + 1;
  }
  return out.length ? out.join('; ') : null;
}

const empty = (v: unknown) => v === null || v === undefined || String(v).trim() === '';

export async function GET(req: Request) {
  const started = Date.now();
  const sb = createAdminClient();

  // 1) Vercel Cron saadab automaatselt: Authorization: Bearer <CRON_SECRET>
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');
  let ok = Boolean(secret) && auth === `Bearer ${secret}`;

  // 2) Kasitsi kaivitamiseks sama token mis /api/admin/backfill-ratings
  if (!ok) {
    const manual = req.headers.get('x-admin-token');
    if (manual) {
      const { data: tok } = await sb
        .from('admin_tokens').select('token').eq('name', 'backfill').single();
      ok = Boolean(tok?.token) && manual === tok!.token;
    }
  }
  if (!ok) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!KEY) {
    return NextResponse.json({ error: 'GOOGLE_MAPS_API_KEY puudub' }, { status: 500 });
  }

  const cutoff = new Date(Date.now() - STALE_DAYS * 86400000).toISOString();
  // Rida vajab varskendust, kui reiting VOI foto on vana/puudu.
  // photo_at seatakse igal katsel (ka siis kui fotot pole), et fotota kohad
  // ei satuks igasse joosku tagasi.
  const staleFilter =
    `google_rating_at.is.null,google_rating_at.lt.${cutoff},` +
    `photo_at.is.null,photo_at.lt.${cutoff}`;

  let processed = 0, done = 0, fail = 0, batches = 0;
  let photos = 0, phones = 0, sites = 0, hours = 0;
  let lastId: string | number | null = null;
  let timedOut = false;

  while (true) {
    if (Date.now() - started >= BUDGET_MS) { timedOut = true; break; }

    // Kursor id jargi: ebaonnestunud read ei satu samasse joosku tagasi.
    // Ilma selleta tuleks sama 50 rida lopmatult ringi ja pouks API-kvoodi.
    let q = sb.from('workshops')
      .select('id,google_place_id,phone,website,opening_hours,claimed')
      .eq('is_hidden', false)
      .not('google_place_id', 'is', null)
      .neq('google_place_id', 'NONE')
      .or(staleFilter)
      .order('id')
      .limit(BATCH);
    if (lastId !== null) q = q.gt('id', lastId);

    const { data: rows, error } = await q;
    if (error) {
      return NextResponse.json(
        { error: error.message, processed, done, fail, batches }, { status: 500 }
      );
    }
    if (!rows || rows.length === 0) break;

    batches++;
    processed += rows.length;
    lastId = rows[rows.length - 1].id;

    for (let i = 0; i < rows.length; i += CONCURRENCY) {
      await Promise.all(rows.slice(i, i + CONCURRENCY).map(async (w) => {
        try {
          const r = await fetch(
            `https://places.googleapis.com/v1/places/${w.google_place_id}`,
            {
              headers: {
                'X-Goog-Api-Key': KEY,
                'X-Goog-FieldMask':
                  'rating,userRatingCount,photos,nationalPhoneNumber,websiteUri,regularOpeningHours',
              },
              cache: 'no-store',
            }
          );
          if (!r.ok) { fail++; return; }
          const d = await r.json();

          // Foto: lahenda meedia-URI ainult siis, kui kohal foto uldse on.
          const ph = Array.isArray(d.photos) ? d.photos[0] : null;
          let photoUrl: string | null = null;
          let photoAttr: string | null = null;
          if (ph?.name) {
            try {
              const pr = await fetch(
                `https://places.googleapis.com/v1/${ph.name}/media?maxWidthPx=800&skipHttpRedirect=true`,
                { headers: { 'X-Goog-Api-Key': KEY }, cache: 'no-store' }
              );
              if (pr.ok) {
                const pd = await pr.json();
                photoUrl = pd.photoUri ?? null;
                const a = ph.authorAttributions && ph.authorAttributions[0];
                photoAttr = a?.displayName ?? null;
                if (photoUrl) photos++;
              }
            } catch { /* foto ebaonnestus -- reiting laheb ikka kirja */ }
          }

          const now = new Date().toISOString();
          const patch: Record<string, unknown> = {
            google_rating: d.rating ?? null,
            google_rating_count: d.userRatingCount ?? 0,
            google_rating_at: now,
            photo_url: photoUrl,
            photo_attr: photoAttr,
            photo_name: ph?.name ?? null,
            photo_at: now,
          };

          // Kontakt ja lahtiolek: taidame AINULT tuhja lahtri ja mitte kunagi
          // lunastatud tookojal -- omaniku sisestatu on alati ulimuslik.
          if (!w.claimed) {
            if (empty(w.phone) && !empty(d.nationalPhoneNumber)) { patch.phone = d.nationalPhoneNumber; phones++; }
            if (empty(w.website) && !empty(d.websiteUri)) { patch.website = d.websiteUri; sites++; }
            if (empty(w.opening_hours)) {
              const oh = hoursFromGoogle(d.regularOpeningHours);
              if (oh) { patch.opening_hours = oh; hours++; }
            }
          }

          await sb.from('workshops').update(patch).eq('id', w.id);
          done++;
        } catch { fail++; }
      }));
    }
  }

  // Kui palju aegunud ridu veel ootab (jargmine paev votab need ette)
  const { count: remaining } = await sb.from('workshops')
    .select('id', { count: 'exact', head: true })
    .eq('is_hidden', false)
    .not('google_place_id', 'is', null)
    .neq('google_place_id', 'NONE')
    .or(staleFilter);

  return NextResponse.json({
    ok: true, batches, processed, done, fail,
    photos, phones, sites, hours,
    remaining: remaining ?? null,
    timedOut, ms: Date.now() - started,
  });
}
