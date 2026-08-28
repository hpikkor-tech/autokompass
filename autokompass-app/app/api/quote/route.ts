import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { sendTransactional } from '@/lib/email/resend';

// Uus pakkumise päring -> salvesta + teavita töökoda (Resend, transaktsiooniline).
export async function POST(req: Request) {
  const body = await req.json();
  const { workshop_id, message, phone, name, category_id } = body ?? {};
  if (!workshop_id || !message || !phone) {
    return NextResponse.json({ error: 'Puuduvad väljad' }, { status: 400 });
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin0 = createAdminClient(); const { count: qc } = await admin0.from('quotes').select('id', { count: 'exact', head: true }).eq('phone', phone).gte('created_at', new Date(Date.now() - 3600000).toISOString()); if ((qc ?? 0) >= 6) return NextResponse.json({ error: 'Liiga palju paringuid, proovi hiljem' }, { status: 429 }); const { data: quote, error } = await supabase
    .from('quotes')
    .insert({ workshop_id, message, phone, name: name ?? null, category_id: category_id ?? null, user_id: user?.id ?? null })
    .select('id').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Teavita töökoda (kui e-post olemas). Resend = ainult transaktsiooniline.
  try {
    const admin = createAdminClient();
    const { data: w } = await admin.from('workshops').select('name,email').eq('id', workshop_id).single();
    if (w?.email && process.env.RESEND_API_KEY) {
      await sendTransactional({
        kind: 'quote_received',
        to: w.email,
        subject: `Uus päring Autokompassist — ${w.name}`,
        html: `<p>Sulle saabus uus päring.</p><p><b>Mure:</b> ${escapeHtml(message)}</p><p><b>Telefon:</b> ${escapeHtml(phone)}</p>`,
      });
    }
  } catch { /* teavitus ei tohi päringu salvestamist katkestada */ }

  return NextResponse.json({ ok: true, id: quote.id });
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
