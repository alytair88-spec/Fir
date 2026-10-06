-- Hungary city map: businesses and service providers.
-- Run in Supabase SQL editor or via `supabase db push`.

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  slug text primary key,
  sort_order int not null default 0
);

insert into public.categories (slug, sort_order) values
  ('tire_service', 10),
  ('car_service', 20),
  ('driving_school', 30),
  ('dentist', 40),
  ('fitness', 50),
  ('shoe_store', 60),
  ('clothing_store', 70),
  ('bar', 80),
  ('restaurant', 90),
  ('cafe', 100),
  ('grocery', 110),
  ('pharmacy', 120),
  ('beauty_salon', 130),
  ('hotel', 140),
  ('other', 1000)
on conflict (slug) do nothing;

alter table public.categories enable row level security;

drop policy if exists "categories are public" on public.categories;
create policy "categories are public"
  on public.categories for select
  using (true);

-- ---------------------------------------------------------------------------
-- Businesses
-- ---------------------------------------------------------------------------
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  -- Null only for seeded demo records; every record created from the app has an owner.
  owner_id uuid references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  category text not null references public.categories (slug),
  description text check (char_length(description) <= 2000),
  city text not null check (char_length(city) between 1 and 80),
  address text not null check (char_length(address) between 3 and 200),
  latitude double precision not null check (latitude between 45.7 and 48.6),
  longitude double precision not null check (longitude between 16.1 and 22.9),
  phone text check (char_length(phone) <= 40),
  email text check (char_length(email) <= 120),
  website text check (char_length(website) <= 200),
  opening_hours text check (char_length(opening_hours) <= 500),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_location_idx
  on public.businesses (latitude, longitude);
create index if not exists businesses_category_idx
  on public.businesses (category);
create index if not exists businesses_owner_idx
  on public.businesses (owner_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at
  before update on public.businesses
  for each row execute function public.set_updated_at();

alter table public.businesses enable row level security;

-- Anyone (including guests without an account) can see published businesses;
-- owners can also see their own unpublished drafts.
drop policy if exists "published businesses are public" on public.businesses;
create policy "published businesses are public"
  on public.businesses for select
  using (is_published or owner_id = auth.uid());

drop policy if exists "owners create their businesses" on public.businesses;
create policy "owners create their businesses"
  on public.businesses for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "owners update their businesses" on public.businesses;
create policy "owners update their businesses"
  on public.businesses for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "owners delete their businesses" on public.businesses;
create policy "owners delete their businesses"
  on public.businesses for delete
  to authenticated
  using (owner_id = auth.uid());
