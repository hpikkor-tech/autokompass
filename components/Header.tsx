import Link from 'next/link';
import { Mark, Icon } from './icons';

export function Header() {
  return (
    <header className="site">
      <div className="nav">
        <Link href="/" className="brand">
          <Mark />
          <span className="wm">Autokompass<i>.ee</i></span>
        </Link>
        <nav className="links">
          <Link href="/tookojad">Töökojad</Link>
          <Link href="/#kuidas">Kuidas töötab</Link>
          <Link href="/#linnad">Linnad</Link>
          <Link href="/blogi">Blogi</Link>
        </nav>
        <div className="right">
          <Link href="/sisene?mode=shop" className="ghost">Lisa oma töökoda</Link>
          <Link href="/sisene?mode=client" className="btn btn-p btn-sm"><Icon.user /> Sisene</Link>
        </div>
      </div>
    </header>
  );
}
