import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Uus arvustus. Ainult sisselogitud klient.
 * "Kontrollitud külastus" (verified=true) määratakse SERVERIS: tõene, kui sellel kasutajal
 * on selle töökojaga seotud päring (quotes). Nii ei saa keegi jätta võltsarvustusi.
 */
export async function POST(req: Request) {
  const { workshop_id, rating, body } = await req.json();
  if (!workshop_id || !rating || !body) return NextResponse.json({ error: 'Puuduvad väljad' }, { status: 400 });
  if (rating < 1 || rating > 5) return NextResponse.json({ error: 'Vigane hinnang' }, { status: 400 });
  if (String(body).trim().length < 8) return NextResponse.json({ error: 'Arvustus liiga lühike' }, { status: 400 });

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Pead olema sisse logitud' }, { status: 401 });

  // Kontrolli seotud päringut -> verified
  const { data: q } = await supabase
    .from('quotes').select('id').eq('workshop_id', workshop_id).eq('user_id', user.id).limit(1).maybeSingle();
  const verified = !!q;

  // Upsert (üks arvustus kasutaja kohta töökojale)
  const { error } = await supabase.from('reviews').upsert(
    { workshop_id, user_id: user.id, rating, body, verified, quote_id: q?.id ?? null, status: 'published' },
    { onConflict: 'workshop_id,user_id' }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Teavita töökoda (Resend, transaktsiooniline) — vaikselt
  try {
    const admin = createAdminClient();
    const { data: w } = await admin.from('workshops').select('name,email').eq('id', workshop_id).single();
    if (w?.email && process.env.RESEND_API_KEY) {
      const { sendTransactional } = await import('@/lib/email/resend');
      await sendTransactional({ kind: 'review_posted', to: w.email, subject: `Uus arvustus — ${w.name}`, html: `<p>Sinu töökojale lisati uus ${rating}-tärni arvustus.</p>` });
    }
  } catch { /* ignore */ }

  return NextResponse.json({ ok: true, verified });
}
