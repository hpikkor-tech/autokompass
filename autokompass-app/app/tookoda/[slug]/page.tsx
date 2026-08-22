import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase/server';
import { Icon, Stars } from '@/components/icons';
import { QuoteForm } from '@/components/QuoteForm';
import { ReviewForm } from '@/components/ReviewForm';
import type { Workshop, Review } from '@/lib/types'; import { GHero, GReviews } from '@/components/GPlace'; import { getPlace } from '@/lib/gplaces';

export const revalidate = 300;
export const dynamicParams = true;
export async function generateStaticParams() { return []; } // ehita nõudmisel, cache ISR-iga

async function getWorkshop(slug: string) {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from('workshops')
      .select('*, svc_rows:workshop_services(*, category:service_categories(*))')
      .eq('slug', slug).eq('is_hidden', false).single();
    return data as Workshop | null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const w = await getWorkshop(params.slug);
  if (!w) return { title: 'Töökoda' };
  return {
    title: `${w.name}${w.city ? ' — ' + w.city : ''} | Autokompass`,
    description: `${w.name}: hinnad, arvustused ja kontakt. ${w.about ?? ''}`.slice(0, 155),
  };
}

export default async function Profile({ params }: { params: { slug: string } }) {
  const w = await getWorkshop(params.slug);
  if (!w) notFound();
  const gp = (w.google_place_id && w.google_place_id !== 'NONE') ? await getPlace(w.google_place_id) : null; let revs: Review[] = [];
  try {
    const supabase = createPublicClient();
    const { data: reviews } = await supabase
      .from('reviews').select('*').eq('workshop_id', w.id).eq('status', 'published')
      .order('created_at', { ascending: false }).limit(10);
    revs = (reviews as Review[] | null) ?? [];
  } catch { /* ignore */ }
  const hasPhotos = !!(w.photos && w.photos.length);

  return (
    <main>
      <div className="wrap pv">
        <Link className="backlink" href="/tookojad"><Icon.arwr /> Tagasi töökodade juurde</Link>
        <div className="phead">
          <h1>{w.name} {w.claimed && <span className="badge-v" style={{ fontSize: 14, padding: '6px 11px' }}><Icon.check /> Kontrollitud töökoda</span>}</h1>
          <div className="pmeta">
            {w.rating_count > 0 ? (<><Stars /> <b style={{ color: 'var(--ink)' }}>{w.rating_avg.toFixed(1).replace('.', ',')}</b> ({w.rating_count} arvustust)</>) : gp?.rating ? (<><Stars /> <b style={{ color: 'var(--ink)' }}>{gp.rating.toFixed(1).replace('.', ',')}</b> ({gp.userRatingCount ?? 0} arvustust Google'is)</>) : (<span>Arvustusi veel pole</span>)}
            <span>·</span> <Icon.pin /> {w.address || w.city}
          </div>
        </div>

        {!hasPhotos && <GHero w={w} />}{hasPhotos ? (
          <div className="gallery">
            {w.photos.slice(0, 5).map((src, i) => <div className="g" key={i}><img src={src} alt={w.name} /></div>)}
          </div>
        ) : (
          <div className="galcard gone" style={{ background: `linear-gradient(135deg, ${coverColor(w.name)}, #0f1b2d)` }}>
            <div className="gcmono">{initials(w.name)}</div>
            <div className="gcbody">
              <div className="gcname">{w.name}</div>
              {w.services?.length ? <div className="gctags">{w.services.slice(0, 4).map((s) => <span key={s}>{s}</span>)}</div> : null}
              <div className="gcnote"><Icon.pin /> {w.address || w.city || 'Eesti'} · Fotod lisab töökoda profiili lunastades</div>
            </div>
          </div>
        )}

        {!w.claimed && (
          <div className="claimbar">
            <div className="ct">
              <h3>Kas see on sinu töökoda?</h3>
              <p>Need andmed on kogutud avalikest allikatest. Kui oled omanik, registreeru tasuta ja halda profiili — hinnad, fotod, päringud ja arvustustele vastamine.</p>
            </div>
            <Link href="/sisene?mode=shop" className="btn btn-p">Lunasta oma profiil</Link>
          </div>
        )}

        <div className="playout">
          <div>
            <div className="pcard"><h3>Töökojast</h3><p style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.7 }}>{w.about || autoAbout(w)}</p>
              <div className="origin-note"><Icon.shield /> Need andmed pärinevad avalikest allikatest ({w.data_origin}). Kas midagi on valesti? Saad selle parandada, kui lunastad profiili.</div>
              <a className="gmaps-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(w.name + ' ' + (w.address || w.city || ''))}${w.google_place_id ? '&query_place_id=' + w.google_place_id : ''}`} target="_blank" rel="noreferrer"><Icon.star /> Loe arvustusi Google'is</a>
            </div>

            <div className="pcard"><h3>Teenused ja hinnad</h3>
              <table className="svctable"><tbody>
                {(w.svc_rows ?? []).map((s) => (
                  <tr key={s.id}><td>{s.category?.name_et}</td><td className="p">{priceText(s.price_from, s.price_to)}</td></tr>
                ))}
                {!w.svc_rows?.length && w.services?.length ? (
                  w.services.map((s) => <tr key={s}><td>{s}</td><td className="p" style={{ color: 'var(--muted-2)' }}>Küsi pakkumist</td></tr>)
                ) : null}
                {!w.svc_rows?.length && !w.services?.length && <tr><td style={{ color: 'var(--muted)' }}>Hinnakiri lisatakse peagi.</td><td /></tr>}
              </tbody></table>
              <p style={{ color: 'var(--muted-2)', fontSize: 13, marginTop: 14 }}>Hinnad on orienteeruvad. Täpne pakkumine pärast päringut.</p>
            </div>

            <GReviews w={w} /><div className="pcard"><h3>Arvustused Autokompassis ({w.rating_count})</h3>
              <ReviewForm workshopId={w.id} />
              <div style={{ marginTop: 8 }}>
                {revs.map((r) => (
                  <div className="rev" key={r.id}>
                    <div className="rh"><div className="av">{(r.user_id?.[0] ?? 'A').toUpperCase()}</div>
                      <div><div className="rn">Klient {r.verified && <span className="revverify"><Icon.check /> Kontrollitud külastus</span>}</div>
                        <div style={{ color: 'var(--muted-2)', fontSize: 13, fontWeight: 600 }}><Stars /> · {new Date(r.created_at).toLocaleDateString('et-EE')}</div></div>
                    </div>
                    <p style={{ color: 'var(--ink-soft)' }}>{r.body}</p>
                  </div>
                ))}
                {!revs.length && <p style={{ color: 'var(--muted)' }}>Ole esimene, kes jätab kontrollitud arvustuse.</p>}
              </div>
            </div>
          </div>

          <aside>
            <div className="qbox"><h3 style={{fontFamily:'Lexend',fontSize:19,marginBottom:8}}>Broneeri aeg</h3><p style={{color:'var(--muted)',fontSize:14.5,marginBottom:14}}>Broneerimine ja hinnainfo käivad otse töökojas.</p>{w.website && <a className="btn btn-p" style={{width:'100%',marginBottom:10}} href={w.website} target="_blank" rel="noreferrer">Broneeri töökoja kodulehel</a>}{w.phone && <a className="btn btn-o" style={{width:'100%'}} href={'tel:' + w.phone.replace(/\s/g, '')}><Icon.phone /> {w.phone}</a>}<a className="btn btn-o" style={{width:'100%',marginTop:10}} href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(w.name + ' ' + (w.address || w.city || 'Eesti'))} target="_blank" rel="noreferrer">Vaata Google'i kaardil</a></div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function priceText(from: number | null, to: number | null) {
  if (from == null) return '—';
  if (to == null || to === from) return `alates ${from} €`;
  return `${from}–${to} €`;
}

function initials(name: string) {
  const p = name.replace(/[^A-Za-zÄÖÜÕäöüõ0-9 ]/g, '').trim().split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] || 'A') + (p[1]?.[0] || '')).toUpperCase();
}
function coverColor(name: string) {
  const cols = ['#0B5394', '#0A8F63', '#B4700F', '#5B3FA8', '#B03A5B', '#2B6CB0', '#1F7A5A'];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return cols[h % cols.length];
}
function autoAbout(w: Workshop) {
  const svc = w.services && w.services.length ? w.services.slice(0, 5).join(', ') : 'autoremont ja hooldus';
  return `${w.name} on autotöökoda${w.city ? ' (' + w.city + ')' : ''}. Pakutavad teenused: ${svc}. Võrdle Autokompassis lahtiolekuaegu ja kontakti ning saada päring otse — kliendile tasuta.`;
}
