import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase/server';
import { Icon } from '@/components/icons';
import { WorkshopRow } from '@/components/WorkshopRow';
import { ListingMap } from '@/components/ListingMap';
import { matchesSvcW } from '@/lib/serviceTags';
import { SERVICES, getService, getCity, cityPageParams } from '@/lib/landing';
import type { Workshop } from '@/lib/types';

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return cityPageParams();
}

export function generateMetadata({ params }: { params: { teenus: string; linn: string } }): Metadata {
  const s = getService(params.teenus); const c = getCity(params.linn);
  if (!s || !c) return { title: 'Teenus' };
  const where = c.district ? `${c.ine}, Tallinnas` : c.ine;
  return {
    title: `${s.h1} ${c.ine} — töökojad ja hinnad | Autokompass`,
    description: `${s.h1} ${where}: võrdle töökodi, hindu, lahtiolekuaegu ja arvustusi. Leia usaldusväärne töökoda ${c.name} lähedalt ja saada päring — kliendile tasuta.`,
    alternates: { canonical: `/${s.slug}/${c.slug}` },
  };
}

const TIER_RANK: Record<string, number> = { spotlight: 3, featured: 2, pro: 1, none: 0 };

export default async function ServiceCityPage({ params }: { params: { teenus: string; linn: string } }) {
  const s = getService(params.teenus); const c = getCity(params.linn);
  if (!s || !c) notFound();

  let all: Workshop[] = [];
  try {
    const supabase = createPublicClient();
    const base = supabase.from('workshops').select('*').eq('is_hidden', false);
    const { data } = c.district
      ? await base.eq('district', c.slug).limit(500)
      : await base.eq('city', c.name).limit(500);
    all = (data as Workshop[] | null) ?? [];
  } catch { /* DB pole seadistatud */ }

  const matched = (s.svc ? all.filter((w) => matchesSvcW(w, s.svc as string)) : all)
    .sort((a, b) => (TIER_RANK[b.featured_tier] - TIER_RANK[a.featured_tier]) || (b.rating_avg - a.rating_avg) || a.name.localeCompare(b.name, 'et'));
  const mapPoints = matched.filter((w) => w.lat && w.lng).map((w) => ({ name: w.name, lat: w.lat as number, lng: w.lng as number, slug: w.slug, city: w.city }));
  const allHref = c.district
    ? `/tookojad?${s.svc ? 'svc=' + s.svc + '&' : ''}city=Tallinn&dst=${c.slug}`
    : `/tookojad?${s.svc ? 'svc=' + s.svc + '&' : ''}city=${encodeURIComponent(c.name)}`;
  const otherCities = (c.district ? (s.districts ?? []) : s.cities).filter((x) => x !== c.slug);
  const parent = c.parent ? getCity(c.parent) : undefined;
  const parentHasPage = !!(parent && s.cities.includes(parent.slug));

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: s.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <div className="listhero">
        <div className="wrap">
          <div className="crumb"><Link href="/">Avaleht</Link> <span>›</span> <Link href={`/${s.slug}`}>{s.h1}</Link>{parent && <> <span>›</span> {parentHasPage ? <Link href={`/${s.slug}/${parent.slug}`}>{parent.name}</Link> : <span>{parent.name}</span>}</>} <span>›</span> <span>{c.name}</span></div>
          <h1>{s.h1} {c.ine}</h1>
          <p className="lsub">{matched.length} töökoda {c.ine}. Võrdle asukohta, lahtiolekuaegu ja arvustusi ning leia usaldusväärne meister {c.name} lähedalt.</p>
        </div>
      </div>

      <div className="wrap">
        <div className="landgrid">
          <div>
            <section className="landing">
              <p><b>{s.h1} {c.ine}</b> on Autokompassis lihtne leida: võrdle korraga mitut {c.name} töökoda, vaata teenuseid, lahtiolekuaegu ja arvustusi ning saada päring otse — ilma igaühele eraldi helistamata.</p>
              {c.blurb && <p>{c.blurb}</p>}
              <p>{s.intro[0]}</p>
            </section>

            {mapPoints.length > 0 && (
              <div className="listmap-wrap" style={{ marginBottom: 22 }}>
                <ListingMap points={mapPoints} />
                <div className="mapcap"><Icon.pin /> Kaardil {mapPoints.length} töökoda {c.ine}</div>
              </div>
            )}

            <section className="lsec">
              <div className="sec-head-row">
                <h2>{s.h1} {c.ine} — {matched.length} töökoda</h2>
                <Link className="linkmore" href={allHref}>Kõik filtrid <Icon.arwr /></Link>
              </div>
              <div className="rows">
                {matched.slice(0, 20).map((w) => <WorkshopRow key={w.id} w={w} />)}
                {!matched.length && <div className="pcard" style={{ textAlign: 'center', color: 'var(--muted)' }}>Selle teenuse töökojad {c.ine} lisanduvad peagi. Vaata <Link href={`/${s.slug}`} style={{ color: 'var(--blue)', fontWeight: 700 }}>{s.h1.toLowerCase()} üle Eesti</Link>.</div>}
              </div>
            </section>

            <section className="lsec">
              <h2>Korduma kippuvad küsimused</h2>
              <div className="faq">
                {s.faq.map((f, i) => (
                  <details key={i} className="faqi"><summary>{f.q}</summary><p>{f.a}</p></details>
                ))}
              </div>
            </section>
          </div>

          <aside className="landaside">
            <div className="pcard landcta">
              <h3>{s.h1} {c.ine}?</h3>
              <p>Saada päring korraga mitmele {c.name} töökojale ja võrdle pakkumisi — kliendile tasuta.</p>
              <Link href={allHref} className="btn btn-p btn-block">Vaata töökodi</Link>
            </div>
            {otherCities.length > 0 && (
              <div className="pcard">
                <h4 style={{ fontFamily: 'Lexend', marginBottom: 12 }}>{c.district ? s.h1 + ' mujal Tallinnas' : s.h1 + ' mujal'}</h4>
                <div className="relserv">
                  {otherCities.map((cs) => { const oc = getCity(cs); return oc ? <Link key={cs} href={`/${s.slug}/${cs}`} className="rellink"><Icon.pin /> {s.h1} {oc.ine}</Link> : null; })}
                  {parentHasPage && parent && <Link href={`/${s.slug}/${parent.slug}`} className="rellink"><Icon.pin /> {s.h1} {parent.ine}</Link>}
                  <Link href={`/${s.slug}`} className="rellink"><Icon.arwr /> {s.h1} üle Eesti</Link>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
