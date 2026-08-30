'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/icons';

const KEY = 'ak:listing';

// Listingu lehel: jätab praeguse filtri-URL-i meelde (sessiooniks).
export function RememberListing() {
  useEffect(() => {
    try { sessionStorage.setItem(KEY, window.location.pathname + window.location.search); } catch { /* privaatne režiim */ }
  });
  return null;
}

// Töökoja profiilil: "Tagasi" viib tagasi samade filtritega nimekirja.
export function BackToListing({ fallback = '/tookojad', label = 'Tagasi töökodade juurde' }: { fallback?: string; label?: string }) {
  const [href, setHref] = useState(fallback);
  useEffect(() => {
    try { const s = sessionStorage.getItem(KEY); if (s && s.startsWith('/tookojad')) setHref(s); } catch { /* privaatne režiim */ }
  }, []);
  return <Link className="backlink" href={href}><Icon.arwr /> {label}</Link>;
}
