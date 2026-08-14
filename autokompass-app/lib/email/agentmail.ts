import { AgentMailClient } from 'agentmail';

/**
 * AGENTMAIL = VÄLINE suhtlus / OUTREACH (eraldi tööriist + eraldi domeen).
 * Kasutus: töökodade kutsumine platvormile (lunasta oma profiil), järelkontakt,
 *   agent-hallatud vestlused. Kõik outreach käib SIIT, mitte Resendist.
 * Domeen: AGENTMAIL_OUTREACH_DOMAIN (nt outreach.autokompass.ee) — lahus
 *   transaktsioonilisest domeenist, et saatja-reputatsioonid ei seguneks.
 */

let _client: AgentMailClient | null = null;
function client() {
  if (!_client) _client = new AgentMailClient({ apiKey: process.env.AGENTMAIL_API_KEY! });
  return _client;
}

// Loo (või taaskasuta) outreach-postkast.
export async function getOutreachInbox(username = 'kompu') {
  return client().inboxes.create({
    username,
    domain: process.env.AGENTMAIL_OUTREACH_DOMAIN,
    displayName: 'Autokompass',
  });
}

export async function sendOutreach(opts: {
  inboxId: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  return client().inboxes.messages.send(opts.inboxId, {
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}

/**
 * NB GDPR / e-privaatsus: outreach ainult äriliste kontaktide (töökodade) suunas,
 * selge äratundmine + kohene loobumisvõimalus (opt-out link) igas kirjas.
 * Ära outreach'i eraisikutele.
 */
