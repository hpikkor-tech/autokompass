import Link from 'next/link';
import { Icon, Stars } from './icons';
import { OpenStatus } from './OpenStatus';
import { displayServices } from '@/lib/serviceTags';
import { compactHours } from '@/lib/hours';
import type { Workshop } from '@/lib/types';
import { GThumb } from './GPlace';

function thumbColor(name: string) {
  const cols = ['#0B5394', '#0A8F63', '#B4700F', '#5B3FA8', '#B03A5B', '#2B6CB0', '#1F7A5A'];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return cols[h % cols.length];
}
export function WorkshopRow({ w }: { w: Workshop }) {
  const feat = w.featured_tier !== 'none';
  const services = displayServices(w);
  const hrs = compactHours(w.opening_hours);
  return (
    <div className={'rowcard' + (feat ? ' feat' : '')}>
      {feat && <div className="feat-tag">Esiletõstetud</div>}
      <Link href={`/tookoda/${w.slug}`} className="rthumb" style={{ background: `linear-gradient(135deg, ${thumbColor(w.name)}, ${thumbColor(w.name)}cc)` }} aria-label={w.name}>
        <GThumb w={w} />
      </Link>
      <div className="rmid">
        <Link href={`/tookoda/${w.slug}`} className="rnm">{w.name}
          {w.claimed && <span className="badge-v"><Icon.check /> Kontrollitud</span>}
        </Link>
        <div className="rmeta"><Icon.pin /> {w.address || w.city || 'Eesti'}{w.opening_hours && <><span className="dot">·</span><OpenStatus hours={w.opening_hours} /></>}</div>
        <div className="rtags">
          {w.brand && <span className="stag brand"><Icon.check /> {w.brand.replace(/;/g, ' · ')}</span>}
          {services.map((t) => <span key={t} className="stag">{t}</span>)}
          {w.website && <a href={w.website} target="_blank" rel="noreferrer" className="stag link"><Icon.arwr /> Veeb</a>}
        </div>
        {hrs && <div className="rhrs"><Icon.clock /> {hrs}</div>}
      </div>
      <div className="rright">
        <div className="rrate">
          {w.rating_count > 0 ? (
            <><div className="num">{w.rating_avg.toFixed(1).replace('.', ',')}</div><Stars /><div className="rc">{w.rating_count} arvustust</div></>
          ) : (
            w.google_rating && w.google_rating_count ? <><div className="num">{Number(w.google_rating).toFixed(1).replace('.', ',')}</div><Stars /><div className="rc">{w.google_rating_count} arvustust Google&apos;is</div></> : <span className="newpill">Arvustusi veel pole</span>
          )}
        </div>
        <div className="ract">
          {w.phone && <a href={`tel:${w.phone.replace(/\s/g, '')}`} className="btn btn-o btn-sm"><Icon.phone /> Helista</a>}
          <Link href={`/tookoda/${w.slug}`} className="btn btn-p btn-sm">Vaata profiili</Link>
        </div>
      </div>
    </div>
  );
}
