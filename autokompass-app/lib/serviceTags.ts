import type { Workshop } from './types';

// group: 'yld'    = teenus, mida pakub peaaegu iga tookoda (filter ei kitsenda palju)
//        'eriala' = tookoja tegelik spetsialiseerumine (filter kitsendab reaalselt)
// Miks see vahe on oluline: 31.08 audit naitas, et 'Olivahetus' annab 1652/1751,
// 'Piduritood' 1648 ja 'Diagnostika' 1655. Kolm eraldi filtrit, mis annavad sama
// tulemuse, teevad filtririba kasutuks. Nuud on need kokku uhe pealkirja alla
// grupeeritud ja kasutaja naeb kohe, millised valikud teda pariselt aitavad.
export type SvcCat = { slug: string; label: string; kw: RegExp; group: 'yld' | 'eriala' };

export const SVC_CATS: SvcCat[] = [
  { slug: 'autoremont', label: 'Autoremont ja hooldus', kw: /auto|remont|hoold|service|teenindus|motors/i, group: 'yld' },
  { slug: 'olivahetus', label: 'Õlivahetus', kw: /[õo]livahetus|[õo]li/i, group: 'yld' },
  { slug: 'piduriklotsid', label: 'Piduritööd', kw: /pidur/i, group: 'yld' },
  { slug: 'diagnostika', label: 'Diagnostika ja elekter', kw: /diagnos|elekt/i, group: 'yld' },

  { slug: 'rehvivahetus', label: 'Rehvivahetus', kw: /rehv|kummi|tyre|tire|vianor|rattad|rehvi/i, group: 'eriala' },
  { slug: 'keretood', label: 'Keretööd ja värvimine', kw: /kere|v[äa]rv|detailing|cargloss|luxury/i, group: 'eriala' },
  { slug: 'autoklaas', label: 'Autoklaas', kw: /klaas|glass|carglass|autoklaas/i, group: 'eriala' },
  { slug: 'kliima', label: 'Kliimahooldus', kw: /kliima|konditsioneer/i, group: 'eriala' },
  { slug: 'autopesu', label: 'Autopesu', kw: /pesula|autopesu|car ?wash/i, group: 'eriala' },
  { slug: 'detailing', label: 'Detailing', kw: /detailing|autokeemia|poleer/i, group: 'eriala' },
  { slug: 'vedrustus', label: 'Vedrustus ja rooliotsad', kw: /vedrust|amort|rooliots|sillastend/i, group: 'eriala' },
  { slug: 'mootoriremont', label: 'Mootoriremont', kw: /mootoriremont|diisel|k[äa]igukast/i, group: 'eriala' },
  { slug: 'ulevaatus', label: 'Ülevaatus', kw: /[üu]levaat|tehno/i, group: 'eriala' },
];

const SVC_SERVICE_MAP: Record<string, string[]> = {
  autoremont: ['Autoremont', 'Hooldus', 'Mootoriremont', 'Veokiremont'],
  rehvivahetus: ['Rehvivahetus', 'Rehviparandus', 'Sillastend', 'Veokirehvid'],
  autoklaas: ['Autoklaas', 'Tuuleklaas'],
  keretood: ['Keretööd', 'Keretood', 'Autovärvimine', 'Autovarvimine', 'Detailing'],
  ulevaatus: ['Ülevaatus', 'Ulevaatus'],
  olivahetus: ['Õlivahetus', 'Olivahetus', 'Hooldus'],
  piduriklotsid: ['Piduriremont'],
  diagnostika: ['Diagnostika', 'Autoelekter'],
  kliima: ['Kliimahooldus'],
  autopesu: ['Autopesu'],
  detailing: ['Detailing'],
  vedrustus: ['Vedrustus', 'Sillastend'],
  mootoriremont: ['Mootoriremont', 'Diiselremont', 'Kaigukast'],
};

// Uldiste teenuste juurde kaiv margis listingus ja maandumislehtedel.
export const GENERAL_SVC: Record<string, string> = {
  autoremont: 'Autoremont',
  olivahetus: 'Õlivahetus',
  piduriklotsid: 'Piduriklotside vahetus',
  diagnostika: 'Rikkediagnostika',
  kliima: 'Kliimaseadme hooldus',
  vedrustus: 'Rooliotsad ja vedrustus',
  mootoriremont: 'Mootoriremont',
};

function tagsFromName(name: string): string[] {
  const t = SVC_CATS.filter((c) => c.slug !== 'autoremont' && c.kw.test(name)).map((c) => c.label);
  return t.length ? t.slice(0, 3) : ['Autoremont ja hooldus'];
}

export function displayServices(w: Workshop): string[] {
  if (w.services && w.services.length) return w.services.slice(0, 5);
  return tagsFromName(w.name);
}

export function matchesSvcW(w: Workshop, svc: string): boolean {
  if (!svc) return true;
  const labels = SVC_SERVICE_MAP[svc];
  if (w.services && w.services.length) {
    if (labels) return labels.some((l) => w.services!.includes(l));
    // Tundmatu slug: ara naita koiki tookodi, nagu varem juhtus (?svc=suvaline
    // andis 1751 vastet ja valeliku pealkirja).
    return false;
  }
  const cat = SVC_CATS.find((c) => c.slug === svc);
  if (cat) return cat.kw.test(w.name);
  return false;
}

export function svcLabel(svc: string): string | null {
  const cat = SVC_CATS.find((c) => c.slug === svc);
  if (cat) return cat.label;
  return GENERAL_SVC[svc] ?? null;
}
