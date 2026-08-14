-- Autokompass — algne andmeskeem (Supabase / Postgres)
-- Otsused, mida see skeem kannab:
--   * Kataloogi BAAS tuleb Eesti äriregistri avaandmetest (EMTAK 45.20). Legaalne salvestada.
--   * Google'ist salvestame AINULT place_id (Google Places ToS). Mitte arvustusi/fotosid/reitingut.
--   * Arvustused on 100% MEIE OMA ja KONTROLLITUD (seotud portaali kaudu tehtud päringuga).
--   * GDPR art 14: iga töökoja juures on data_origin (kust andmed pärinevad) + is_hidden ("eemalda minu profiil").
--   * Monetiseerimine: esiletõst (featured_tier), mitte komisjon tööde pealt.

-- ---------- Laiendused ----------
create extension if not exists pgcrypto;      -- gen_random_uuid()
create extension if not exists pg_trgm;        -- nime/teenuse tekstiotsing
create extension if not exists postgis;        -- geo: lähima töökoja otsing (nt "Algi tn 34")

-- ---------- Enumid ----------
create type user_role   as enum ('client','workshop','admin');
create type claim_status as enum ('pending','approved','rejected');
create type review_status as enum ('published','hidden','flagged');
create type quote_status as enum ('new','seen','replied','closed');
create type featured_tier as enum ('none','pro','featured','spotlight');
create type sub_status   as enum ('active','past_due','canceled');

-- ============================================================
--  PROFILES  (laiendab auth.users)
-- ============================================================
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'client',
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles: loe enda oma"   on profiles for select using (auth.uid() = id);
create policy "profiles: uuenda enda oma" on profiles for update using (auth.uid() = id);
create policy "profiles: loo enda oma"    on profiles for insert with check (auth.uid() = id);

-- Uue kasutaja loomisel tekita profiil
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();

-- ============================================================
--  SERVICE CATEGORIES  (teenuste taksonoomia + märksõnad chat-abilisele)
-- ============================================================
create table service_categories (
  id        serial primary key,
  slug      text unique not null,
  name_et   text not null,
  keywords  text[] not null default '{}',  -- vabateksti -> teenuse tuvastus (nt {rehv,kummid,rehvivahetus})
  sort      int not null default 0
);

alter table service_categories enable row level security;
create policy "svc: avalik lugemine" on service_categories for select using (true);

insert into service_categories (slug,name_et,keywords,sort) values
 ('olivahetus','Õlivahetus','{õli,õlivahetus,määre}',1),
 ('rehvivahetus','Rehvivahetus','{rehv,rehvi,kummid,kumm,rehvivahetus,hoiust}',2),
 ('piduriklotsid','Piduriklotside vahetus','{pidur,piduri,kriuks,piduriklots,klots}',3),
 ('diagnostika','Rikkediagnostika','{rikketuli,kontrolltuli,mootorituli,veakood,diagnostika,tõrge}',4),
 ('kliima','Kliimaseadme hooldus','{kliima,jahuta,konditsioneer,külm}',5),
 ('vedrustus','Rooliotsad ja vedrustus','{rool,väristab,vedrustus,amort,logiseb,koliseb,raputab}',6),
 ('ulevaatus','Ülevaatuse eelkontroll','{ülevaatus}',7),
 ('mootoriremont','Mootoriremont','{mootor,mootoriremont,hammasrihm}',8);

-- ============================================================
--  WORKSHOPS  (kataloogi tuum)
-- ============================================================
create table workshops (
  id            uuid primary key default gen_random_uuid(),

  -- Äriregistri baasandmed (avaandmed, legaalne salvestada)
  reg_code      text unique,                 -- registrikood
  name          text not null,
  slug          text unique not null,
  emtak_code    text,                         -- nt 45201
  legal_status  text,                         -- registri staatus (R = registrisse kantud jne)

  -- Asukoht
  address       text,
  city          text,
  county        text,
  lat           double precision,
  lng           double precision,
  geom          geography(Point,4326),        -- lähima otsingu jaoks (GiST index all)

  -- Kontakt (avaandmetest / töökoja täiendatud)
  phone         text,
  email         text,
  website       text,

  -- Google: AINULT place_id (Places ToS). Reitingut/arvustusi EI salvesta.
  google_place_id text,

  -- Töökoja täidetud sisu (pärast lunastamist)
  about         text,
  logo_url      text,
  photos        text[] default '{}',          -- meie oma / töökoja üleslaaditud fotod (mitte Google'i)

  -- Äri
  claimed       boolean not null default false,
  claimed_by    uuid references auth.users(id) on delete set null,
  featured_tier featured_tier not null default 'none',
  featured_until timestamptz,

  -- GDPR
  data_origin   text not null default 'Eesti äriregistri avaandmed (RIK)',  -- art 14: andmete päritolu
  is_hidden     boolean not null default false,                             -- "eemalda minu profiil"

  -- Denormaliseeritud reiting (meie oma arvustustest, hoiab listingu kiirena)
  rating_avg    numeric(2,1) not null default 0,
  rating_count  int not null default 0,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Indeksid
create index workshops_geom_idx    on workshops using gist (geom);
create index workshops_city_idx    on workshops (city);
create index workshops_name_trgm   on workshops using gin (name gin_trgm_ops);
create index workshops_featured_idx on workshops (featured_tier, featured_until);
create index workshops_visible_idx  on workshops (is_hidden) where is_hidden = false;

-- geom hoitakse lat/lng-ga sünkroonis
create or replace function workshops_sync_geom() returns trigger
language plpgsql as $$
begin
  if new.lat is not null and new.lng is not null then
    new.geom := st_setsrid(st_makepoint(new.lng, new.lat), 4326)::geography;
  end if;
  new.updated_at := now();
  return new;
end; $$;

create trigger workshops_geom_trg before insert or update on workshops
  for each row execute function workshops_sync_geom();

alter table workshops enable row level security;

-- Avalik näeb ainult nähtavaid töökodi
create policy "workshops: avalik lugemine" on workshops
  for select using (is_hidden = false);

-- Lunastanud omanik saab uuendada oma töökoja SISU (mitte registri baasi)
create policy "workshops: omanik uuendab" on workshops
  for update using (auth.uid() = claimed_by and claimed = true);

-- Sissevedu (ingestion) ja admin toimivad service_role võtmega (RLS-i ei rakendata service_role'ile).

-- ============================================================
--  WORKSHOP SERVICES  (teenused + hinnad, töökoja sisestatud)
-- ============================================================
create table workshop_services (
  id           uuid primary key default gen_random_uuid(),
  workshop_id  uuid not null references workshops(id) on delete cascade,
  category_id  int  not null references service_categories(id),
  price_from   numeric(10,2),
  price_to     numeric(10,2),
  note         text,
  unique (workshop_id, category_id)
);

create index ws_services_ws_idx  on workshop_services (workshop_id);
create index ws_services_cat_idx on workshop_services (category_id);

alter table workshop_services enable row level security;
create policy "ws_services: avalik lugemine" on workshop_services for select using (true);
create policy "ws_services: omanik haldab" on workshop_services
  for all using (exists (
    select 1 from workshops w
    where w.id = workshop_id and w.claimed_by = auth.uid() and w.claimed = true
  ));

-- ============================================================
--  QUOTES  ("Küsi pakkumist" — ka aluseks kontrollitud arvustusele)
-- ============================================================
create table quotes (
  id           uuid primary key default gen_random_uuid(),
  workshop_id  uuid not null references workshops(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete set null,  -- võib olla sisse logimata
  category_id  int references service_categories(id),
  name         text,
  phone        text not null,
  message      text not null,
  status       quote_status not null default 'new',
  created_at   timestamptz not null default now()
);

create index quotes_ws_idx   on quotes (workshop_id);
create index quotes_user_idx on quotes (user_id);

alter table quotes enable row level security;
-- Igaüks võib saata päringu
create policy "quotes: loomine" on quotes for insert with check (true);
-- Töökoja omanik näeb oma päringuid; klient näeb enda saadetuid
create policy "quotes: omanik loeb" on quotes for select using (
  exists (select 1 from workshops w where w.id = workshop_id and w.claimed_by = auth.uid())
  or user_id = auth.uid()
);

-- ============================================================
--  REVIEWS  (MEIE OMA, kontrollitud)
-- ============================================================
create table reviews (
  id           uuid primary key default gen_random_uuid(),
  workshop_id  uuid not null references workshops(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  rating       int  not null check (rating between 1 and 5),
  body         text not null check (char_length(body) >= 8),
  verified     boolean not null default false,   -- seotud päris päringuga -> "kontrollitud külastus"
  quote_id     uuid references quotes(id) on delete set null,
  status       review_status not null default 'published',
  created_at   timestamptz not null default now(),
  unique (workshop_id, user_id)                   -- üks arvustus kasutaja kohta töökojale
);

create index reviews_ws_idx on reviews (workshop_id);

alter table reviews enable row level security;
create policy "reviews: avalik lugemine" on reviews for select using (status = 'published');
-- Sisselogitud klient saab luua/uuendada ENDA arvustust (verified määratakse serveris)
create policy "reviews: klient loob"    on reviews for insert with check (auth.uid() = user_id);
create policy "reviews: klient uuendab" on reviews for update using (auth.uid() = user_id);
create policy "reviews: klient kustutab" on reviews for delete using (auth.uid() = user_id);

-- Reitingu denormaliseerimine workshops peale
create or replace function refresh_workshop_rating(w uuid) returns void
language sql as $$
  update workshops set
    rating_avg = coalesce((select round(avg(rating)::numeric,1) from reviews where workshop_id = w and status='published'),0),
    rating_count = (select count(*) from reviews where workshop_id = w and status='published')
  where id = w;
$$;

create or replace function reviews_after_change() returns trigger
language plpgsql as $$
begin
  perform refresh_workshop_rating(coalesce(new.workshop_id, old.workshop_id));
  return null;
end; $$;

create trigger reviews_rating_trg after insert or update or delete on reviews
  for each row execute function reviews_after_change();

-- ============================================================
--  CLAIMS  (töökoja lunastamine)
-- ============================================================
create table claims (
  id           uuid primary key default gen_random_uuid(),
  workshop_id  uuid not null references workshops(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  status       claim_status not null default 'pending',
  evidence     text,                      -- kuidas tõestab seotust (e-post domeen, dokument vms)
  created_at   timestamptz not null default now(),
  unique (workshop_id, user_id)
);

alter table claims enable row level security;
create policy "claims: klient loob"  on claims for insert with check (auth.uid() = user_id);
create policy "claims: klient loeb"  on claims for select using (auth.uid() = user_id);

-- ============================================================
--  SUBSCRIPTIONS  (esiletõst / featured — maksed Montonio/EveryPay/Stripe)
-- ============================================================
create table subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  workshop_id        uuid not null references workshops(id) on delete cascade,
  tier               featured_tier not null,
  status             sub_status not null default 'active',
  provider           text,                 -- 'montonio' | 'everypay' | 'stripe'
  provider_ref       text,
  current_period_end timestamptz,
  created_at         timestamptz not null default now()
);

create index subs_ws_idx on subscriptions (workshop_id);

alter table subscriptions enable row level security;
create policy "subs: omanik loeb" on subscriptions for select using (
  exists (select 1 from workshops w where w.id = workshop_id and w.claimed_by = auth.uid())
);

-- Aktiivse tellimuse korral sünkroonib workshops.featured_tier/until
create or replace function subs_sync_featured() returns trigger
language plpgsql as $$
begin
  update workshops w set
    featured_tier = case when new.status='active' then new.tier else 'none' end,
    featured_until = new.current_period_end
  where w.id = new.workshop_id;
  return new;
end; $$;

create trigger subs_sync_trg after insert or update on subscriptions
  for each row execute function subs_sync_featured();
