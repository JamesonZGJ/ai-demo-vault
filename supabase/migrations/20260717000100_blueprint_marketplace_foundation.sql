create table public.blueprints (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  blueprint_number integer not null unique,
  slug text not null unique,
  name text not null,
  tagline text not null,
  summary text not null,
  status text not null default 'draft',
  version text not null,
  pricing_status text not null default 'undecided',
  price_minor bigint,
  currency text,
  access_mode text not null default 'pilot_preview',
  origin_statement text not null,
  demo_facts jsonb not null,
  target_plan jsonb not null,
  product_overview text not null,
  target_users text not null,
  problem_statement text not null,
  solution_statement text not null,
  feature_map text not null,
  user_flow text not null,
  ui_screens text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blueprints_number_positive check (blueprint_number > 0),
  constraint blueprints_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint blueprints_text_present check (
    btrim(name) <> ''
    and btrim(tagline) <> ''
    and btrim(summary) <> ''
    and btrim(version) <> ''
    and btrim(origin_statement) <> ''
    and btrim(product_overview) <> ''
    and btrim(target_users) <> ''
    and btrim(problem_statement) <> ''
    and btrim(solution_statement) <> ''
    and btrim(feature_map) <> ''
    and btrim(user_flow) <> ''
    and btrim(ui_screens) <> ''
  ),
  constraint blueprints_status_valid check (
    status in ('draft', 'rework_required', 'sellable', 'withdrawn')
  ),
  constraint blueprints_pricing_status_valid check (
    pricing_status in ('undecided', 'approved', 'unavailable')
  ),
  constraint blueprints_access_mode_valid check (
    access_mode in ('pilot_preview', 'paid_single')
  ),
  constraint blueprints_pilot_state_consistent check (
    access_mode <> 'pilot_preview'
    or (status = 'rework_required' and pricing_status = 'undecided')
  ),
  constraint blueprints_sellable_state_consistent check (
    status <> 'sellable'
    or (access_mode = 'paid_single' and pricing_status = 'approved')
  ),
  constraint blueprints_price_consistent check (
    (
      pricing_status = 'approved'
      and price_minor is not null
      and price_minor > 0
      and currency ~ '^[A-Z]{3}$'
    )
    or (
      pricing_status <> 'approved'
      and price_minor is null
      and currency is null
    )
  ),
  constraint blueprints_demo_facts_object check (jsonb_typeof(demo_facts) = 'object'),
  constraint blueprints_target_plan_object check (jsonb_typeof(target_plan) = 'object')
);

create table public.blueprint_demo_links (
  blueprint_id uuid not null references public.blueprints(id) on delete cascade,
  demo_id uuid not null references public.demos(id) on delete restrict,
  relation_kind text not null,
  disclosure text not null,
  created_at timestamptz not null default now(),
  primary key (blueprint_id, demo_id),
  constraint blueprint_demo_links_kind_valid check (
    relation_kind in ('own_case', 'original_rebuild', 'licensed_derivative')
  ),
  constraint blueprint_demo_links_disclosure_present check (btrim(disclosure) <> '')
);

create table public.blueprint_deliverables (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  blueprint_id uuid not null references public.blueprints(id) on delete cascade,
  kind text not null,
  title text not null,
  summary text not null,
  format_label text not null,
  sample_status text not null default 'sample_ready',
  sort_order integer not null,
  created_at timestamptz not null default now(),
  constraint blueprint_deliverables_kind_valid check (
    kind in (
      'product_breakdown',
      'business_model',
      'ui_resources',
      'prd',
      'prompts',
      'technical_plan',
      'marketing_plan'
    )
  ),
  constraint blueprint_deliverables_text_present check (
    btrim(title) <> '' and btrim(summary) <> '' and btrim(format_label) <> ''
  ),
  constraint blueprint_deliverables_sample_status_valid check (
    sample_status in ('sample_ready', 'blocked')
  ),
  constraint blueprint_deliverables_sort_positive check (sort_order > 0),
  unique (blueprint_id, kind),
  unique (blueprint_id, sort_order)
);

create index blueprint_demo_links_demo_idx
on public.blueprint_demo_links (demo_id, blueprint_id);

create index blueprint_deliverables_blueprint_idx
on public.blueprint_deliverables (blueprint_id, sort_order);

create trigger blueprints_set_updated_at
before update on public.blueprints
for each row execute function public.set_updated_at();

alter table public.blueprints enable row level security;
alter table public.blueprint_demo_links enable row level security;
alter table public.blueprint_deliverables enable row level security;

revoke all on public.blueprints, public.blueprint_demo_links,
  public.blueprint_deliverables from anon, authenticated;

grant all on public.blueprints, public.blueprint_demo_links,
  public.blueprint_deliverables to service_role;
