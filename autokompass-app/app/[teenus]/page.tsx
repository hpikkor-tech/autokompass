import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase/server';
import { Icon } from '@/components/icons';
import { WorkshopRow } from '@/components/WorkshopRow';
import { matchesSvcW } from '@/lib/serviceTags';
import { SERVICES, getService, getCity } from '@/lib/landing';
import type { Workshop } from '@/lib/types';

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ teenus: s.slug }));
}

export function generateMetadata({ params }: { params: { teenus: string } }): Metadata {
  const s = getService(params.teenus);
  if (!s) return { title: 'Teenus' };
  return { title: s.metaTitle, description: s.metaDesc, alternates: { canonical: `/${s.slug}` } };
}

const TIER_RANK: Record<string, number> = { spotlight: 3, featured: 2, pro: 1, none: 0 };

export default async function ServicePage({ params }: { params: { teenus: string } }) {
  const s = getService(params.teenus);
  if (!s) notFound();

  let all: Workshop[] = [];
  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from('workshops').select('*').eq('is_hidden', false).limit(5000);
    all = (data as Workshop[] | null) ?? [];
  } catch { /* DB pole seadistatud */ }

  const matched = (s.svc ? all.filter((w) => matchesSvcW(w, s.svc as string)) : all)
    .sort((a, b) => (TIER_RANK[b.featured_tier] - TIER_RANK[a.featured_tier]) || (b.rating_avg - a.rating_avg) || a.name.localeCompare(b.name, 'et'));
  const top = matched.slice(0, 15);
  const allHref = s.svc ? `/tookojad?svc=${s.svc}` : '/tookojad';

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
          <div className="crumb"><Link href="/">Avaleht</Link> <span>›</span> <Link href="/tookojad">Töökojad</Link> <span>›</span> <span>{s.h1}</span></div>
          <h1>{s.h1} — võrdle töökodi Eestis</h1>
          <p className="lsub">{s.lead}</p>
        </div>
      </div>

      <div className="wrap">
        <div className="landgrid">
          <div>
            <section className="landing">
              {s.intro.map((p, i) => <p key={i}>{p}</p>)}
            </section>

            <section className="lsec">
              <div className="sec-head-row">
                <h2>{matched.length} {s.h1.toLowerCase()} töökoda</h2>
                <Link className="linkmore" href={allHref}>Vaata kõiki <Icon.arwr /></Link>
              </div>
              <div className="rows">
                {top.map((w) => <WorkshopRow key={w.id} w={w} />)}
                {!top.length && <div className="pcard" style={{ textAlign: 'center', color: 'var(--muted)' }}>Nimekiri täieneb peagi. Vaata <Link href="/tookojad" style={{ color: 'var(--blue)', fontWeight: 700 }}>kõiki töökodi</Link>.</div>}
              </div>
              {matched.length > top.length && (
                <Link className="btn btn-o" style={{ marginTop: 18 }} href={allHref}>Vaata kõiki {matched.length} töökoda <Icon.arwr /></Link>
              )}
            </section>

            {s.cities.length > 0 && (
              <section className="lsec">
                <h2>{s.h1} linnade kaupa</h2>
                <div className="probs">
                  {s.cities.map((cs) => { const c = getCity(cs); return c ? <Link key={cs} href={`/${s.slug}/${cs}`} className="chip"><Icon.pin /> {s.h1} {c.ine}</Link> : null; })}
                </div>
              </section>
            )}

            {(s.districts ?? []).length > 0 && (
              <section className="lsec">
                <h2>{s.h1} Tallinna linnaosades</h2>
                <div className="probs">
                  {(s.districts ?? []).map((ds) => { const d = getCity(ds); return d ? <Link key={ds} href={`/${s.slug}/${ds}`} className="chip"><Icon.pin /> {s.h1} {d.ine}</Link> : null; })}
                </div>
              </section>
            )}

            <section className="lsec">
              <h2>Korduma kippuvad küsimused</h2>
              <div className="faq">
                {s.faq.map((f, i) => (
                  <details key={i} className="faqi">
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="landaside">
            <div className="pcard landcta">
              <h3>Kirjelda oma muret</h3>
              <p>Ei tea, millist teenust vajad? Küsi korraga mitmelt töökojalt pakkumist — kliendile tasuta.</p>
              <Link href="/tookojad" className="btn btn-p btn-block">Leia töökojad</Link>
            </div>
            <div className="pcard">
              <h4 style={{ fontFamily: 'Lexend', marginBottom: 12 }}>Seotud teenused</h4>
              <div className="relserv">
                {s.related.map((rs) => { const r = getService(rs); return r ? <Link key={rs} href={`/${rs}`} className="rellink"><Icon.arwr /> {r.h1}</Link> : null; })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
