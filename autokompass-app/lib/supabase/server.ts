import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as createJsClient } from '@supabase/supabase-js';

// Serveripoolne klient (kasutaja sessioon küpsistest) — RLS kehtib kasutaja rollile.
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(list: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try { list.forEach((c) => cookieStore.set(c.name, c.value, c.options as any)); }
          catch { /* server component — küpsiseid ei saa siin seada */ }
        },
      },
    }
  );
}

// Avalik lugemisklient ilma küpsisteta — hoiab public-lehed ISR/staatilisena (SEO).
// Kasuta avalehel, listingus, profiilil (kus kasutaja sessiooni pole vaja).
export function createPublicClient() {
  return createJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

// Nagu createPublicClient, aga iga paring laheb otse DB-sse (Verceli Data Cache moodub).
// Kasuta listingus, kus filtriloendurid peavad olema alati varsked. Ei mojuta muid fetch'e
// samal lehel (nt Google Places), erinevalt route-tasandi fetchCache = 'force-no-store'-ist.
export function createFreshClient() {
  return createJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: { fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, { ...init, cache: 'no-store' }) },
    }
  );
}

// Service-role klient (möödub RLS-ist). AINULT serveris / skriptides — mitte kunagi brauserisse.
export function createAdminClient() {
  return createJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
