'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Mark, Icon } from './icons'; import { createClient } from '@/lib/supabase/client';

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); const [user, setUser] = useState<{ email: string } | null>(null); useEffect(() => { createClient().auth.getUser().then(({ data }) => setUser(data.user ? { email: data.user.email ?? '' } : null)); }, [pathname]);

  // Sulge menüü lehe vahetusel.
  useEffect(() => { setOpen(false); }, [pathname]);

  // NB! Siin oli varem `document.body.style.overflow = 'hidden'`.
  // iOS Safaris katkestab see keritud lehel sticky-päise positsioneerimise:
  // päis hüppab tagasi dokumendi algusesse ja koos sellega ka avatud menüü --
  // kasutaja pidi menüü nägemiseks üles kerima. Kerimislukk on nüüd CSS-is:
  // .navscrim { touch-action: none } ei lase tumendatud taustal lehte kerida.
  // Teine pool parandust on globals/filters.css-is: mobiilis eemaldame päiselt
  // `backdrop-filter`-i, sest see teeb päisest `position: fixed` järglaste
  // sisaldava ploki ja menüü ei ole siis ekraani, vaid päise suhtes fikseeritud.

  return (
    <header className={'site' + (open ? ' menu-open' : '')}>
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
          {user ? <Link href="/konto" className="btn btn-p btn-sm"><Icon.user /> Minu konto</Link> : <Link href="/sisene?mode=client" className="btn btn-p btn-sm"><Icon.user /> Sisene</Link>}
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
              {user ? <Link href="/konto" className="btn btn-p btn-block"><Icon.user /> Minu konto</Link> : <Link href="/sisene?mode=client" className="btn btn-p btn-block"><Icon.user /> Sisene</Link>}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
