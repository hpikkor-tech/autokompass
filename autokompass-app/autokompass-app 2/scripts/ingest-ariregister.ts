/**
 * Sissevedu: Eesti äriregistri AVAANDMED -> workshops (EMTAK 45.20 = autode hooldus ja remont).
 *
 * Miks äriregister: avaandmed on TASUTA, LEGAALSELT salvestatavad, TÄIELIKUD ja uuenevad
 * regulaarselt — see on "24/7 automaatselt uuenev kataloog", mida Google Places ToS ei luba.
 *
 * Andmefail (lae alla käsitsi või automatiseeri cron'iga):
 *   https://avaandmed.ariregister.rik.ee/et/avaandmete-allalaadimine
 *   -> "Ettevõtja rekvisiidid" JSON (sisaldab nime, registrikoodi, aadressi, tegevusalasid/EMTAK).
 * Salvesta faile kausta ./data/ ja anna tee ette:
 *   DATA_FILE=./data/ettevotja_rekvisiidid.json npm run ingest:ariregister
 *
 * NB: RIK muudab aeg-ajalt väljanimesid — kontrolli allpool MAP-funktsiooni faili päise vastu.
 */
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const EMTAK_PREFIX = '4520'; // sõidukite hooldus ja remont
const DATA_FILE = process.env.DATA_FILE ?? './data/ettevotja_rekvisiidid.json';
const DRY = process.argv.includes('--dry-run');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// Eestikeelne slug
function slugify(s: string) {
  const map: Record<string, string> = { ä: 'a', ö: 'o', õ: 'o', ü: 'u', š: 's', ž: 'z' };
  return s.toLowerCase().replace(/[äöõüšž]/g, (c) => map[c] || c)
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
}

interface RawCompany {
  ariregistri_kood?: number | string;
  nimi?: string;
  evks?: string;
  ettevotja_staatus?: string;
  ettevotja_staatus_tekstina?: string;
  teatatud_tegevusalad?: Array<{ emtak_kood?: string; emtak_tekst?: string; on_pohitegevusala?: string }>;
  aadressid?: Array<{
    ads_normaliseeritud_taisaadress?: string;
    tanav_maja_korter?: string;
    ehak_nimetus?: string;   // asula / linn
    ehak_maakond?: string;   // maakond
  }>;
}

function mapCompany(c: RawCompany) {
  const emtaks = c.teatatud_tegevusalad ?? [];
  const isAuto = emtaks.some((t) => (t.emtak_kood ?? '').startsWith(EMTAK_PREFIX));
  if (!isAuto) return null;

  const name = (c.nimi ?? '').trim();
  const reg = String(c.ariregistri_kood ?? '').trim();
  if (!name || !reg) return null;

  const addr = c.aadressid?.[0];
  const fullAddr = addr?.ads_normaliseeritud_taisaadress || addr?.tanav_maja_korter || null;
  const city = addr?.ehak_nimetus || null;
  const county = addr?.ehak_maakond || null;
  const emtak = emtaks.find((t) => (t.emtak_kood ?? '').startsWith(EMTAK_PREFIX))?.emtak_kood ?? null;

  return {
    reg_code: reg,
    name,
    slug: `${slugify(name)}-${reg.slice(-4)}`, // unikaalsuse tagavara
    emtak_code: emtak,
    legal_status: c.ettevotja_staatus_tekstina || c.ettevotja_staatus || null,
    address: fullAddr,
    city,
    county,
    data_origin: 'Eesti äriregistri avaandmed (RIK)',
  };
}

async function main() {
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`Andmefaili ei leitud: ${DATA_FILE}\nLae alla: https://avaandmed.ariregister.rik.ee/et/avaandmete-allalaadimine`);
    process.exit(1);
  }
  console.log(`Loen ${DATA_FILE} ...`);
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) as RawCompany[];
  const list = Array.isArray(raw) ? raw : (raw as any).data ?? [];

  const rows = list.map(mapCompany).filter((r: ReturnType<typeof mapCompany>): r is NonNullable<ReturnType<typeof mapCompany>> => r !== null);
  console.log(`Leitud ${rows.length} EMTAK ${EMTAK_PREFIX}x töökoda (kokku ${list.length} ettevõtet).`);

  if (DRY) { console.log('Näidis:', rows.slice(0, 5)); return; }

  // Upsert partiidena (reg_code peal). Ei kirjuta üle töökoja enda täidetud sisu.
  const CHUNK = 500;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    const { error } = await supabase.from('workshops').upsert(batch, { onConflict: 'reg_code', ignoreDuplicates: false });
    if (error) { console.error('Upsert viga:', error.message); process.exit(1); }
    console.log(`  ...${Math.min(i + CHUNK, rows.length)}/${rows.length}`);
  }
  console.log('Valmis. Järgmine samm: npm run enrich:places (asukoht + Google place_id).');
}

main().catch((e) => { console.error(e); process.exit(1); });
