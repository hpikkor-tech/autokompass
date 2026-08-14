// Kuna päris töökodadel (avaandmetest) pole veel kategoriseeritud teenuseid,
// tuletame sildid nimest. Kui töökoda lunastab profiili, saab ta täpsed lisada.

export type SvcCat = { slug: string; label: string; kw: RegExp };

// Spetsialiseeritud kategooriad, mida saab nime järgi ära tunda.
export const SVC_CATS: SvcCat[] = [
  { slug: 'rehvivahetus', label: 'Rehvivahetus', kw: /rehv|kummi|tyre|tire|vianor|rattad|rehvi/i },
  { slug: 'autoklaas', label: 'Autoklaas', kw: /klaas|glass|carglass|autoklaas/i },
  { slug: 'keretood', label: 'Keretööd ja värvimine', kw: /kere|v[äa]rv|detailing|cargloss|luxury/i },
  { slug: 'ulevaatus', label: 'Ülevaatus ja diagnostika', kw: /[üu]levaat|tehno|diagnos/i },
];

// Üldteenused (iga töökoda teeb) — ei filtreeri nime järgi, ainult konteksti pealkiri.
export const GENERAL_SVC: Record<string, string> = {
  autoremont: 'Autoremont',
  olivahetus: 'Õlivahetus',
  piduriklotsid: 'Piduriklotside vahetus',
  diagnostika: 'Rikkediagnostika',
  kliima: 'Kliimaseadme hooldus',
  vedrustus: 'Rooliotsad ja vedrustus',
  mootoriremont: 'Mootoriremont',
};

export function tagsFor(name: string): string[] {
  const t = SVC_CATS.filter((c) => c.kw.test(name)).map((c) => c.label);
  return t.length ? t.slice(0, 3) : ['Autoremont ja hooldus'];
}

// Kas töökoda vastab teenusefiltrile? Spetsialiseeritud → nime järgi; üld → alati.
export function matchesSvc(name: string, svc: string): boolean {
  if (!svc) return true;
  const cat = SVC_CATS.find((c) => c.slug === svc);
  if (cat) return cat.kw.test(name);
  return true; // üldteenus: iga töökoda sobib
}

export function svcLabel(svc: string): string | null {
  const cat = SVC_CATS.find((c) => c.slug === svc);
  if (cat) return cat.label;
  return GENERAL_SVC[svc] ?? null;
}
