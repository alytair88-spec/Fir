import type { Business } from './types';

// Shown only when Supabase is not configured, so the map can be tried out immediately.
// Mirrors supabase/seed.sql.
const raw: Omit<Business, 'id' | 'owner_id' | 'is_published' | 'created_at' | 'updated_at' | 'email'>[] = [
  { name: 'Gumi Pont', category: 'tire_service', description: 'Шиномонтаж і зберігання шин', city: 'Budapest', address: 'Váci út 45, Budapest', latitude: 47.5235, longitude: 19.0625, phone: '+36 1 555 0101', website: null, opening_hours: 'H–P 8:00–18:00, Szo 8:00–13:00' },
  { name: 'AutoFix Szerviz', category: 'car_service', description: 'Ремонт і діагностика авто', city: 'Budapest', address: 'Kerepesi út 20, Budapest', latitude: 47.4989, longitude: 19.095, phone: '+36 1 555 0102', website: null, opening_hours: 'H–P 7:30–17:00' },
  { name: 'Kormány Autósiskola', category: 'driving_school', description: 'Курси водіння категорій A, B', city: 'Budapest', address: 'Rákóczi út 12, Budapest', latitude: 47.4965, longitude: 19.064, phone: '+36 1 555 0103', website: null, opening_hours: 'H–P 9:00–18:00' },
  { name: 'Mosoly Fogászat', category: 'dentist', description: 'Стоматологічна клініка', city: 'Budapest', address: 'Andrássy út 60, Budapest', latitude: 47.506, longitude: 19.065, phone: '+36 1 555 0104', website: null, opening_hours: 'H–P 8:00–20:00' },
  { name: 'Erő Fitness', category: 'fitness', description: 'Тренажерний зал та групові заняття', city: 'Budapest', address: 'Margit körút 5, Budapest', latitude: 47.512, longitude: 19.044, phone: '+36 1 555 0105', website: null, opening_hours: 'Minden nap 6:00–22:00' },
  { name: 'Cipő Világ', category: 'shoe_store', description: 'Взуття для всієї сім’ї', city: 'Budapest', address: 'Váci utca 10, Budapest', latitude: 47.4935, longitude: 19.0525, phone: null, website: null, opening_hours: 'H–Szo 10:00–20:00' },
  { name: 'Divat Ház', category: 'clothing_store', description: 'Одяг та аксесуари', city: 'Budapest', address: 'Király utca 30, Budapest', latitude: 47.4995, longitude: 19.06, phone: null, website: null, opening_hours: 'H–Szo 10:00–20:00' },
  { name: 'Romkocsma Bar', category: 'bar', description: 'Знаменитий руїн-бар', city: 'Budapest', address: 'Kazinczy utca 14, Budapest', latitude: 47.497, longitude: 19.0635, phone: null, website: null, opening_hours: 'Minden nap 12:00–04:00' },
  { name: 'Gulyás Étterem', category: 'restaurant', description: 'Традиційна угорська кухня', city: 'Budapest', address: 'Dob utca 5, Budapest', latitude: 47.4975, longitude: 19.057, phone: '+36 1 555 0109', website: null, opening_hours: 'Minden nap 11:00–23:00' },
  { name: 'Debreceni Gumiszerviz', category: 'tire_service', description: null, city: 'Debrecen', address: 'Füredi út 50, Debrecen', latitude: 47.545, longitude: 21.646, phone: '+36 52 555 010', website: null, opening_hours: 'H–P 8:00–17:00' },
  { name: 'Nagyerdő Étterem', category: 'restaurant', description: null, city: 'Debrecen', address: 'Pallagi út 5, Debrecen', latitude: 47.555, longitude: 21.625, phone: null, website: null, opening_hours: 'Minden nap 11:00–22:00' },
  { name: 'Tisza Fogászat', category: 'dentist', description: null, city: 'Szeged', address: 'Kárász utca 8, Szeged', latitude: 46.253, longitude: 20.148, phone: '+36 62 555 010', website: null, opening_hours: 'H–P 8:00–19:00' },
];

export const DEMO_BUSINESSES: Business[] = raw.map((b, i) => ({
  ...b,
  id: `demo-${i + 1}`,
  owner_id: null,
  email: null,
  is_published: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}));
