import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const maxDuration = 60;

// Google'i poliitika: Places'i sisu tohib DB-s hoida kuni 30 paeva.
// Varskendame kui snapshot on vanem kui 25 paeva -> 5 paeva varu.
//
// Sama paring toob nuud KA foto. Pohjus: 'rating,userRatingCount' on juba
// Enterprise-tasandi FieldMask ja 'photos' on Essentials -- arve kaib korgeima
// tasandi jargi, seega foto lisamine samasse paringusse on TASUTA.
// Varem kusisime fotot iga lehe renderdusega (listingus 24 kaarti x 2 kutset),
// mis andis ~33 000 API-kutset paevas. Nuud ~1 kutse tookoja kohta 25 paeva jooksul.
const STALE_DAYS = 25;
const BATCH = 50;          // rida korraga Supabase'ist
const CONCURRENCY = 6;     // paralleelseid Google'i paringuid (nuud 2 kutset rea kohta)
const BUDGET_MS = 45000;   // jata maxDuration = 60 sisse varu

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

  let processed = 0, done = 0, fail = 0, batches = 0, photos = 0;
  let lastId: string | number | null = null;
  let timedOut = false;

  while (true) {
    if (Date.now() - started >= BUDGET_MS) { timedOut = true; break; }

    // Kursor id jargi: ebaonnestunud read ei satu samasse joosku tagasi.
    // Ilma selleta tuleks sama 50 rida lopmatult ringi ja pouks API-kvoodi.
    let q = sb.from('workshops')
      .select('id,google_place_id')
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
                'X-Goog-FieldMask': 'rating,userRatingCount,photos',
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
          await sb.from('workshops').update({
            google_rating: d.rating ?? null,
            google_rating_count: d.userRatingCount ?? 0,
            google_rating_at: now,
            photo_url: photoUrl,
            photo_attr: photoAttr,
            photo_name: ph?.name ?? null,
            photo_at: now,
          }).eq('id', w.id);
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
    ok: true, batches, processed, done, fail, photos,
    remaining: remaining ?? null,
    timedOut, ms: Date.now() - started,
  });
}
