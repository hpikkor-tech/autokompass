import Link from 'next/link';
import type { Metadata } from 'next';
import { Icon } from '@/components/icons';
import { BlogCover } from '@/components/BlogCover';
import { ARTICLES } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blogi — nõuanded autohoolduse ja remondi kohta | Autokompass',
  description:
    'Praktilised juhendid: millal vahetada rehvid, kui tihti õlivahetus, kuidas valida usaldusväärne autotöökoda, mida tähendab rikketuli ja kuidas valmistuda ülevaatuseks.',
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString('et-EE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogIndex() {
  const [lead, ...rest] = ARTICLES;
  return (
    <main>
      <section className="bloghero">
        <div className="wrap">
          <span className="eyebrow">Autokompassi blogi</span>
          <h1>Nõuanded, mis säästavad aega ja raha</h1>
          <p>Ausad juhendid autohoolduse, remondi ja hooajavahetuse kohta — ilma müügijututa. Kirjutame sellest, mida eestlased päriselt Google'ist otsivad.</p>
        </div>
      </section>

      <section className="blk" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <Link href={`/blogi/${lead.slug}`} className="bloglead">
            <div className="blcover"><BlogCover art={lead.cover} /></div>
            <div className="blbody">
              <div className="blmeta"><span className="tagcat">{lead.category}</span><span>{fmt(lead.date)}</span><span>· {lead.readMins} min lugemist</span></div>
              <h2>{lead.title}</h2>
              <p>{lead.excerpt}</p>
              <span className="linkmore">Loe edasi <Icon.arwr /></span>
            </div>
          </Link>

          <div className="bloggrid">
            {rest.map((a) => (
              <Link key={a.slug} href={`/blogi/${a.slug}`} className="blogcard">
                <div className="blcover sm"><BlogCover art={a.cover} /></div>
                <div className="blcbody">
                  <div className="blmeta"><span className="tagcat">{a.category}</span><span>{a.readMins} min</span></div>
                  <h3>{a.title}</h3>
                  <p>{a.excerpt}</p>
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
