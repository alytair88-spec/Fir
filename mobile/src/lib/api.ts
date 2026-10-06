import type { CategorySlug } from '@/constants/categories';
import type { City } from '@/constants/cities';
import { DEMO_BUSINESSES } from './demoData';
import { supabase } from './supabase';
import type { BoundingBox, Business, BusinessInput } from './types';

const MAX_RESULTS = 500;

export function cityBox(city: City): BoundingBox {
  const half = city.span / 2;
  return {
    minLat: city.latitude - half,
    maxLat: city.latitude + half,
    minLng: city.longitude - half,
    maxLng: city.longitude + half,
  };
}

function inBox(b: Business, box: BoundingBox): boolean {
  return b.latitude >= box.minLat && b.latitude <= box.maxLat && b.longitude >= box.minLng && b.longitude <= box.maxLng;
}

/** Published businesses inside the box, optionally of one category. Available to guests. */
export async function fetchBusinessesInBox(box: BoundingBox, category: CategorySlug | null): Promise<Business[]> {
  if (!supabase) {
    return DEMO_BUSINESSES.filter((b) => inBox(b, box) && (!category || b.category === category));
  }
  let query = supabase
    .from('businesses')
    .select('*')
    .eq('is_published', true)
    .gte('latitude', box.minLat)
    .lte('latitude', box.maxLat)
    .gte('longitude', box.minLng)
    .lte('longitude', box.maxLng)
    .order('name')
    .limit(MAX_RESULTS);
  if (category) {
    query = query.eq('category', category);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as Business[];
}

export async function fetchBusiness(id: string): Promise<Business | null> {
  if (!supabase) {
    return DEMO_BUSINESSES.find((b) => b.id === id) ?? null;
  }
  const { data, error } = await supabase.from('businesses').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Business | null;
}

export async function fetchMyBusinesses(ownerId: string): Promise<Business[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Business[];
}

function requireBackend() {
  if (!supabase) throw new Error('Backend is not configured');
  return supabase;
}

export async function createBusiness(ownerId: string, input: BusinessInput): Promise<Business> {
  const { data, error } = await requireBackend()
    .from('businesses')
    .insert({ ...input, owner_id: ownerId })
    .select()
    .single();
  if (error) throw error;
  return data as Business;
}

export async function updateBusiness(id: string, input: BusinessInput): Promise<Business> {
  const { data, error } = await requireBackend().from('businesses').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data as Business;
}

export async function deleteBusiness(id: string): Promise<void> {
  const { error } = await requireBackend().from('businesses').delete().eq('id', id);
  if (error) throw error;
}
