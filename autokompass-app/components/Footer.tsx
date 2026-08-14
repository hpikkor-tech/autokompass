import Link from 'next/link';
import { Mark, Icon } from './icons';

export function Footer() {
  return (
    <footer className="ft">
      <div className="ftgrid">
        <div className="ftbrand">
          <Link href="/" className="brand"><Mark /><span className="wm" style={{ color: '#fff' }}>Autokompass<i style={{ color: '#7C8DA3' }}>.ee</i></span></Link>
          <p className="ftabout">
            Eesti kõige põhjalikum autotöökodade kataloog — üle 1 200 töökoja ühes kohas. Võrdle hindu, teenuseid ja arvustusi ning leia usaldusväärne meister sekunditega. Ausalt, ilma müügijututa.
          </p>
          <div className="fttrust">
            <span className="pill" style={{ background: 'rgba(255,255,255,.06)', color: '#B7C4D6' }}><Icon.shield /> Ehtsad arvustused</span>
            <span className="pill" style={{ background: 'rgba(255,255,255,.06)', color: '#B7C4D6' }}><Icon.check /> Kliendile tasuta</span>
          </div>
        </div>

        <div>
          <h4>Teenused</h4>
          <Link href="/rehvivahetus">Rehvivahetus</Link>
          <Link href="/autoremont">Autoremont</Link>
          <Link href="/olivahetus">Õlivahetus</Link>
          <Link href="/autoklaasi-vahetus">Autoklaasi vahetus</Link>
          <Link href="/autodiagnostika">Rikkediagnostika</Link>
        </div>

        <div>
          <h4>Linnad</h4>
          <Link href="/rehvivahetus/tallinn">Rehvivahetus Tallinnas</Link>
          <Link href="/rehvivahetus/tartu">Rehvivahetus Tartus</Link>
          <Link href="/autoremont/tallinn">Autoremont Tallinnas</Link>
          <Link href="/autoremont/tartu">Autoremont Tartus</Link>
          <Link href="/autoremont/rakvere">Autoremont Rakveres</Link>
        </div>

        <div>
          <h4>Autokompass</h4>
          <Link href="/#kuidas">Kuidas töötab</Link>
          <Link href="/blogi">Blogi</Link>
          <Link href="/sisene?mode=shop">Lisa oma töökoda</Link>
          <Link href="/hinnakiri">Esiletõstu hinnakiri</Link>
        </div>

        <div>
          <h4>Kontakt</h4>
          <a href="mailto:info@autokompass.ee"><Icon.send /> info@autokompass.ee</a>
          <div className="ftcompany">
            <span>Portaali haldab</span>
            <b>HPH INVEST OÜ</b>
            <span>Reg nr 16146970</span>
            <span>Lai tn 15a, Pärnu 80010</span>
          </div>
        </div>
      </div>

      <div className="ftbot">
        <span>© 2026 HPH INVEST OÜ · Autokompass.ee · Eesti kõige põhjalikum autotöökodade kataloog</span>
        <span className="ftlinks">
          <Link href="/privaatsus">Privaatsus</Link>
          <Link href="/tingimused">Tingimused</Link>
          <Link href="/hinnakiri">Hinnakiri</Link>
        </span>
      </div>
    </footer>
  );
}
