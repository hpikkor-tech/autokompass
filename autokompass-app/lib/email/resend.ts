import { Resend } from 'resend';

/**
 * RESEND = AINULT TRANSAKTSIOONILINE e-post.
 * Lubatud: päringu kinnitused, arvustuse teavitused, konto/parool, kviitungid.
 * KEELATUD: külmpostitus, töökodade onboarding-outreach, uudiskirjad, kampaaniad.
 *   -> selleks on AgentMail (lib/email/agentmail.ts), eraldi domeeniga.
 * Reegli rikkumine võib Resendi konto sulgeda — hoia liinid rangelt lahus.
 */

// Laisk initsialiseerimine — ei kuku build-ajal, kui võti puudub.
let _resend: Resend | null = null;
function client() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

// Ainult need tüübid on transaktsioonilised ja Resendiga lubatud.
export type TxKind =
  | 'quote_received'      // töökojale: uus päring
  | 'quote_confirmation'  // kliendile: päring saadetud
  | 'review_posted'       // töökojale: uus arvustus
  | 'account';            // konto/parool

export async function sendTransactional(opts: {
  kind: TxKind;
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const r = client();
  if (!r) return { skipped: true as const };  // võti puudub — ära saada
  return r.emails.send({
    from: process.env.RESEND_FROM ?? 'Autokompass <teavitus@autokompass.ee>',
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    headers: { 'X-Entity-Ref': `tx:${opts.kind}` },
  });
}
