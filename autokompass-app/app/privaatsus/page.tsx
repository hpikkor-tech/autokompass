import Link from 'next/link';
import type { Metadata } from 'next';
import { Icon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Privaatsuspoliitika | Autokompass',
  description:
    'Kuidas Autokompass (HPH INVEST OÜ) kogub, kasutab ja kaitseb isikuandmeid. Andmete päritolu, sinu õigused ja kuidas eemaldada oma töökoja profiil.',
};

const UPDATED = '14. august 2026';

export default function Privaatsus() {
  return (
    <main>
      <section className="bloghero">
        <div className="wrap">
          <span className="eyebrow">Õiguslik teave</span>
          <h1>Privaatsuspoliitika</h1>
          <p>Selgitame lihtsas keeles, milliseid andmeid kogume, miks ja kuidas neid kaitseme — ning kuidas saad oma õigusi kasutada.</p>
        </div>
      </section>

      <section className="blk" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <article className="legal">
            <p className="legal-upd">Viimati uuendatud: {UPDATED}</p>

            <h2>1. Vastutav töötleja</h2>
            <p>Autokompass.ee portaali haldab <b>HPH INVEST OÜ</b> (registrikood 16146970), aadress Lai tn 15a, Pärnu 80010, Eesti. Andmekaitse küsimustes saad meiega ühendust võtta e-posti teel <a href="mailto:info@autokompass.ee">info@autokompass.ee</a>.</p>

            <h2>2. Milliseid andmeid me kogume</h2>
            <p>Kogume ja töötleme järgmisi andmeid:</p>
            <ul>
              <li><b>Töökodade andmed</b> — nimi, aadress, kontaktandmed, teenused ja lahtiolekuajad, mis pärinevad avalikest allikatest (vt punkt 3).</li>
              <li><b>Päringu andmed</b> — kui saadad töökojale hinnapäringu, kogume sinu nime, telefoninumbri ja kirjelduse, et päring edastada.</li>
              <li><b>Arvustused</b> — sinu jäetud hinnang ja kommentaar.</li>
              <li><b>Tehnilised andmed</b> — anonüümne kasutusstatistika (nt külastatud lehed), et portaali parandada.</li>
            </ul>

            <h2>3. Töökodade andmete päritolu</h2>
            <p>Osa töökodade profiile on koostatud <b>avalikest allikatest</b> — sealhulgas Eesti äriregister ja OpenStreetMap kaastööliste avaandmed. Töötleme neid andmeid õigustatud huvi alusel (isikuandmete kaitse üldmääruse artikkel 6(1)(f)), et pakkuda autojuhtidele kasulikku ja terviklikku töökodade kataloogi. Kui oled töökoja omanik, saad oma profiili igal ajal üle võtta, seda parandada või paluda selle eemaldamist (vt punkt 7).</p>

            <h2>4. Kuidas me andmeid kasutame</h2>
            <p>Kasutame andmeid ainult selleks, et: kuvada töökodade infot ja võrdlust; edastada sinu hinnapäring valitud töökojale; avaldada arvustusi; ning portaali toimimist parandada. Me <b>ei müü</b> sinu isikuandmeid kolmandatele osapooltele.</p>

            <h2>5. Andmetöötluse partnerid</h2>
            <p>Kasutame usaldusväärseid teenusepakkujaid, kes töötlevad andmeid meie nimel: veebimajutus ja andmebaas (Vercel, Supabase) ning e-kirjade saatmine (Resend). Kõik partnerid järgivad kehtivaid andmekaitsenõudeid.</p>

            <h2>6. Säilitamine ja küpsised</h2>
            <p>Säilitame andmeid nii kaua, kui see on vajalik teenuse osutamiseks või seadusest tulenevalt. Kasutame üksnes toimimiseks vajalikke küpsiseid; me ei kasuta reklaami- ega jälgimisküpsiseid ilma sinu nõusolekuta.</p>

            <h2>7. Sinu õigused</h2>
            <p>Sul on õigus tutvuda oma andmetega, neid parandada, piirata nende töötlemist, esitada vastuväiteid ning nõuda kustutamist. Kaebuse saad esitada Andmekaitse Inspektsioonile (aki.ee).</p>
            <div className="legal-box">
              <h3><Icon.shield /> Kas soovid oma töökoja profiili eemaldada?</h3>
              <p>Kui oled töökoja omanik ja soovid, et su profiil eemaldataks Autokompassist, kirjuta meile aadressil <a href="mailto:info@autokompass.ee?subject=Profiili%20eemaldamine">info@autokompass.ee</a> märksõnaga „Profiili eemaldamine" ja lisa töökoja nimi. Eemaldame profiili põhjendamatu viivituseta, hiljemalt 7 päeva jooksul.</p>
            </div>

            <h2>8. Muudatused</h2>
            <p>Võime seda privaatsuspoliitikat aeg-ajalt uuendada. Olulistest muudatustest teavitame portaalis. Kehtiva versiooni leiad alati siit lehelt.</p>

            <p style={{ marginTop: 28 }}>
              <Link className="backlink" href="/"><Icon.arwr /> Tagasi avalehele</Link>
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
