/**
 * Demo-seeme: 6 näidistöökoda + teenused, et rakendust kohe testida (enne täis-ingestioni).
 * Käivita: npm run seed:demo
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const WS = [
  { slug: 'meistrite-autotookoda', name: 'Meistrite Autotöökoda', city: 'Tallinn', address: 'Peterburi tee 34, Tallinn', lat: 59.4258, lng: 24.8555, phone: '+372 5123 4567', featured_tier: 'featured',
    about: 'Peresõbralik täisteenusega töökoda Lasnamäel. 18 aastat kogemust, kõik automargid.',
    services: [['olivahetus',39,55],['rehvivahetus',25,35],['piduriklotsid',55,90],['diagnostika',30,30]] },
  { slug: 'autofix-tartu', name: 'AutoFix Tartu', city: 'Tartu', address: 'Ringtee 12, Tartu', lat: 58.3626, lng: 26.7051, phone: '+372 5234 5678', featured_tier: 'none',
    about: 'Kaasaegne diagnostikakeskus Tartus. Bosch Car Service partner.',
    services: [['olivahetus',35,50],['diagnostika',35,35],['mootoriremont',60,null]] },
  { slug: 'rehvikuningas', name: 'Rehvikuningas', city: 'Tallinn', address: 'Pärnu mnt 142, Tallinn', lat: 59.4108, lng: 24.7080, phone: '+372 5345 6789', featured_tier: 'spotlight',
    about: 'Eesti suurim rehvikeskus. Hooajal broneering veebis, hoiustamine ja kiirteenindus.',
    services: [['rehvivahetus',20,30]] },
  { slug: 'parnu-automeister', name: 'Pärnu Automeister', city: 'Pärnu', address: 'Riia mnt 88, Pärnu', lat: 58.3801, lng: 24.5136, phone: '+372 5456 7890', featured_tier: 'none',
    about: 'Väike sõbralik töökoda Pärnu südames. Kiire ülevaatuse eelkontroll.',
    services: [['ulevaatus',20,20],['olivahetus',32,48]] },
  { slug: 'narva-auto-service', name: 'Narva Auto Service', city: 'Narva', address: 'Tallinna mnt 19, Narva', lat: 59.3773, lng: 28.1903, phone: '+372 5567 8901', featured_tier: 'pro',
    about: 'Täisteenusega töökoda Narvas. Autoelektri ja diagnostika spetsialistid.',
    services: [['diagnostika',28,28],['olivahetus',30,45]] },
  { slug: 'kiirhooldus-24', name: 'Kiirhooldus 24', city: 'Tallinn', address: 'Mustamäe tee 5, Tallinn', lat: 59.4200, lng: 24.7050, phone: '+372 5678 9012', featured_tier: 'featured',
    about: 'Kiirhooldus ilma broneeringuta. Õlivahetus 30 minutiga. Avatud ka nädalavahetusel.',
    services: [['olivahetus',29,45],['kliima',49,75]] },
];

async function main() {
  const { data: cats } = await supabase.from('service_categories').select('id,slug');
  const catId = new Map((cats ?? []).map((c) => [c.slug, c.id]));

  for (const w of WS) {
    const { services, ...ws } = w;
    const photos = ['/demo/1.jpg', '/demo/2.jpg', '/demo/3.jpg'];
    const { data, error } = await supabase.from('workshops')
      .upsert({ ...ws, photos, data_origin: 'Demo-seeme', claimed: true }, { onConflict: 'slug' })
      .select('id').single();
    if (error) { console.error(error.message); continue; }
    const rows = services.map(([slug, from, to]) => ({
      workshop_id: data!.id, category_id: catId.get(slug as string), price_from: from, price_to: to,
    })).filter((r) => r.category_id);
    await supabase.from('workshop_services').upsert(rows, { onConflict: 'workshop_id,category_id' });
    console.log(`  ✓ ${w.name}`);
  }
  console.log('Demo seemned lisatud.');
}

main().catch((e) => { console.error(e); process.exit(1); });
