import Link from 'next/link';
import type { Metadata } from 'next';
import { Icon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'Hinnakiri töökodadele | Autokompass',
  description:
    'Autokompass on kliendile alati tasuta. Töökojale: tasuta profiil ja soovi korral esiletõst, et saada rohkem päringuid tipphooaja ümber.',
};

type Tier = {
  name: string;
  price: string;
  unit: string;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: 'Tasuta profiil',
    price: '0 €',
    unit: 'alati',
    tagline: 'Ole leitav autojuhtidele, kes juba otsivad sinu teenust.',
    features: [
      'Profiil kaardil ja otsingus',
      'Teenused, kontakt ja lahtiolekuajad',
      'Võta vastu hinnapäringuid',
      'Vasta arvustustele',
    ],
    cta: 'Lisa oma töökoda',
    href: '/sisene?mode=shop',
  },
  {
    name: 'Esiletõst',
    price: 'alates 49 €',
    unit: 'kuus',
    tagline: 'Tõuse otsingus ette ja kogu rohkem päringuid.',
    features: [
      'Kõik tasuta profiili võimalused',
      'Kõrgem koht linna ja teenuse otsingus',
      '„Esiletõstetud" märgis kaardil',
      'Statistika päringute kohta',
    ],
    cta: 'Alusta esiletõstuga',
    href: '/sisene?mode=shop',
    featured: true,
  },
  {
    name: 'Tipphooaeg',
    price: 'küsi pakkumist',
    unit: '',
    tagline: 'Maksimaalne nähtavus rehvivahetuse tipu ümber (kevad ja sügis).',
    features: [
      'Kõik esiletõstu võimalused',
      'Prioriteetne asetus tipphooajal',
      'Esilehe ja linnalehe bännerikohad',
      'Personaalne tugi',
    ],
    cta: 'Võta ühendust',
    href: 'mailto:info@autokompass.ee?subject=Tipphooaja%20esiletost',
  },
];

export default function Hinnakiri() {
  return (
    <main>
      <section className="bloghero">
        <div className="wrap">
          <span className="eyebrow">Töökojale</span>
          <h1>Lihtne ja aus hinnakiri</h1>
          <p>Autokompass on autojuhile alati tasuta. Töökoda alustab tasuta profiiliga ja maksab ainult siis, kui soovib nähtavamat kohta — me ei võta vahendustasu.</p>
        </div>
      </section>

      <section className="blk" style={{ paddingTop: 44 }}>
        <div className="wrap">
          <div className="pricegrid">
            {TIERS.map((t) => (
              <div key={t.name} className={'pricecard' + (t.featured ? ' hot' : '')}>
                {t.featured && <span className="pricebadge">Populaarseim</span>}
                <h3>{t.name}</h3>
                <div className="priceval"><b>{t.price}</b>{t.unit && <span> / {t.unit}</span>}</div>
                <p className="pricetag">{t.tagline}</p>
                <ul className="pricefeat">
                  {t.features.map((f) => <li key={f}><Icon.check /> {f}</li>)}
                </ul>
                <Link href={t.href} className={'btn btn-block ' + (t.featured ? 'btn-p' : 'btn-o')}>{t.cta}</Link>
              </div>
            ))}
          </div>
          <p className="pricenote">Hinnad on suunavad ja käibemaksuta. Täpne pakkumine sõltub linnast ja hooajast — võta julgelt ühendust <a href="mailto:info@autokompass.ee">info@autokompass.ee</a>.</p>
        </div>
      </section>
    </main>
  );
}
