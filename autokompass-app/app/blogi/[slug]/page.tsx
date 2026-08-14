import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Icon } from '@/components/icons';
import { ARTICLES, getArticle, relatedArticles } from '@/lib/blog';

export const revalidate = 3600;
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const a = getArticle(params.slug);
  if (!a) return { title: 'Blogi' };
  return {
    title: `${a.title} | Autokompass`,
    description: a.excerpt,
    openGraph: { title: a.title, description: a.excerpt, type: 'article' },
  };
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('et-EE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const a = getArticle(params.slug);
  if (!a) notFound();
  const related = relatedArticles(a.slug);

  return (
    <main>
      <article className="artwrap">
        <div className="wrap narrow">
          <Link className="backlink" href="/blogi"><Icon.arwr /> Tagasi blogisse</Link>
          <div className="artmeta"><span className="tagcat">{a.category}</span><span>{fmt(a.date)}</span><span>· {a.readMins} min lugemist</span></div>
          <h1>{a.title}</h1>
          <p className="artlead">{a.excerpt}</p>
          <div className="artcover">{a.cover}</div>
          <div className="artbody" dangerouslySetInnerHTML={{ __html: a.body }} />

          <div className="artcta">
            <div>
              <h3>Vajad selle teenusega abi?</h3>
              <p>Kirjelda oma muret ja leia lähedal asuvad töökojad — võrdle hindu ja vaba aega ühest kohast.</p>
            </div>
            <Link href="/tookojad" className="btn btn-p">Leia töökoda <Icon.arwr /></Link>
          </div>
        </div>
      </article>

      <section className="blk" style={{ background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="sec-h"><span className="eyebrow">Loe veel</span><h2>Seotud artiklid</h2></div>
          <div className="bloggrid">
            {related.map((r) => (
              <Link key={r.slug} href={`/blogi/${r.slug}`} className="blogcard">
                <div className="blcover sm">{r.cover}</div>
                <div className="blcbody">
                  <div className="blmeta"><span className="tagcat">{r.category}</span><span>{r.readMins} min</span></div>
                  <h3>{r.title}</h3>
                  <span className="linkmore sm">Loe edasi <Icon.arwr /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
