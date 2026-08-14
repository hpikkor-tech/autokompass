import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import { Icon, Stars } from '@/components/icons';
import type { Workshop } from '@/lib/types';

export const revalidate = 120;

const SERVICES = [
  ['olivahetus', 'Õlivahetus'], ['rehvivahetus', 'Rehvivahetus'], ['piduriklotsid', 'Piduriklotside vahetus'],
  ['diagnostika', 'Rikkediagnostika'], ['kliima', 'Kliimaseadme hooldus'], ['vedrustus', 'Rooliotsad ja vedrustus'],
];
const CITIES = ['Tallinn', 'Tartu', 'Pärnu', 'Narva', 'Rakvere', 'Viljandi'];
const TIER_RANK: Record<string, number> = { spotlight: 3, featured: 2, pro: 1, none: 0 };

type SP = { svc?: string; city?: string; ver?: string; rate?: string; sort?: string };

export default async function Listing({ searchParams }: { searchParams: SP }) {
  const { svc = '', city = '', ver = '', rate = '', sort = 'rec' } = searchParams;
  const supabase = createPublicClient();

  const join = svc
    ? '*, services:workshop_services!inner(*, category:service_categories!inner(*))'
    : '*, services:workshop_services(*, category:service_categories(*))';
  let q = supabase.from('workshops').select(join).eq('is_hidden', false);
  if (city) q = q.eq('city', city);
  if (svc) q = q.eq('services.category.slug', svc);
  if (ver) q = q.eq('claimed', true);
  if (rate) q = q.gte('rating_avg', 4.5);

  let list: Workshop[] = [];
  try { const { data } = await q.limit(60); list = (data as Workshop[] | null) ?? []; } catch { /* DB seadistamata */ }

  if (sort === 'rate') list = list.sort((a, b) => b.rating_avg - a.rating_avg);
  else list = list.sort((a, b) => (TIER_RANK[b.featured_tier] - TIER_RANK[a.featured_tier]) || (b.rating_avg - a.rating_avg));

  const loc = city ? `Autotöökojad ${city}` : 'Kõik töökojad';

  return (
    <main>
      <div className="subbar">
        <div className="wrap">
          <form>
            <select name="svc" defaultValue={svc}><option value="">Kõik teenused</option>{SERVICES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            <select name="city" defaultValue={city}><option value="">Kõik linnad</option>{CITIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
            <input type="hidden" name="sort" value={sort} />
            <button className="btn btn-g btn-sm" type="submit"><Icon.search /> Otsi</button>
          </form>
        </div>
      </div>

      <div className="wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontWeight: 600, padding: '16px 0 0', fontSize: 14 }}>
          <Link href="/" style={{ color: 'var(--blue)' }}>Avaleht</Link> › <span>{loc}</span>
        </div>

        <div className="listlayout">
          <aside className="filters">
            <h4>Filtrid</h4>
            <form>
              <input type="hidden" name="svc" value={svc} />
              <input type="hidden" name="city" value={city} />
              <div className="fgroup"><div className="gt">Usaldus</div>
                <label className="chk"><input type="checkbox" name="ver" value="1" defaultChecked={!!ver} /> Kontrollitud töökoda</label>
              </div>
              <div className="fgroup"><div className="gt">Hinnang</div>
                <label className="chk"><input type="checkbox" name="rate" value="1" defaultChecked={!!rate} /> Hinnang 4,5+</label>
              </div>
              <div className="fgroup"><div className="gt">Sorteeri</div>
                <select name="sort" defaultValue={sort} style={{ width: '100%', border: '1.5px solid var(--line)', borderRadius: 10, padding: 10, fontFamily: 'inherit', fontWeight: 600 }}>
                  <option value="rec">Soovituslik</option>
                  <option value="rate">Hinnatuimad</option>
                </select>
              </div>
              <button className="btn btn-o btn-sm btn-block" type="submit" style={{ marginTop: 8 }}>Rakenda filtrid</button>
            </form>
          </aside>

          <div>
            <div style={{ marginBottom: 18, fontFamily: 'Lexend', fontWeight: 700, fontSize: 20 }}>
              {list.length} <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 15 }}>töökoda leitud</span>
            </div>
            <div className="rows">
              {list.map((w) => {
                const priceFrom = w.services?.reduce<number | null>((m, s) => s.price_from != null && (m == null || s.price_from < m) ? s.price_from : m, null);
                return (
                  <Link key={w.id} href={`/tookoda/${w.slug}`} className="rowcard">
                    <div className="rimg"><img src={w.photos?.[0] || w.logo_url || placeholder()} alt={w.name} /></div>
                    <div>
                      <div className="rnm">{w.name} {w.claimed && <span className="badge-v"><Icon.check /> Kontrollitud</span>}</div>
                      <div className="rmeta"><Icon.pin /> {w.address || w.city}</div>
                      <div className="rdesc">{w.services?.map((s) => s.category?.name_et).filter(Boolean).slice(0, 3).join(' · ') || 'Autoremont ja hooldus'}</div>
                    </div>
                    <div className="rright">
                      <div style={{ textAlign: 'right' }}>
                        <div className="num">{w.rating_avg > 0 ? w.rating_avg.toFixed(1).replace('.', ',') : '—'}</div>
                        <Stars />
                        <div style={{ color: 'var(--muted-2)', fontSize: 13, fontWeight: 600 }}>{w.rating_count} arvustust</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 600 }}>Alates<b style={{ display: 'block', fontFamily: 'Lexend', color: 'var(--ink)', fontSize: 17 }}>{priceFrom != null ? `${priceFrom} €` : '—'}</b></div>
                        <span className="btn btn-p btn-sm" style={{ marginTop: 8 }}>Vaata profiili</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {!list.length && <div className="pcard" style={{ textAlign: 'center', color: 'var(--muted)' }}>Ühtegi töökoda ei leitud. Proovi filtreid muuta.</div>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function placeholder() {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#e8edf3"/></svg>');
}
