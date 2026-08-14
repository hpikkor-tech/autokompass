# Autokompass

Eesti autotöökodade kataloog ja võrdlusportaal. Next.js + Supabase + Resend + AgentMail.

> **Ärimudel:** kataloog on kliendile tasuta. Töökojad lunastavad profiili ja maksavad
> *esiletõstu* (featured) eest — mitte komisjoni tööde pealt. Kasv tuleb SEO-lehtedelt
> (iga töökoda = oma indekseeritav leht).

## Arhitektuuri põhiotsused

| Otsus | Miks |
|------|------|
| **Kataloogi baas = Eesti äriregistri avaandmed** (EMTAK 45.20) | Tasuta, legaalselt salvestatav, täielik, uueneb. "24/7 auto-kataloog". |
| **Google'ist ainult `place_id` + asukoht** | Google Places ToS: muud sisu (arvustused/fotod/reiting) ei tohi salvestada ega kuvada meie omana. |
| **Arvustused = 100% meie oma, kontrollitud** | Seotud portaali kaudu tehtud päringuga → "kontrollitud külastus". See on eelis Google Maps'i ees. |
| **Resend = ainult transaktsiooniline** | Päringu/arvustuse teavitused. Külmpostitus siit = konto kinni. |
| **AgentMail = outreach** (eraldi domeen) | Töökodade kutsumine/onboarding käib siit, lahus transaktsioonilisest reputatsioonist. |
| **GDPR art 14** | Iga töökoja juures `data_origin` (andmete päritolu) + `is_hidden` ("eemalda minu profiil"). |

## Tehnoloogia

- **Next.js 14** (App Router, ISR SEO-lehed) → Vercel
- **Supabase** (Postgres + PostGIS geo + pg_trgm otsing + Auth + RLS)
- **Resend** — transaktsiooniline e-post
- **AgentMail** — outreach / agent-suhtlus
- **Claude** — chat-abilise / agent-loogika (eraldi, v2)

## Seadistus (0 → live)

### 1. Supabase
1. Loo projekt [supabase.com](https://supabase.com).
2. SQL Editor → jooksuta `supabase/migrations/0001_init.sql`.
   (Vajab laiendusi `postgis`, `pg_trgm`, `pgcrypto` — migratsioon lubab need ise.)
3. Authentication → Providers → luba **Email** ja soovi korral **Google**.
4. Kopeeri Project URL + anon key + service_role key.

### 2. Keskkonnamuutujad
Kopeeri `.env.example` → `.env.local` ja täida:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...     # ainult server/skriptid
GOOGLE_MAPS_API_KEY=...
RESEND_API_KEY=...  RESEND_FROM="Autokompass <teavitus@autokompass.ee>"
AGENTMAIL_API_KEY=...  AGENTMAIL_OUTREACH_DOMAIN=outreach.autokompass.ee
```

### 3. Käivita lokaalselt
```
npm install
npm run seed:demo     # 6 näidistöökoda, et kohe midagi näha
npm run dev           # http://localhost:3000
```

### 4. Päris andmed (äriregister)
1. Lae "Ettevõtja rekvisiidid" JSON: https://avaandmed.ariregister.rik.ee/et/avaandmete-allalaadimine → `./data/`
2. `DATA_FILE=./data/ettevotja_rekvisiidid.json npm run ingest:ariregister`
   (esmalt proovi `... --dry-run`, et näha EMTAK 45.20 töökodade arvu ja näidisridu)
3. `npm run enrich:places` — lisab Google `place_id` + asukoha (lat/lng).
   > Kontrolli `scripts/ingest-ariregister.ts` väljanimed RIK faili päise vastu — RIK muudab neid aeg-ajalt.

### 5. Deploy (Vercel)
1. Push GitHubi, impordi Vercelisse.
2. Lisa samad env-muutujad Vercelisse (service_role AINULT server-side).
3. Supabase → Auth → URL Configuration: lisa Vercel domeen ja `…/auth/callback`.
4. Ingestioni saab ajastada Vercel Cron'iga või eraldi workeriga (nt kord ööpäevas).

## Struktuur
```
app/                     Next.js App Router
  page.tsx               avaleht (hero, otsing, populaarsed)
  tookojad/              listing (filtrid, sort — Supabase päring)
  tookoda/[slug]/        töökoja profiil (ISR, galerii, hinnad, arvustused)
  sisene/                sisselogimine (klient / töökoda)
  api/quote|review/      päringu ja arvustuse endpoint'id
components/              Header, Footer, WorkshopCard, Kompu (maskott), vormid
lib/supabase/            browser + server + admin kliendid
lib/email/               resend (transaktsiooniline) + agentmail (outreach)
scripts/                 ingest-ariregister, enrich-places, seed-demo
supabase/migrations/     0001_init.sql — kogu skeem + RLS
```

## Mis on tehtud (v0.1) ja mis järgmisena

**Tehtud:** andmeskeem + RLS, äriregistri ingestion, Google place_id rikastamine, avaleht,
listing (filtrid/sort), töökoja profiil (ISR + SEO), sisselogimine (klient/töökoda),
päringu ja kontrollitud arvustuse voog, e-posti liinid (Resend/AgentMail lahus).

**Järgmisena:** töökoja lunastamise (claim) voog + admin-kinnitus · esiletõstu maksed
(Montonio/EveryPay) · töökoja töölaud (statistika, päringud) · chat-abiline Claude'iga ·
AgentMail outreach-kampaania töökodade kutsumiseks · blogi/CMS SEO jaoks.
