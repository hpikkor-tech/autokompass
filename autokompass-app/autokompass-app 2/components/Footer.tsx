import Link from 'next/link';
import { Mark, Icon } from './icons';

export function Footer() {
  return (
    <footer className="ft">
      <div className="ftgrid">
        <div className="ftbrand">
          <Link href="/" className="brand"><Mark /><span className="wm" style={{ color: '#fff' }}>Autokompass<i style={{ color: '#7C8DA3' }}>.ee</i></span></Link>
          <p className="ftabout">
            Eesti autotöökodade võrdlusportaal. Kirjelda oma muret, võrdle hindu ja arvustusi ning leia usaldusväärne meister — säästa aega ja raha.
          </p>
          <div className="fttrust">
            <span className="pill" style={{ background: 'rgba(255,255,255,.06)', color: '#B7C4D6' }}><Icon.shield /> Ehtsad arvustused</span>
            <span className="pill" style={{ background: 'rgba(255,255,255,.06)', color: '#B7C4D6' }}><Icon.check /> Kliendile tasuta</span>
          </div>
        </div>

        <div>
          <h4>Teenused</h4>
          <Link href="/tookojad?svc=rehvivahetus">Rehvivahetus</Link>
          <Link href="/tookojad?svc=olivahetus">Õlivahetus</Link>
          <Link href="/tookojad?svc=piduriklotsid">Piduriklotside vahetus</Link>
          <Link href="/tookojad?svc=diagnostika">Rikkediagnostika</Link>
          <Link href="/tookojad?svc=ulevaatus">Ülevaatuse eelkontroll</Link>
        </div>

        <div>
          <h4>Linnad</h4>
          <Link href="/tookojad?city=Tallinn">Autoremont Tallinn</Link>
          <Link href="/tookojad?city=Tartu">Autoremont Tartu</Link>
          <Link href="/tookojad?city=Pärnu">Autoremont Pärnu</Link>
          <Link href="/tookojad?city=Narva">Autoremont Narva</Link>
          <Link href="/tookojad?city=Rakvere">Autoremont Rakvere</Link>
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
        <span>© 2026 HPH INVEST OÜ · Autokompass.ee · Andmed pärinevad avalikest allikatest, sh Eesti äriregister. Fotod on illustratiivsed.</span>
        <span className="ftlinks">
          <Link href="/privaatsus">Privaatsus</Link>
          <Link href="/tingimused">Tingimused</Link>
          <Link href="/eemalda">Eemalda minu profiil</Link>
        </span>
      </div>
    </footer>
  );
}
