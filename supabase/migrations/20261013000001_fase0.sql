-- Fase 0: waitlist + analitico proprio + copia local de cobertura (doc 04).
-- RLS: insert-only anonimo em waitlist e events; leitura apenas via service role.

create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  city_name text,
  city_territory_id text,
  source text not null default 'outro',
  confirmed_at timestamptz,
  confirm_token uuid not null default gen_random_uuid()
);
create unique index waitlist_email_lower_uidx on public.waitlist (lower(email));

create table public.events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('page_view', 'cta_click', 'city_check_covered', 'city_check_missing')),
  meta jsonb not null default '{}'::jsonb
);

-- Copia local da cobertura (sync semanal do /cities; leitura publica).
create table public.coverage_cities (
  territory_id text primary key,
  name text not null,
  uf text not null,
  level text not null,
  created_at timestamptz not null default now()
);
create index coverage_cities_name_trgm on public.coverage_cities using gin (to_tsvector('simple', name));

alter table public.waitlist enable row level security;
alter table public.events enable row level security;
alter table public.coverage_cities enable row level security;

-- waitlist: anon/insert only, ninguem le (padrao Dozena)
create policy waitlist_insert_anon on public.waitlist
  for insert to anon, authenticated with check (true);

-- events: insert-only
create policy events_insert_anon on public.events
  for insert to anon, authenticated with check (true);

-- cobertura e dado publico (ja consta na landing)
create policy coverage_read_all on public.coverage_cities
  for select to anon, authenticated using (true);
