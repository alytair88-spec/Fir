import type { Lang } from '@/lib/i18n';

// Keep slugs in sync with `public.categories` in supabase/migrations.
export type CategorySlug =
  | 'tire_service'
  | 'car_service'
  | 'driving_school'
  | 'dentist'
  | 'fitness'
  | 'shoe_store'
  | 'clothing_store'
  | 'bar'
  | 'restaurant'
  | 'cafe'
  | 'grocery'
  | 'pharmacy'
  | 'beauty_salon'
  | 'hotel'
  | 'other';

export interface Category {
  slug: CategorySlug;
  emoji: string;
  color: string;
  name: Record<Lang, string>;
}

export const CATEGORIES: Category[] = [
  { slug: 'tire_service', emoji: '🛞', color: '#37474F', name: { uk: 'Шиномонтаж', hu: 'Gumiszerviz', en: 'Tire service' } },
  { slug: 'car_service', emoji: '🔧', color: '#455A64', name: { uk: 'Автосервіс', hu: 'Autószerviz', en: 'Car service' } },
  { slug: 'driving_school', emoji: '🚗', color: '#1565C0', name: { uk: 'Автошкола', hu: 'Autósiskola', en: 'Driving school' } },
  { slug: 'dentist', emoji: '🦷', color: '#00838F', name: { uk: 'Стоматологія', hu: 'Fogászat', en: 'Dentist' } },
  { slug: 'fitness', emoji: '🏋️', color: '#6A1B9A', name: { uk: 'Фітнес-клуб', hu: 'Fitneszterem', en: 'Fitness club' } },
  { slug: 'shoe_store', emoji: '👟', color: '#AD1457', name: { uk: 'Взуття', hu: 'Cipőbolt', en: 'Shoe store' } },
  { slug: 'clothing_store', emoji: '👕', color: '#C2185B', name: { uk: 'Одяг', hu: 'Ruházat', en: 'Clothing' } },
  { slug: 'bar', emoji: '🍺', color: '#EF6C00', name: { uk: 'Бари', hu: 'Bárok', en: 'Bars' } },
  { slug: 'restaurant', emoji: '🍽️', color: '#D84315', name: { uk: 'Ресторани', hu: 'Éttermek', en: 'Restaurants' } },
  { slug: 'cafe', emoji: '☕', color: '#6D4C41', name: { uk: 'Кафе', hu: 'Kávézók', en: 'Cafés' } },
  { slug: 'grocery', emoji: '🛒', color: '#2E7D32', name: { uk: 'Продукти', hu: 'Élelmiszerbolt', en: 'Grocery' } },
  { slug: 'pharmacy', emoji: '💊', color: '#388E3C', name: { uk: 'Аптеки', hu: 'Gyógyszertár', en: 'Pharmacy' } },
  { slug: 'beauty_salon', emoji: '💇', color: '#8E24AA', name: { uk: 'Салони краси', hu: 'Szépségszalon', en: 'Beauty salon' } },
  { slug: 'hotel', emoji: '🏨', color: '#283593', name: { uk: 'Готелі', hu: 'Szállodák', en: 'Hotels' } },
  { slug: 'other', emoji: '📍', color: '#757575', name: { uk: 'Інше', hu: 'Egyéb', en: 'Other' } },
];

const BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category {
  return BY_SLUG.get(slug as CategorySlug) ?? BY_SLUG.get('other')!;
}
