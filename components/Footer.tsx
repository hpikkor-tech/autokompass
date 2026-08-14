import Link from 'next/link';
import { Mark } from './icons';

export function Footer() {
  return (
    <footer className="ft">
      <div className="ftgrid">
        <div>
          <Link href="/" className="brand"><Mark /><span className="wm" style={{ color: '#fff' }}>Autokompass<i style={{ color: '#7C8DA3' }}>.ee</i></span></Link>
          <p style={{ color: '#8fa0b5', fontSize: 14.5, marginTop: 14, maxWidth: 280 }}>
            Eesti suurim autotöökodade kataloog. Leia usaldusväärne meister, võrdle hindu ja säästa aega ja raha.
          </p>
        </div>
        <div>
          <h4>Teenused</h4>
          <Link href="/tookojad?svc=olivahetus">Õlivahetus</Link>
          <Link href="/tookojad?svc=rehvivahetus">Rehvivahetus</Link>
          <Link href="/tookojad?svc=piduriklotsid">Piduriklotside vahetus</Link>
          <Link href="/tookojad?svc=diagnostika">Rikkediagnostika</Link>
        </div>
        <div>
          <h4>Linnad</h4>
          <Link href="/tookojad?city=Tallinn">Autoremont Tallinn</Link>
          <Link href="/tookojad?city=Tartu">Autoremont Tartu</Link>
          <Link href="/tookojad?city=Pärnu">Autoremont Pärnu</Link>
          <Link href="/tookojad?city=Narva">Autoremont Narva</Link>
        </div>
        <div>
          <h4>Töökojale</h4>
          <Link href="/sisene?mode=shop">Lisa oma töökoda</Link>
          <Link href="/sisene?mode=shop">Sisene</Link>
          <Link href="/hinnakiri">Hinnakiri</Link>
        </div>
      </div>
      <div className="ftbot" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <span>© 2026 Autokompass OÜ · Andmed: Eesti äriregister · Fotod illustratiivsed</span>
        <span style={{ display: 'flex', gap: 18 }}>
          <Link href="/privaatsus">Privaatsus</Link>
          <Link href="/tingimused">Tingimused</Link>
          <Link href="/eemalda">Eemalda minu profiil</Link>
        </span>
      </div>
    </footer>
  );
}
