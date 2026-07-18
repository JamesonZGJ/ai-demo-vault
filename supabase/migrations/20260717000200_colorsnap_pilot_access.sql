create table public.blueprint_runtime_flags (
  singleton boolean primary key default true,
  local_pilot_enabled boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint blueprint_runtime_flags_singleton check (singleton)
);

insert into public.blueprint_runtime_flags (singleton, local_pilot_enabled)
values (true, false)
on conflict (singleton) do nothing;

create table public.blueprint_resources (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  blueprint_id uuid not null references public.blueprints(id) on delete cascade,
  kind text not null,
  title text not null,
  summary text not null,
  content text[] not null,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  constraint blueprint_resources_kind_valid check (
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
  constraint blueprint_resources_text_present check (
    btrim(title) <> '' and btrim(summary) <> ''
  ),
  constraint blueprint_resources_content_present check (cardinality(content) > 0),
  constraint blueprint_resources_sort_positive check (sort_order > 0),
  unique (blueprint_id, kind),
  unique (blueprint_id, sort_order)
);

create table public.blueprint_access_grants (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  blueprint_id uuid not null references public.blueprints(id) on delete restrict,
  grant_kind text not null default 'pilot_preview',
  created_at timestamptz not null default now(),
  constraint blueprint_access_grants_kind_valid check (grant_kind = 'pilot_preview'),
  unique (user_id, blueprint_id)
);

create index blueprint_resources_blueprint_idx
on public.blueprint_resources (blueprint_id, sort_order);

create index blueprint_access_grants_user_idx
on public.blueprint_access_grants (user_id, created_at desc);

alter table public.blueprint_runtime_flags enable row level security;
alter table public.blueprint_resources enable row level security;
alter table public.blueprint_access_grants enable row level security;

create function public.is_blueprint_pilot_enabled()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (
      select flag.local_pilot_enabled
      from public.blueprint_runtime_flags as flag
      where flag.singleton
    ),
    false
  );
$$;

create function public.is_blueprint_pilot_visible(p_blueprint_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_blueprint_pilot_enabled()
    and exists (
      select 1
      from public.blueprints as blueprint
      where blueprint.id = p_blueprint_id
        and blueprint.status = 'rework_required'
        and blueprint.access_mode = 'pilot_preview'
        and blueprint.pricing_status = 'undecided'
    );
$$;

create function public.has_blueprint_pilot_access(p_blueprint_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and public.is_blueprint_pilot_visible(p_blueprint_id)
    and exists (
      select 1
      from public.blueprint_access_grants as access_grant
      where access_grant.user_id = auth.uid()
        and access_grant.blueprint_id = p_blueprint_id
        and access_grant.grant_kind = 'pilot_preview'
    );
$$;

create function public.claim_blueprint_pilot(p_blueprint_slug text)
returns uuid
language plpgsql
volatile
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  target_blueprint_id uuid;
  access_grant_id uuid;
begin
  if current_user_id is null then
    raise exception using errcode = '42501', message = '必须登录后才能获取 Blueprint 资料';
  end if;

  if not public.is_blueprint_pilot_enabled() then
    raise exception using errcode = '55000', message = 'Blueprint 本地试用未开启';
  end if;

  select blueprint.id
  into target_blueprint_id
  from public.blueprints as blueprint
  where blueprint.slug = pg_catalog.btrim(p_blueprint_slug)
    and blueprint.status = 'rework_required'
    and blueprint.access_mode = 'pilot_preview'
    and blueprint.pricing_status = 'undecided';

  if target_blueprint_id is null then
    raise exception using errcode = 'P0002', message = 'Blueprint 不存在或不可获取';
  end if;

  insert into public.blueprint_access_grants (user_id, blueprint_id, grant_kind)
  values (current_user_id, target_blueprint_id, 'pilot_preview')
  on conflict (user_id, blueprint_id) do update
  set grant_kind = excluded.grant_kind
  returning id into access_grant_id;

  return access_grant_id;
end;
$$;

create policy blueprints_pilot_read on public.blueprints
for select to anon, authenticated
using (public.is_blueprint_pilot_visible(id));

create policy blueprint_demo_links_pilot_read on public.blueprint_demo_links
for select to anon, authenticated
using (public.is_blueprint_pilot_visible(blueprint_id));

create policy blueprint_deliverables_pilot_read on public.blueprint_deliverables
for select to anon, authenticated
using (public.is_blueprint_pilot_visible(blueprint_id));

create policy blueprint_access_grants_owner_read on public.blueprint_access_grants
for select to authenticated
using (
  auth.uid() = user_id
  and public.is_blueprint_pilot_visible(blueprint_id)
);

create policy blueprint_resources_owner_read on public.blueprint_resources
for select to authenticated
using (public.has_blueprint_pilot_access(blueprint_id));

revoke all on public.blueprint_runtime_flags, public.blueprint_resources,
  public.blueprint_access_grants from anon, authenticated;

grant select on public.blueprints, public.blueprint_demo_links,
  public.blueprint_deliverables to anon, authenticated;
grant select on public.blueprint_resources, public.blueprint_access_grants
  to authenticated;

grant all on public.blueprint_runtime_flags, public.blueprint_resources,
  public.blueprint_access_grants to service_role;

revoke all on function public.is_blueprint_pilot_enabled() from public, anon, authenticated;
revoke all on function public.is_blueprint_pilot_visible(uuid) from public, anon, authenticated;
revoke all on function public.has_blueprint_pilot_access(uuid) from public, anon, authenticated;
revoke all on function public.claim_blueprint_pilot(text) from public, anon, authenticated;

grant execute on function public.is_blueprint_pilot_enabled()
  to anon, authenticated, service_role;
grant execute on function public.is_blueprint_pilot_visible(uuid)
  to anon, authenticated, service_role;
grant execute on function public.has_blueprint_pilot_access(uuid)
  to authenticated, service_role;
grant execute on function public.claim_blueprint_pilot(text)
  to authenticated, service_role;
