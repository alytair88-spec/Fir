import type { City } from '@/constants/cities';

// OpenStreetMap Nominatim. Usage policy: max 1 request/second and an identifying
// User-Agent; for production traffic switch to a self-hosted or paid geocoder.
const BASE_URL = 'https://nominatim.openstreetmap.org';
const HEADERS = { 'User-Agent': 'HungaryCityMap/1.0 (mobile app)', Accept: 'application/json' };

interface NominatimPlace {
  lat: string;
  lon: string;
  name: string;
  display_name: string;
  addresstype?: string;
  boundingbox?: [string, string, string, string];
}

const SETTLEMENT_TYPES = new Set(['city', 'town', 'village', 'municipality', 'hamlet', 'suburb', 'city_district']);

export async function searchCities(query: string, lang: string): Promise<City[]> {
  const params = new URLSearchParams({
    q: query,
    countrycodes: 'hu',
    format: 'jsonv2',
    limit: '15',
    'accept-language': lang,
  });
  const res = await fetch(`${BASE_URL}/search?${params}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const places = (await res.json()) as NominatimPlace[];
  const seen = new Set<string>();
  const cities: City[] = [];
  for (const p of places) {
    if (p.addresstype && !SETTLEMENT_TYPES.has(p.addresstype)) continue;
    const key = p.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    let span = 0.05;
    if (p.boundingbox) {
      const [south, north, west, east] = p.boundingbox.map(Number);
      span = Math.min(0.4, Math.max(0.02, north - south, east - west));
    }
    cities.push({ name: p.name, latitude: Number(p.lat), longitude: Number(p.lon), span });
  }
  return cities;
}

export async function geocodeAddress(
  address: string,
  city: string,
): Promise<{ latitude: number; longitude: number } | null> {
  const params = new URLSearchParams({
    q: `${address}, ${city}`,
    countrycodes: 'hu',
    format: 'jsonv2',
    limit: '1',
  });
  const res = await fetch(`${BASE_URL}/search?${params}`, { headers: HEADERS });
  if (!res.ok) return null;
  const places = (await res.json()) as NominatimPlace[];
  if (places.length === 0) return null;
  return { latitude: Number(places[0].lat), longitude: Number(places[0].lon) };
}
