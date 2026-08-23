import Link from 'next/link';
import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase/server';
import { Icon, Stars } from '@/components/icons';
import { OpenStatus } from '@/components/OpenStatus';
import { ListingMap } from '@/components/ListingMap';
import { SVC_CATS, displayServices, matchesSvcW, svcLabel } from '@/lib/serviceTags';
import { compactHours } from '@/lib/hours';
import type { Workshop } from '@/lib/types'; import { GThumb } from '@/components/GPlace'; import { SortSelect } from '@/components/SortSelect';

export const revalidate = 120;

const TIER_RANK: Record<string, number> = { spotlight: 3, featured: 2, pro: 1, none: 0 };
const PER_PAGE = 24;

type SP = { svc?: string; city?: string; ver?: string; web?: string; sort?: string; page?: string };

export function generateMetadata({ searchParams }: { searchParams: SP }): Metadata {
  const s = svcLabel(searchParams.svc || '');
  const c = searchParams.city;
  const title = `${s || 'Autotöökojad'}${c ? ' ' + c : ' Eestis'} — võrdle hindu ja arvustusi | Autokompass`;
  return { title, description: `Leia ja võrdle ${(s || 'autotöökodi').toLowerCase()}${c ? ' linnas ' + c : ''}. Aadressid, lahtiolekuajad, kontakt ja ehtsad arvustused ühest kohast.` };
}

function applyFilters(list: Workshop[], f: { svc?: string; city?: string; ver?: string; web?: string }) {
  return list.filter((w) =>
    (!f.svc || matchesSvcW(w, f.svc)) &&
    (!f.city || w.city === f.city) &&
    (!f.ver || w.claimed) &&
    (!f.web || !!w.website)
  );
}

function qs(base: SP, patch: Partial<SP>): string {
  const p = new URLSearchParams();
  const merged = { ...base, ...patch, page: undefined } as SP;
  (Object.keys(merged) as (keyof SP)[]).forEach((k) => { const v = merged[k]; if (v) p.set(k, String(v)); });
  const s = p.toString();
  return '/tookojad' + (s ? '?' + s : '');
}

function thumbColor(name: string) {
  const cols = ['#0B5394', '#0A8F63', '#B4700F', '#5B3FA8', '#B03A5B', '#2B6CB0', '#1F7A5A'];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return cols[h % cols.length];
}
function initials(name: string) {
  const parts = name.replace(/[^A-Za-zÄÖÜÕäöüõ0-9 ]/g, '').trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || 'A') + (parts[1]?.[0] || '')).toUpperCase();
}

export default async function Listing({ searchParams }: { searchParams: SP }) {
  const { svc = '', city = '', ver = '', web = '', sort = 'rec' } = searchParams;
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);

  let all: Workshop[] = [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from('workshops').select('*').eq('is_hidden', false).limit(5000);
    all = (data as Workshop[] | null) ?? [];
  } catch { /* DB pole seadistatud */ }

  // Fa- fassett-loendurid (iga dimensioon arvutatakse ilma iseenda filtrita)
  const forSvc = applyFilters(all, { city, ver, web });
  const forCity = applyFilters(all, { svc, ver, web });
  const forMisc = applyFilters(all, { svc, city });
  const svcCounts = SVC_CATS.map((c) => ({ ...c, n: forSvc.filter((w) => matchesSvcW(w, c.slug)).length }));
  const cityCounts = Object.entries(forCity.reduce<Record<string, number>>((m, w) => { if (w.city) m[w.city] = (m[w.city] || 0) + 1; return m; }, {}))
    .sort((a, b) => b[1] - a[1]).slice(0, 14);
  const verCount = applyFilters(all, { svc, city, web }).filter((w) => w.claimed).length;
  const webCount = applyFilters(all, { svc, city, ver }).filter((w) => !!w.website).length;

  // Lõplik filtreeritud + sorteeritud nimekiri
  let list = applyFilters(all, { svc, city, ver, web });
  const er = (w: Workshop) => (w.rating_count > 0 ? w.rating_avg : (w.google_rating ? Number(w.google_rating) : 0)); list = list.sort((a, b) => {
    if (sort === 'az') return a.name.localeCompare(b.name, 'et');
    if (sort === 'rate') return (er(b) - er(a)) || ((b.rating_count || b.google_rating_count || 0) - (a.rating_count || a.google_rating_count || 0)) || a.name.localeCompare(b.name, 'et');
    return (TIER_RANK[b.featured_tier] - TIER_RANK[a.featured_tier]) || (er(b) - er(a)) || a.name.localeCompare(b.name, 'et');
  });

  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const cur = Math.min(page, pages);
  const pageItems = list.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
  const mapPoints = pageItems.filter((w) => w.lat && w.lng).map((w) => ({ name: w.name, lat: w.lat as number, lng: w.lng as number, slug: w.slug, city: w.city }));

  const heading = `${svcLabel(svc) || 'Autotöökojad'}${city ? ' ' + city : ''}`;
  const activeFilters = [svc, city, ver, web].filter(Boolean).length;

  return (
    <main>
      <div className="listhero">
        <div className="wrap">
          <div className="crumb"><Link href="/">Avaleht</Link> <span>›</span> <Link href="/tookojad">Töökojad</Link>{city && <> <span>›</span> <span>{city}</span></>}</div>
          <h1>{heading}</h1>
          <p className="lsub">{total} töökoda{city ? ` linnas ${city}` : ' üle Eesti'}. Võrdle asukohta, lahtiolekuaegu ja kontakti — ehtsad arvustused, kliendile tasuta.</p>
        </div>
      </div>

      <div className="subbar">
        <div className="wrap">
          <form>
            <select name="svc" defaultValue={svc}><option value="">Kõik teenused</option>{SVC_CATS.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}</select>
            <select name="city" defaultValue={city}><option value="">Kõik linnad</option>{cityCounts.map(([c]) => <option key={c} value={c}>{c}</option>)}</select>
            <input type="hidden" name="sort" value={sort} />
            <button className="btn btn-g btn-sm" type="submit"><Icon.search /> Otsi</button>
          </form>
        </div>
      </div>

      <div className="wrap">
        <div className="listlayout">
          <input type="checkbox" id="fto" className="fto" /><label htmlFor="fto" className="fbtn">Filtrid{activeFilters > 0 ? ' (' + activeFilters + ')' : ''}</label><aside className="filters">
            <div className="filt-top"><h4>Filtrid</h4>{activeFilters > 0 && <Link href="/tookojad" className="clearf">Tühjenda</Link>}</div>

            <div className="fgroup"><div className="gt">Teenus</div>
              {svcCounts.map((c) => (
                <Link key={c.slug} href={qs(searchParams, { svc: svc === c.slug ? '' : c.slug })} className={'fopt' + (svc === c.slug ? ' on' : '')}>
                  <span className="fx">{svc === c.slug ? <Icon.check /> : <i className="fbox" />}{c.label}</span><b>{c.n}</b>
                </Link>
              ))}
            </div>

            <div className="fgroup"><div className="gt">Linn</div>
              {cityCounts.map(([c, n]) => (
                <Link key={c} href={qs(searchParams, { city: city === c ? '' : c })} className={'fopt' + (city === c ? ' on' : '')}>
                  <span className="fx">{city === c ? <Icon.check /> : <i className="fbox" />}{c}</span><b>{n}</b>
                </Link>
              ))}
            </div>

            <div className="fgroup"><div className="gt">Muu</div>
              <Link href={qs(searchParams, { ver: ver ? '' : '1' })} className={'fopt' + (ver ? ' on' : '')}><span className="fx">{ver ? <Icon.check /> : <i className="fbox" />}Kontrollitud töökoda</span><b>{verCount}</b></Link>
              <Link href={qs(searchParams, { web: web ? '' : '1' })} className={'fopt' + (web ? ' on' : '')}><span className="fx">{web ? <Icon.check /> : <i className="fbox" />}Veebilehega</span><b>{webCount}</b></Link>
            </div>
          </aside>

          <div>
            <div className="listmap-wrap">
              <ListingMap points={mapPoints} />
              <div className="mapcap"><Icon.pin /> Kaardil {mapPoints.length} töökoda{total > mapPoints.length ? ` (lehel ${cur}/${pages})` : ''}</div>
            </div>

            <div className="resbar">
              <div><b>{total}</b> töökoda leitud{svcLabel(svc) ? <span className="rescat"> · {svcLabel(svc)}</span> : null}</div>
              <form className="sortf">
                {svc && <input type="hidden" name="svc" value={svc} />}
                {city && <input type="hidden" name="city" value={city} />}
                {ver && <input type="hidden" name="ver" value={ver} />}
                {web && <input type="hidden" name="web" value={web} />}
                <label>Järjesta:</label><SortSelect value={sort} base={(svc ? 'svc=' + encodeURIComponent(svc) + '&' : '') + (city ? 'city=' + encodeURIComponent(city) + '&' : '') + (ver ? 'ver=1&' : '') + (web ? 'web=1&' : '')} />
                <select name="sort" defaultValue={sort} onChange={undefined} style={{display:'none'}}>
                  <option value="rec">Soovituslik</option>
                  <option value="az">Nime järgi (A–Z)</option>
                  <option value="rate">Hinnatuimad</option>
                </select>
                {null}
              </form>
            </div>

            <div className="rows">
              {pageItems.map((w) => {
                const feat = w.featured_tier !== 'none';
                const services = displayServices(w);
                const hrs = compactHours(w.opening_hours);
                return (
                  <div key={w.id} className={'rowcard' + (feat ? ' feat' : '')}>
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
                          w.google_rating && w.google_rating_count ? <><div className="num">{Number(w.google_rating).toFixed(1).replace('.', ',')}</div><Stars /><div className="rc">{w.google_rating_count} arvustust Google'is</div></> : <span className="newpill">Arvustusi veel pole</span>
                        )}
                      </div>
                      <div className="ract">
                        {w.phone && <a href={`tel:${w.phone.replace(/\s/g, '')}`} className="btn btn-o btn-sm"><Icon.phone /> Helista</a>}
                        <Link href={`/tookoda/${w.slug}`} className="btn btn-p btn-sm">Vaata profiili</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
              {!pageItems.length && <div className="pcard" style={{ textAlign: 'center', color: 'var(--muted)' }}>Ühtegi töökoda ei leitud. <Link href="/tookojad" style={{ color: 'var(--blue)', fontWeight: 700 }}>Tühjenda filtrid</Link>.</div>}
            </div>

            {pages > 1 && (
              <nav className="pager">
                {cur > 1 && <Link href={qs2(searchParams, cur - 1)} className="pg"><Icon.arwr /> Eelmine</Link>}
                {pageWindow(cur, pages).map((p, i) => p === -1
                  ? <span key={'e' + i} className="pg dots">…</span>
                  : <Link key={p} href={qs2(searchParams, p)} className={'pg' + (p === cur ? ' on' : '')}>{p}</Link>)}
                {cur < pages && <Link href={qs2(searchParams, cur + 1)} className="pg">Järgmine <Icon.arwr /></Link>}
              </nav>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function qs2(base: SP, page: number): string {
  const p = new URLSearchParams();
  (['svc', 'city', 'ver', 'web', 'sort'] as (keyof SP)[]).forEach((k) => { const v = base[k]; if (v) p.set(k, String(v)); });
  if (page > 1) p.set('page', String(page));
  const s = p.toString();
  return '/tookojad' + (s ? '?' + s : '');
}

function pageWindow(cur: number, pages: number): number[] {
  const out: number[] = [];
  const add = (n: number) => out.push(n);
  add(1);
  if (cur > 3) add(-1);
  for (let p = Math.max(2, cur - 1); p <= Math.min(pages - 1, cur + 1); p++) add(p);
  if (cur < pages - 2) add(-1);
  if (pages > 1) add(pages);
  return out.filter((v, i, a) => v === -1 || a.indexOf(v) === i);
}
