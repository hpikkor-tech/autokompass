// Andmetuubid (peegeldavad supabase/migrations/0001_init.sql skeemi)

export type FeaturedTier = 'none' | 'pro' | 'featured' | 'spotlight';

export interface Workshop {
  id: string;
  reg_code: string | null;
  name: string;
  slug: string;
  emtak_code: string | null;
  address: string | null;
  city: string | null;
  county: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  google_place_id: string | null;
  about: string | null;
  logo_url: string | null;
  photos: string[];
  claimed: boolean;
  featured_tier: FeaturedTier;
  featured_until: string | null;
  data_origin: string;
  opening_hours: string | null;
  services: string[];
  brand: string | null;
  is_hidden: boolean;
  rating_avg: number; google_rating: number | null; google_rating_count: number | null;
  rating_count: number;
  created_at: string;
  updated_at: string;
  svc_rows?: WorkshopService[];
  dist_km?: number;
}

export interface ServiceCategory {
  id: number;
  slug: string;
  name_et: string;
  keywords: string[];
  sort: number;
}

export interface WorkshopService {
  id: string;
  workshop_id: string;
  category_id: number;
  price_from: number | null;
  price_to: number | null;
  note: string | null;
  category?: ServiceCategory;
}

export interface Review {
  id: string;
  workshop_id: string;
  user_id: string;
  rating: number;
  body: string;
  verified: boolean;
  quote_id: string | null;
  status: 'published' | 'hidden' | 'flagged';
  created_at: string;
}

export interface Quote {
  id: string;
  workshop_id: string;
  user_id: string | null;
  category_id: number | null;
  name: string | null;
  phone: string;
  message: string;
  status: 'new' | 'seen' | 'replied' | 'closed';
  created_at: string;
}
