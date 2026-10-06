import type { CategorySlug } from '@/constants/categories';

export interface Business {
  id: string;
  owner_id: string | null;
  name: string;
  category: CategorySlug;
  description: string | null;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  opening_hours: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type BusinessInput = Omit<Business, 'id' | 'owner_id' | 'created_at' | 'updated_at'>;

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}
