import Link from 'next/link';
import { Icon, Stars } from './icons';
import type { Workshop } from '@/lib/types';

const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#e8edf3"/><rect x="150" y="120" width="100" height="60" rx="8" fill="#c9d6e3"/></svg>');

// Foto ja Google reiting tulevad DB-st (cron varskendab 25 paeva jarel).
// Varem tegi iga kaart 2 Google Places kutset renderdamise ajal.
export function WorkshopCard({ w }: { w: Workshop }) {
  const img = w.logo_url || (w.photos && w.photos[0]) || w.photo_url || PLACEHOLDER;
  const rating = w.rating_count > 0 ? w.rating_avg : (w.google_rating ? Number(w.google_rating) : 0);
  const rcount = w.rating_count > 0 ? w.rating_count : (w.google_rating_count ?? 0);
  const priceFrom = w.svc_rows?.reduce<number | null>((min, s) => (s.price_from != null && (min == null || s.price_from < min) ? s.price_from : min), null);
  return (
    <Link href={`/tookoda/${w.slug}`} className="wscard">
      <div className="ph">
        <img src={img} alt={w.name} />
        {w.claimed && <div className="tag"><span className="badge-v"><Icon.check /> Kontrollitud</span></div>}
      </div>
      <div className="bd">
        <div className="nm">{w.name}</div>
        <div className="meta">
          <span className="rate"><Stars /> {rating > 0 ? rating.toFixed(1).replace('.', ',') : '—'} <span style={{ color: 'var(--muted-2)' }}>({rcount})</span></span>
        </div>
        <div className="meta"><Icon.pin /> {w.city}{w.dist_km != null ? ` · ${w.dist_km.toFixed(1)} km` : ''}</div>
        <div className="svc">{(w.services?.length ? w.services : (w.svc_rows?.map((s) => s.category?.name_et).filter(Boolean) as string[]))?.slice(0, 3).join(' · ') || 'Autoremont ja hooldus'}</div>
        <div className="foot">
          <div className="price"><small>Alates</small><b>{priceFrom != null ? `${priceFrom} €` : '—'}</b></div>
          <span className="btn btn-o btn-sm">Vaata <Icon.arwr /></span>
        </div>
      </div>
    </Link>
  );
}
