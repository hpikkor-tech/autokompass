import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { sendTransactional } from '@/lib/email/resend';

// Uus pakkumise paring -> salvesta + teavita.
//
// TAHTIS: 31.08 seisuga ei ole UHELGI tookojal andmebaasis e-posti (0/1751).
// Enne seda parandust laks paring ainult `quotes` tabelisse ja EI JOUDNUD
// kellenigi -- ei tookojani ega saidi omanikuni. Nuud saadetakse koopia alati
// ka omanikule (OWNER_EMAIL, vaikimisi info@autokompass.ee), et ukski
// kliendipäring kaotsi ei laheks.
export async function POST(req: Request) {
  const body = await req.json();
  const { workshop_id, message, phone, name, category_id } = body ?? {};
  if (!workshop_id || !message || !phone) {
    return NextResponse.json({ error: 'Puuduvad väljad' }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin0 = createAdminClient();
  const { count: qc } = await admin0.from('quotes').select('id', { count: 'exact', head: true }).eq('phone', phone).gte('created_at', new Date(Date.now() - 3600000).toISOString());
  if ((qc ?? 0) >= 6) return NextResponse.json({ error: 'Liiga palju paringuid, proovi hiljem' }, { status: 429 });

  const { data: quote, error } = await supabase
    .from('quotes')
    .insert({ workshop_id, message, phone, name: name ?? null, category_id: category_id ?? null, user_id: user?.id ?? null })
    .select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Teavitused ei tohi paringu salvestamist katkestada.
  try {
    const admin = createAdminClient();
    const { data: w } = await admin.from('workshops').select('name,slug,city,phone,email').eq('id', workshop_id).single();
    const nimi = w?.name ?? 'Töökoda';
    const link = w?.slug ? `https://autokompass.ee/tookoda/${w.slug}` : 'https://autokompass.ee';
    const rida = (k: string, v: string) => `<p style="margin:6px 0"><b>${k}:</b> ${escapeHtml(v)}</p>`;
    const sisu =
      rida('Töökoda', `${nimi}${w?.city ? ' (' + w.city + ')' : ''}`) +
      rida('Kliendi mure', message) +
      rida('Kliendi telefon', phone) +
      (name ? rida('Kliendi nimi', String(name)) : '') +
      `<p style="margin:14px 0 0"><a href="${link}">${link}</a></p>`;

    // 1) Saidi omanik -- ALATI. Praegu on see ainus tee, kuidas paring kohale jouab.
    const owner = process.env.OWNER_EMAIL ?? 'info@autokompass.ee';
    await sendTransactional({
      kind: 'quote_received',
      to: owner,
      subject: `Uus päring: ${nimi}`,
      html: `<p>Autokompassist tuli uus kliendipäring.</p>${sisu}` +
        (w?.email ? '<p style="color:#666;font-size:13px">Koopia läks ka töökojale.</p>'
                  : `<p style="color:#666;font-size:13px">Töökojal ei ole e-posti — võta kliendiga ise ühendust${w?.phone ? ' või helista töökojale ' + escapeHtml(w.phone) : ''}.</p>`),
    });

    // 2) Tookoda -- ainult kui e-post on olemas.
    if (w?.email) {
      await sendTransactional({
        kind: 'quote_received',
        to: w.email,
        subject: `Uus päring Autokompassist — ${nimi}`,
        html: `<p>Sulle saabus uus päring.</p>${sisu}`,
      });
    }
  } catch { /* teavitus ei tohi päringu salvestamist katkestada */ }

  return NextResponse.json({ ok: true, id: quote.id });
}

function escapeHtml(s: string) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
