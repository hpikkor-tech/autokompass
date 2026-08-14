import Link from 'next/link';
import type { Metadata } from 'next';
import { Icon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Kasutustingimused | Autokompass',
  description:
    'Autokompass.ee kasutustingimused: teenuse kirjeldus, kasutaja ja töökoja õigused ning kohustused, vastutuse piirang ja kohaldatav õigus.',
};

const UPDATED = '14. august 2026';

export default function Tingimused() {
  return (
    <main>
      <section className="bloghero">
        <div className="wrap">
          <span className="eyebrow">Õiguslik teave</span>
          <h1>Kasutustingimused</h1>
          <p>Kokkulepe, mis kehtib Autokompass.ee kasutamisel. Palun loe need läbi enne portaali kasutamist.</p>
        </div>
      </section>

      <section className="blk" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <article className="legal">
            <p className="legal-upd">Viimati uuendatud: {UPDATED}</p>

            <h2>1. Teenuse kirjeldus</h2>
            <p>Autokompass.ee on Eesti autotöökodade võrdlus- ja kataloogiportaal, mida haldab <b>HPH INVEST OÜ</b> (registrikood 16146970). Portaal aitab autojuhil leida ja võrrelda töökodi ning saata neile hinnapäringuid. Autokompass ei ole remonditeenuse osutaja ega vahenda lepingut — leping sõlmitakse alati otse kasutaja ja töökoja vahel.</p>

            <h2>2. Kliendile tasuta</h2>
            <p>Töökodade otsimine, võrdlemine ja hinnapäringu saatmine on autojuhile <b>alati tasuta</b>. Me ei võta kliendilt vahendustasu.</p>

            <h2>3. Töökodade profiilid</h2>
            <p>Osa profiile on koostatud avalikest allikatest. Töökoja omanik saab oma profiili tasuta üle võtta, andmeid täiendada ja hallata. Töökoda vastutab enda esitatud andmete (hinnad, teenused, kontakt) õigsuse eest.</p>

            <h2>4. Esiletõst ja tasulised teenused</h2>
            <p>Töökoda võib soovi korral osta nähtavama koha (esiletõst). Tasulised teenused ja nende tingimused lepitakse kokku eraldi. Esiletõst ei mõjuta arvustuste ega hinnangute sisu.</p>

            <h2>5. Arvustused</h2>
            <p>Arvustused peavad põhinema tegelikul kogemusel. Jätame endale õiguse eemaldada sisu, mis on eksitav, solvav, õigusvastane või rikub kolmandate isikute õigusi.</p>

            <h2>6. Vastutuse piirang</h2>
            <p>Teeme mõistlikke jõupingutusi, et portaali info oleks täpne, kuid ei garanteeri avalikest allikatest pärineva info täielikkust ega ajakohasust. Autokompass ei vastuta töökoja osutatud teenuse kvaliteedi ega kasutaja ja töökoja vahelise lepingu eest.</p>

            <h2>7. Intellektuaalomand</h2>
            <p>Portaali kujundus, tekstid ja kaubamärgid kuuluvad HPH INVEST OÜ-le. Avaandmete puhul järgime allikate litsentsitingimusi (nt OpenStreetMap © kaastöölised).</p>

            <h2>8. Kohaldatav õigus</h2>
            <p>Tingimustele kohaldatakse Eesti Vabariigi õigust. Vaidlused lahendatakse läbirääkimiste teel, kokkuleppe puudumisel Pärnu Maakohtus.</p>

            <p style={{ marginTop: 28 }}>
              <Link className="backlink" href="/"><Icon.arwr /> Tagasi avalehele</Link>
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
