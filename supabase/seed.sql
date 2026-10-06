-- Optional demo data so the map is not empty right after setup.
-- These records have no owner and cannot be edited from the app.
insert into public.businesses
  (name, category, description, city, address, latitude, longitude, phone, website, opening_hours)
values
  ('Gumi Pont', 'tire_service', 'Шиномонтаж і зберігання шин', 'Budapest', 'Váci út 45, Budapest', 47.5235, 19.0625, '+36 1 555 0101', null, 'H–P 8:00–18:00, Szo 8:00–13:00'),
  ('AutoFix Szerviz', 'car_service', 'Ремонт і діагностика авто', 'Budapest', 'Kerepesi út 20, Budapest', 47.4989, 19.0950, '+36 1 555 0102', null, 'H–P 7:30–17:00'),
  ('Kormány Autósiskola', 'driving_school', 'Курси водіння категорій A, B', 'Budapest', 'Rákóczi út 12, Budapest', 47.4965, 19.0640, '+36 1 555 0103', null, 'H–P 9:00–18:00'),
  ('Mosoly Fogászat', 'dentist', 'Стоматологічна клініка', 'Budapest', 'Andrássy út 60, Budapest', 47.5060, 19.0650, '+36 1 555 0104', null, 'H–P 8:00–20:00'),
  ('Erő Fitness', 'fitness', 'Тренажерний зал та групові заняття', 'Budapest', 'Margit körút 5, Budapest', 47.5120, 19.0440, '+36 1 555 0105', null, 'Minden nap 6:00–22:00'),
  ('Cipő Világ', 'shoe_store', 'Взуття для всієї сім''ї', 'Budapest', 'Váci utca 10, Budapest', 47.4935, 19.0525, null, null, 'H–Szo 10:00–20:00'),
  ('Divat Ház', 'clothing_store', 'Одяг та аксесуари', 'Budapest', 'Király utca 30, Budapest', 47.4995, 19.0600, null, null, 'H–Szo 10:00–20:00'),
  ('Romkocsma Bar', 'bar', 'Знаменитий руїн-бар', 'Budapest', 'Kazinczy utca 14, Budapest', 47.4970, 19.0635, null, null, 'Minden nap 12:00–04:00'),
  ('Gulyás Étterem', 'restaurant', 'Традиційна угорська кухня', 'Budapest', 'Dob utca 5, Budapest', 47.4975, 19.0570, '+36 1 555 0109', null, 'Minden nap 11:00–23:00'),
  ('Debreceni Gumiszerviz', 'tire_service', null, 'Debrecen', 'Füredi út 50, Debrecen', 47.5450, 21.6460, '+36 52 555 010', null, 'H–P 8:00–17:00'),
  ('Nagyerdő Étterem', 'restaurant', null, 'Debrecen', 'Pallagi út 5, Debrecen', 47.5550, 21.6250, null, null, 'Minden nap 11:00–22:00'),
  ('Tisza Fogászat', 'dentist', null, 'Szeged', 'Kárász utca 8, Szeged', 46.2530, 20.1480, '+36 62 555 010', null, 'H–P 8:00–19:00');
