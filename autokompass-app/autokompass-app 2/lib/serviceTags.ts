import type { Workshop } from './types';

// Osal töökodadel on päris teenused (OSM service:vehicle:* → w.services).
// Ülejäänutel tuletame sildid nimest, kuni nad oma profiili lunastavad.

export type SvcCat = { slug: string; label: string; kw: RegExp };

// Filtririba põhikategooriad (nime-tuletuse jaoks).
export const SVC_CATS: SvcCat[] = [
  { slug: 'rehvivahetus', label: 'Rehvivahetus', kw: /rehv|kummi|tyre|tire|vianor|rattad|rehvi/i },
  { slug: 'autoklaas', label: 'Autoklaas', kw: /klaas|glass|carglass|autoklaas/i },
  { slug: 'keretood', label: 'Keretööd ja värvimine', kw: /kere|v[äa]rv|detailing|cargloss|luxury/i },
  { slug: 'ulevaatus', label: 'Ülevaatus ja diagnostika', kw: /[üu]levaat|tehno|diagnos/i },
];

// svc-slug → millised päris teenusesildid sinna kuuluvad
const SVC_SERVICE_MAP: Record<string, string[]> = {
  rehvivahetus: ['Rehvivahetus', 'Rehviparandus', 'Sillastend', 'Veokirehvid'],
  autoklaas: ['Autoklaas', 'Tuuleklaas'],
  keretood: ['Keretood', 'Autovarvimine', 'Detailing'],
  ulevaatus: ['Ulevaatus', 'Diagnostika'],
  olivahetus: ['Olivahetus', 'Hooldus'],
  piduriklotsid: ['Piduriremont'],
  diagnostika: ['Diagnostika'],
  kliima: ['Kliimahooldus'],
  vedrustus: ['Vedrustus', 'Sillastend'],
  mootoriremont: ['Mootoriremont', 'Diiselremont', 'Kaigukast'],
};

export const GENERAL_SVC: Record<string, string> = {
  autoremont: 'Autoremont',
  olivahetus: 'Õlivahetus',
  piduriklotsid: 'Piduriklotside vahetus',
  diagnostika: 'Rikkediagnostika',
  kliima: 'Kliimaseadme hooldus',
  vedrustus: 'Rooliotsad ja vedrustus',
  mootoriremont: 'Mootoriremont',
};

// Nime-põhised sildid (kui päris teenuseid pole)
function tagsFromName(name: string): string[] {
  const t = SVC_CATS.filter((c) => c.kw.test(name)).map((c) => c.label);
  return t.length ? t.slice(0, 3) : ['Autoremont ja hooldus'];
}

// Kaardil kuvatavad teenusesildid: päris teenused või nime-tuletus
export function displayServices(w: Workshop): string[] {
  if (w.services && w.services.length) return w.services.slice(0, 5);
  return tagsFromName(w.name);
}

// Kas töökoda vastab teenusefiltrile? Eelistab päris teenuseid, muidu nime.
export function matchesSvcW(w: Workshop, svc: string): boolean {
  if (!svc) return true;
  const labels = SVC_SERVICE_MAP[svc];
  if (w.services && w.services.length) {
    return labels ? labels.some((l) => w.services.includes(l)) : true;
  }
  const cat = SVC_CATS.find((c) => c.slug === svc);
  if (cat) return cat.kw.test(w.name);
  return true; // üldteenus, andmed puuduvad → näita
}

export function svcLabel(svc: string): string | null {
  const cat = SVC_CATS.find((c) => c.slug === svc);
  if (cat) return cat.label;
  return GENERAL_SVC[svc] ?? null;
}
