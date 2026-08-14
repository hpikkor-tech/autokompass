import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import { WorkshopCard } from '@/components/WorkshopCard';
import { Kompu } from '@/components/Kompu';
import { Icon } from '@/components/icons';
import type { Workshop } from '@/lib/types';

export const revalidate = 300; // ISR

const TIER_RANK: Record<string, number> = { spotlight: 3, featured: 2, pro: 1, none: 0 };

const PROBLEMS: [string, string][] = [
  ['Mootori rikketuli põleb', 'diagnostika'],
  ['Rehvivahetus + hoiustamine', 'rehvivahetus'],
  ['Piduriklotsid kriuksuvad', 'piduriklotsid'],
  ['Kliima ei jahuta', 'kliima'],
  ['Väristab roolis', 'vedrustus'],
  ['Õli on vaja vahetada', 'olivahetus'],
];
const CITIES = ['Tallinn', 'Tartu', 'Pärnu', 'Narva', 'Rakvere', 'Viljandi'];
const SERVICES = [
  ['olivahetus', 'Õlivahetus'], ['rehvivahetus', 'Rehvivahetus'], ['piduriklotsid', 'Piduriklotside vahetus'],
  ['diagnostika', 'Rikkediagnostika'], ['kliima', 'Kliimaseadme hooldus'], ['vedrustus', 'Rooliotsad ja vedrustus'],
];

export default async function Home() {
  let data: Workshop[] | null = null;
  try {
    const supabase = createPublicClient();
    const res = await supabase
      .from('workshops')
      .select('*, services:workshop_services(*, category:service_categories(*))')
      .eq('is_hidden', false)
      .limit(24);
    data = res.data as Workshop[] | null;
  } catch { /* DB pole veel seadistatud — näita tühja olekut */ }

  const featured = (data ?? [])
    .sort((a, b) => (TIER_RANK[b.featured_tier] - TIER_RANK[a.featured_tier]) || (b.rating_avg - a.rating_avg))
    .slice(0, 3);

  return (
    <main>
      <section className="hero" style={{ backgroundImage: "linear-gradient(rgba(9,17,33,.2),rgba(9,17,33,.2)), url('/hero.jpg')" }}>
        <div className="wrap inner">
          <div className="col">
            <span className="eyebrow">Eesti autotöökodade võrdlus</span>
            <h1>Säästa <b>aega ja raha</b> oma auto remondil.</h1>
            <p className="sub">Võrdle hindu, arvustusi ja vaba aega üle 1 200 töökoja seast. Kirjelda oma muret — leiame sulle parima pakkumise, ilma järjekorras ootamata.</p>
            <form className="searchcard" action="/tookojad">
              <select name="svc" defaultValue=""><option value="">Milline teenus?</option>{SERVICES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
              <select name="city" defaultValue=""><option value="">Kus linnas?</option>{CITIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
              <button className="btn btn-p" type="submit"><Icon.search /> Leia töökojad</button>
            </form>
          </div>
        </div>
      </section>

      <section className="blk" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <div className="sec-h"><span className="eyebrow">Otsi mure järgi</span><h2>Mis su autol viga on?</h2></div>
          <div className="probs">
            {PROBLEMS.map(([label, svc]) => (
              <Link key={label} href={`/tookojad?svc=${svc}`} className="chip"><Icon.bolt /> {label}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="blk" id="tookojad" style={{ background: '#fff', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="sec-head-row">
            <div><span className="eyebrow">Populaarsed</span><h2>Kõrgelt hinnatud töökojad</h2></div>
            <Link className="linkmore" href="/tookojad">Vaata kõiki <Icon.arwr /></Link>
          </div>
          {featured.length ? (
            <div className="wsgrid">{featured.map((w) => <WorkshopCard key={w.id} w={w} />)}</div>
          ) : (
            <p style={{ color: 'var(--muted)' }}>Andmebaas on veel tühi — käivita <code>npm run seed:demo</code> või ingestioni skriptid.</p>
          )}
        </div>
      </section>

      <section className="blk" id="kuidas">
        <div className="wrap">
          <div className="sec-h"><span className="eyebrow">Kolm sammu</span><h2>Kuidas Autokompass töötab</h2></div>
          <div className="wsgrid">
            {[['Kirjelda muret', 'Räägi lihtsas keeles, mis viga on — leiame sobivad töökojad.'],
              ['Võrdle pakkumisi', 'Vaata hindu, arvustusi ja vaba aega kõrvuti — leia soodsaim ja usaldusväärseim.'],
              ['Broneeri aeg', 'Vali parim pakkumine ja saada päring otse. Selge hind juba ette.']].map(([h, p], i) => (
              <div key={h} className="pcard"><div className="eyebrow" style={{ marginBottom: 8 }}>Samm {i + 1}</div><h3>{h}</h3><p style={{ color: 'var(--muted)' }}>{p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="blk" id="linnad" style={{ background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="sec-h"><span className="eyebrow">Sirvi asukoha järgi</span><h2>Autotöökojad linnades</h2></div>
          <div className="probs">
            {CITIES.map((c) => <Link key={c} href={`/tookojad?city=${c}`} className="chip"><Icon.pin /> {c}</Link>)}
          </div>
        </div>
      </section>

      <section className="blk">
        <div className="wrap">
          <div className="pcard" style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap', padding: 40 }}>
            <div style={{ flex: '0 0 150px', width: 150 }}><Kompu eyes="normal" mouth="smile" arms="wave" /></div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <span className="eyebrow">Töökojale</span>
              <h2 style={{ fontSize: 30, margin: '10px 0 12px' }}>Kas sul on autotöökoda?</h2>
              <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Lisa oma töökoda tasuta ja saa kliente, kes juba otsivad sinu teenust. Maksad ainult siis, kui soovid nähtavamat kohta.</p>
              <Link href="/sisene?mode=shop" className="btn btn-p">Lisa oma töökoda</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
