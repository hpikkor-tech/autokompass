'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Mark, Icon } from './icons';

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Sulge menüü lehe vahetusel.
  useEffect(() => { setOpen(false); }, [pathname]);
  // Lukusta taustakerimine, kui menüü on lahti.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="site">
      <div className="nav">
        <Link href="/" className="brand" aria-label="Autokompass avaleht">
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

        <button
          className="navtoggle"
          aria-label={open ? 'Sulge menüü' : 'Ava menüü'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Icon.close /> : <Icon.menu />}
        </button>
      </div>

      {open && (
        <>
          <div className="navscrim" onClick={() => setOpen(false)} />
          <div className="navsheet" role="dialog" aria-label="Menüü">
            <Link href="/tookojad">Töökojad</Link>
            <Link href="/#kuidas">Kuidas töötab</Link>
            <Link href="/#linnad">Linnad</Link>
            <Link href="/blogi">Blogi</Link>
            <div className="navsheet-actions">
              <Link href="/sisene?mode=shop" className="btn btn-o btn-block">Lisa oma töökoda</Link>
              <Link href="/sisene?mode=client" className="btn btn-p btn-block"><Icon.user /> Sisene</Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
