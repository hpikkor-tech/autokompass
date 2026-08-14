import Link from 'next/link';
import { createPublicClient } from '@/lib/supabase/server';
import { WorkshopCard } from '@/components/WorkshopCard';
import { Kompu } from '@/components/Kompu';
import { ChatAssistant } from '@/components/ChatAssistant';
import { Icon } from '@/components/icons';
import { ARTICLES } from '@/lib/blog';
import type { Workshop } from '@/lib/types';

export const revalidate = 300; // ISR

const TIER_RANK: Record<string, number> = { spotlight: 3, featured: 2, pro: 1, none: 0 };

// Linnad tegeliku otsingumahu järjekorras (DataForSEO 08.2026): Tallinn, Tartu esimesena.
const CITIES = ['Tallinn', 'Tartu', 'Pärnu', 'Narva', 'Rakvere', 'Viljandi', 'Kohtla-Järve', 'Kuressaare', 'Haapsalu', 'Võru', 'Valga', 'Jõhvi', 'Paide', 'Rapla'];

// Teenused nõudluse järjekorras: rehvivahetus + autoremont on suurima mahuga.
const SERVICES: [string, string][] = [
  ['rehvivahetus', 'Rehvivahetus'], ['olivahetus', 'Õlivahetus'], ['piduriklotsid', 'Piduriklotside vahetus'],
  ['diagnostika', 'Rikkediagnostika'], ['kliima', 'Kliimaseadme hooldus'], ['vedrustus', 'Rooliotsad ja vedrustus'],
  ['ulevaatus', 'Ülevaatuse eelkontroll'], ['mootoriremont', 'Mootoriremont'],
];

// Populaarsed teenuseplaadid (ikoon + lühikirjeldus) — juhivad kõige otsitumatele.
const TILES: { slug: string; label: string; desc: string; icon: keyof typeof Icon }[] = [
  { slug: 'rehvivahetus', label: 'Rehvivahetus', desc: 'Suve- ja talverehvid, hoiustamine', icon: 'clock' },
  { slug: 'olivahetus', label: 'Õlivahetus', desc: 'Õli ja filter, kiire hooldus', icon: 'bolt' },
  { slug: 'piduriklotsid', label: 'Piduriklotsid', desc: 'Klotsid ja kettad, ohutus', icon: 'shield' },
  { slug: 'diagnostika', label: 'Rikkediagnostika', desc: 'Rikketuli ja veakoodid', icon: 'search' },
  { slug: 'kliima', label: 'Kliimahooldus', desc: 'Täitmine ja lekkeotsing', icon: 'star' },
  { slug: 'vedrustus', label: 'Vedrustus', desc: 'Rooliotsad, amordid', icon: 'wrench' },
  { slug: 'ulevaatus', label: 'Ülevaatuse eelkontroll', desc: 'Väldi korduskontrolli', icon: 'check' },
  { slug: 'mootoriremont', label: 'Mootoriremont', desc: 'Suuremad tööd, hinnavõrdlus', icon: 'phone' },
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

  const posts = ARTICLES.slice(0, 3);

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
            <div className="herotrust">
              <span><Icon.check /> Kliendile alati tasuta</span>
              <span><Icon.shield /> Ehtsad arvustused</span>
              <span><Icon.bolt /> Vastus tundidega</span>
            </div>
          </div>
        </div>
      </section>

      <section className="blk" style={{ paddingTop: 0, marginTop: -34, paddingBottom: 40 }}>
        <div className="wrap">
          <div className="statstrip">
            <div className="st"><div className="stn">1 200+</div><div className="stl">töökoda kaardil</div></div>
            <div className="st"><div className="stn">14</div><div className="stl">linna üle Eesti</div></div>
            <div className="st"><div className="stn">0 €</div><div className="stl">kliendile — alati tasuta</div></div>
            <div className="st"><div className="stn">8</div><div className="stl">teenusekategooriat</div></div>
          </div>
        </div>
      </section>

      <section className="blk" style={{ paddingTop: 20, paddingBottom: 40 }}>
        <div className="wrap">
          <div className="sec-h center"><span className="eyebrow">Autokompassi abiline</span><h2>Mis su autol viga on?</h2>
            <p>Ei tea, millist teenust vajad? Kirjelda muret oma sõnadega — Kompu soovitab õiget teenust ja sobivaid töökodi.</p></div>
          <ChatAssistant />
        </div>
      </section>

      <section className="blk" style={{ background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="sec-head-row">
            <div><span className="eyebrow">Populaarsed teenused</span><h2>Mida eestlased kõige rohkem otsivad</h2></div>
            <Link className="linkmore" href="/tookojad">Vaata kõiki töökodi <Icon.arwr /></Link>
          </div>
          <div className="svctiles">
            {TILES.map((t) => {
              const IconC = Icon[t.icon];
              return (
                <Link key={t.slug} href={`/tookojad?svc=${t.slug}`} className="svctile">
                  <div className="ic"><IconC /></div>
                  <div className="tn">{t.label}</div>
                  <div className="td">{t.desc}</div>
                  <span className="tarrow">Vaata töökodi <Icon.arwr /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="blk" id="tookojad">
        <div className="wrap">
          <div className="sec-head-row">
            <div><span className="eyebrow">Esiletõstetud</span><h2>Kõrgelt hinnatud töökojad</h2></div>
            <Link className="linkmore" href="/tookojad">Vaata kõiki <Icon.arwr /></Link>
          </div>
          {featured.length ? (
            <div className="wsgrid">{featured.map((w) => <WorkshopCard key={w.id} w={w} />)}</div>
          ) : (
            <p style={{ color: 'var(--muted)' }}>Töökodade nimekiri täieneb — vaata <Link href="/tookojad" style={{ color: 'var(--blue)', fontWeight: 700 }}>kõiki töökodi</Link>.</p>
          )}
        </div>
      </section>

      <section className="blk" id="kuidas" style={{ background: '#fff', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="sec-h center"><span className="eyebrow">Kolm sammu</span><h2>Kuidas Autokompass töötab</h2>
            <p>Leiad õige töökoja kolme sammuga — ilma helistamata ja järjekorras ootamata.</p></div>
          <div className="wsgrid">
            {[['Kirjelda muret', 'Räägi lihtsas keeles, mis viga on — leiame sobivad töökojad sinu lähedalt.'],
              ['Võrdle pakkumisi', 'Vaata hindu, arvustusi ja vaba aega kõrvuti — leia soodsaim ja usaldusväärseim.'],
              ['Broneeri aeg', 'Vali parim pakkumine ja saada päring otse. Selge hind juba ette.']].map(([h, p], i) => (
              <div key={h} className="pcard"><div className="eyebrow" style={{ marginBottom: 8 }}>Samm {i + 1}</div><h3 style={{ fontFamily: 'Lexend', fontSize: 20, marginBottom: 8 }}>{h}</h3><p style={{ color: 'var(--muted)' }}>{p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="blk">
        <div className="wrap">
          <div className="sec-h center"><span className="eyebrow">Miks Autokompass</span><h2>Ausalt, ilma müügijututa</h2></div>
          <div className="valgrid">
            <div className="valcard"><div className="ic"><Icon.shield /></div><h3>Ehtsad arvustused</h3><p>Osa arvustusi on seotud tegeliku päringuga ja märgitud „Kontrollitud külastus". Vähem võltsi, rohkem tõde.</p></div>
            <div className="valcard"><div className="ic"><Icon.check /></div><h3>Kliendile tasuta</h3><p>Töökodade otsimine, võrdlemine ja päringu saatmine on sulle alati tasuta. Me ei võta vahendustasu.</p></div>
            <div className="valcard"><div className="ic"><Icon.clock /></div><h3>Selge hind ette</h3><p>Näed teenuse hinnavahemikku juba enne päringut ja saad korraga mitmelt töökojalt pakkumise.</p></div>
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
          <div className="sec-head-row">
            <div><span className="eyebrow">Blogi</span><h2>Nõuanded, mis säästavad raha</h2></div>
            <Link className="linkmore" href="/blogi">Kõik artiklid <Icon.arwr /></Link>
          </div>
          <div className="bloggrid">
            {posts.map((a) => (
              <Link key={a.slug} href={`/blogi/${a.slug}`} className="blogcard">
                <div className="blcover sm">{a.cover}</div>
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

      <section className="blk" style={{ background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="pcard" style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap', padding: 40 }}>
            <div style={{ flex: '0 0 150px', width: 150 }}><Kompu eyes="normal" mouth="smile" arms="wave" /></div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <span className="eyebrow">Töökojale</span>
              <h2 style={{ fontSize: 30, margin: '10px 0 12px' }}>Kas sul on autotöökoda?</h2>
              <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Lisa oma töökoda tasuta ja saa kliente, kes juba otsivad sinu teenust. Maksad ainult siis, kui soovid nähtavamat kohta — esiletõstu tipprehvihooaja ümber.</p>
              <Link href="/sisene?mode=shop" className="btn btn-p">Lisa oma töökoda</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
