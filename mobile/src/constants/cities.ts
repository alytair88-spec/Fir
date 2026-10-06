export interface City {
  name: string;
  latitude: number;
  longitude: number;
  // Map span in degrees used to frame the city and to bound list searches.
  span: number;
}

// Popular cities shown instantly; any other settlement is found via geocoding.
export const POPULAR_CITIES: City[] = [
  { name: 'Budapest', latitude: 47.4979, longitude: 19.0402, span: 0.3 },
  { name: 'Debrecen', latitude: 47.5316, longitude: 21.6273, span: 0.12 },
  { name: 'Szeged', latitude: 46.253, longitude: 20.1414, span: 0.12 },
  { name: 'Miskolc', latitude: 48.1035, longitude: 20.7784, span: 0.12 },
  { name: 'Pécs', latitude: 46.0727, longitude: 18.2323, span: 0.1 },
  { name: 'Győr', latitude: 47.6875, longitude: 17.6504, span: 0.1 },
  { name: 'Nyíregyháza', latitude: 47.9554, longitude: 21.7167, span: 0.1 },
  { name: 'Kecskemét', latitude: 46.8964, longitude: 19.6897, span: 0.1 },
  { name: 'Székesfehérvár', latitude: 47.186, longitude: 18.4221, span: 0.1 },
  { name: 'Szombathely', latitude: 47.2307, longitude: 16.6218, span: 0.08 },
  { name: 'Szolnok', latitude: 47.1621, longitude: 20.1825, span: 0.08 },
  { name: 'Tatabánya', latitude: 47.5692, longitude: 18.4048, span: 0.08 },
  { name: 'Kaposvár', latitude: 46.3594, longitude: 17.7968, span: 0.08 },
  { name: 'Érd', latitude: 47.3919, longitude: 18.904, span: 0.08 },
  { name: 'Veszprém', latitude: 47.0933, longitude: 17.9115, span: 0.08 },
  { name: 'Békéscsaba', latitude: 46.6736, longitude: 21.0877, span: 0.08 },
  { name: 'Zalaegerszeg', latitude: 46.8417, longitude: 16.8416, span: 0.08 },
  { name: 'Sopron', latitude: 47.6817, longitude: 16.5845, span: 0.08 },
  { name: 'Eger', latitude: 47.9025, longitude: 20.3772, span: 0.08 },
  { name: 'Nagykanizsa', latitude: 46.4535, longitude: 16.9912, span: 0.07 },
  { name: 'Dunaújváros', latitude: 46.9619, longitude: 18.9355, span: 0.07 },
  { name: 'Hódmezővásárhely', latitude: 46.4181, longitude: 20.3302, span: 0.07 },
  { name: 'Szigetszentmiklós', latitude: 47.3442, longitude: 19.0469, span: 0.06 },
  { name: 'Cegléd', latitude: 47.1726, longitude: 19.7995, span: 0.06 },
  { name: 'Baja', latitude: 46.1804, longitude: 18.9548, span: 0.06 },
  { name: 'Salgótarján', latitude: 48.0984, longitude: 19.8031, span: 0.06 },
  { name: 'Vác', latitude: 47.7756, longitude: 19.1361, span: 0.06 },
  { name: 'Gödöllő', latitude: 47.5966, longitude: 19.3552, span: 0.06 },
  { name: 'Ózd', latitude: 48.2193, longitude: 20.2899, span: 0.06 },
  { name: 'Szekszárd', latitude: 46.3474, longitude: 18.7062, span: 0.06 },
  { name: 'Mosonmagyaróvár', latitude: 47.8682, longitude: 17.2689, span: 0.06 },
  { name: 'Pápa', latitude: 47.3304, longitude: 17.4673, span: 0.06 },
  { name: 'Gyöngyös', latitude: 47.7826, longitude: 19.928, span: 0.06 },
  { name: 'Hajdúböszörmény', latitude: 47.6714, longitude: 21.5105, span: 0.06 },
  { name: 'Kiskunfélegyháza', latitude: 46.7121, longitude: 19.8443, span: 0.06 },
  { name: 'Jászberény', latitude: 47.4999, longitude: 19.9119, span: 0.06 },
  { name: 'Budaörs', latitude: 47.4614, longitude: 18.9584, span: 0.05 },
  { name: 'Orosháza', latitude: 46.5653, longitude: 20.6671, span: 0.05 },
  { name: 'Esztergom', latitude: 47.7856, longitude: 18.7403, span: 0.05 },
  { name: 'Szentendre', latitude: 47.6694, longitude: 19.0757, span: 0.05 },
  { name: 'Siófok', latitude: 46.9042, longitude: 18.058, span: 0.06 },
  { name: 'Keszthely', latitude: 46.7681, longitude: 17.2432, span: 0.05 },
  { name: 'Balatonfüred', latitude: 46.9575, longitude: 17.8916, span: 0.05 },
  { name: 'Hévíz', latitude: 46.7903, longitude: 17.1841, span: 0.04 },
  { name: 'Mátészalka', latitude: 47.9553, longitude: 22.3236, span: 0.05 },
  { name: 'Kisvárda', latitude: 48.2233, longitude: 22.0786, span: 0.05 },
  { name: 'Záhony', latitude: 48.4086, longitude: 22.1758, span: 0.04 },
  { name: 'Tokaj', latitude: 48.1172, longitude: 21.4089, span: 0.04 },
];

export const DEFAULT_CITY = POPULAR_CITIES[0];

// Bounding box of Hungary, mirrored by the latitude/longitude checks in SQL.
export const HUNGARY_BOUNDS = { minLat: 45.7, maxLat: 48.6, minLng: 16.1, maxLng: 22.9 };

export function isInHungary(latitude: number, longitude: number): boolean {
  return (
    latitude >= HUNGARY_BOUNDS.minLat &&
    latitude <= HUNGARY_BOUNDS.maxLat &&
    longitude >= HUNGARY_BOUNDS.minLng &&
    longitude <= HUNGARY_BOUNDS.maxLng
  );
}
