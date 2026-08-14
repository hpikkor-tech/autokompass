'use client';
import { createBrowserClient } from '@supabase/ssr';

// Brauseri-poolne klient (anon võti). RLS kaitseb andmeid.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
