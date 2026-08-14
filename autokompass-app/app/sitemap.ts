import type { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase/server';
import { SERVICES, cityPageParams } from '@/lib/landing';
import { ARTICLES } from '@/lib/blog';

export const revalidate = 3600;

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://autokompass.ee').replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/tookojad`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/blogi`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/hinnakiri`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privaatsus`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE}/tingimused`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  for (const s of SERVICES) urls.push({ url: `${BASE}/${s.slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 });
  for (const { teenus, linn } of cityPageParams()) urls.push({ url: `${BASE}/${teenus}/${linn}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 });
  for (const a of ARTICLES) urls.push({ url: `${BASE}/blogi/${a.slug}`, lastModified: new Date(a.date), changeFrequency: 'monthly', priority: 0.5 });

  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from('workshops').select('slug, updated_at').eq('is_hidden', false).limit(2000);
    for (const w of (data as { slug: string; updated_at: string }[] | null) ?? []) {
      urls.push({ url: `${BASE}/tookoda/${w.slug}`, lastModified: w.updated_at ? new Date(w.updated_at) : now, changeFrequency: 'monthly', priority: 0.6 });
    }
  } catch { /* DB pole seadistatud */ }

  return urls;
}
