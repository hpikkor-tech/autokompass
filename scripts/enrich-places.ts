/**
 * Rikastamine Google'iga — salvestame AINULT place_id + asukoha (lat/lng).
 *
 * Google Places ToS: place_id tohib salvestada jäädavalt. Arvustusi, fotosid, reitinguid,
 * nime/aadressi Google'ist EI cache'ita ega kuvata meie omana. Reiting/arvustused = meie oma.
 * Asukoha (lat/lng) võtame aadressist Geocoding API-ga, et toimiks "lähima töökoja" otsing.
 *
 * Käivita: npm run enrich:places   (töötleb töökojad, kellel place_id veel puudu)
 */
import { createClient } from '@supabase/supabase-js';

const KEY = process.env.GOOGLE_MAPS_API_KEY!;
const LIMIT = Number(process.env.ENRICH_LIMIT ?? 200); // jooksu kohta (kvoodi/kulu ohje)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function findPlaceId(query: string): Promise<string | null> {
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${KEY}`;
  const r = await fetch(url).then((x) => x.json());
  return r.candidates?.[0]?.place_id ?? null;
}

async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&region=ee&key=${KEY}`;
  const r = await fetch(url).then((x) => x.json());
  const loc = r.results?.[0]?.geometry?.location;
  return loc ? { lat: loc.lat, lng: loc.lng } : null;
}

async function main() {
  const { data: rows, error } = await supabase
    .from('workshops')
    .select('id,name,address,city,google_place_id,lat')
    .is('google_place_id', null)
    .limit(LIMIT);
  if (error) { console.error(error.message); process.exit(1); }
  if (!rows?.length) { console.log('Rikastatavaid töökodi pole.'); return; }

  console.log(`Rikastan ${rows.length} töökoda ...`);
  for (const w of rows) {
    const query = [w.name, w.address, w.city, 'Eesti'].filter(Boolean).join(', ');
    try {
      const place_id = await findPlaceId(query);
      const patch: Record<string, unknown> = {};
      if (place_id) patch.google_place_id = place_id;
      if (w.lat == null && w.address) {
        const geo = await geocode(`${w.address}, ${w.city ?? ''}, Eesti`);
        if (geo) { patch.lat = geo.lat; patch.lng = geo.lng; }
      }
      if (Object.keys(patch).length) {
        await supabase.from('workshops').update(patch).eq('id', w.id);
        console.log(`  ✓ ${w.name}`);
      }
    } catch (e: any) {
      console.warn(`  ! ${w.name}: ${e.message}`);
    }
    await new Promise((res) => setTimeout(res, 120)); // kvoodisõbralik
  }
  console.log('Valmis.');
}

main().catch((e) => { console.error(e); process.exit(1); });
