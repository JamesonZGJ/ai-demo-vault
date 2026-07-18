create extension if not exists pgcrypto with schema extensions;

create table public.categories (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  slug text not null unique,
  name_zh text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint categories_name_present check (btrim(name_zh) <> '')
);

create table public.tools (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  slug text not null unique,
  name text not null,
  official_url text not null,
  created_at timestamptz not null default now(),
  constraint tools_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint tools_name_present check (btrim(name) <> ''),
  constraint tools_official_url_https check (official_url ~ '^https://')
);

create table public.demos (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text not null,
  summary text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  status text not null default 'draft',
  case_kind text not null,
  maturity text not null,
  publisher_region text not null default 'unknown',
  technology_disclosure text not null default 'not_disclosed',
  source_code_status text not null default 'not_disclosed',
  difficulty text not null,
  pain_points text,
  solution text,
  why_it_works text,
  target_users text,
  core_features text[],
  ai_implementation text,
  technical_implementation text,
  monetization text,
  truth_boundary jsonb,
  adapt_change_who text,
  adapt_change_what text,
  adapt_change_context text,
  adapt_new_opportunity text,
  primary_source_type text,
  primary_source_platform text,
  primary_source_url text,
  primary_source_verified_at timestamptz,
  cover_path text,
  cover_alt text,
  cover_rights_holder text,
  cover_license text,
  cover_origin_kind text,
  cover_authorization_status text not null default 'pending',
  commercial_potential_score smallint,
  commercial_potential_rationale text,
  commercial_potential_evidence text,
  commercial_potential_rule_version text,
  commercial_potential_verified_at timestamptz,
  content_fingerprint text,
  collected_on date,
  published_at timestamptz,
  featured boolean not null default false,
  editor_pick_rank integer,
  favorites_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint demos_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint demos_identity_present check (
    btrim(name) <> '' and btrim(tagline) <> '' and btrim(summary) <> ''
  ),
  constraint demos_status_valid check (status in ('draft', 'published', 'archived')),
  constraint demos_case_kind_valid check (
    case_kind in (
      'product',
      'open_source_project',
      'model_demo',
      'official_template',
      'platform_workflow',
      'embedded_feature'
    )
  ),
  constraint demos_maturity_valid check (
    maturity in ('concept', 'interactive_prototype', 'working_demo', 'production_product')
  ),
  constraint demos_publisher_region_valid check (
    publisher_region in ('mainland_china', 'international', 'mixed', 'unknown')
  ),
  constraint demos_technology_disclosure_valid check (
    technology_disclosure in ('verified', 'partially_disclosed', 'not_disclosed')
  ),
  constraint demos_source_code_status_valid check (
    source_code_status in ('open_source', 'closed_source', 'not_disclosed')
  ),
  constraint demos_difficulty_valid check (difficulty in ('beginner', 'intermediate', 'advanced')),
  constraint demos_primary_source_type_valid check (
    primary_source_type is null or primary_source_type in (
      'official_site',
      'official_docs',
      'official_repository',
      'official_help_center',
      'official_model_page',
      'official_legal_page'
    )
  ),
  constraint demos_cover_origin_kind_valid check (
    cover_origin_kind is null or cover_origin_kind in ('original', 'licensed', 'permission')
  ),
  constraint demos_cover_authorization_status_valid check (
    cover_authorization_status in ('pending', 'approved', 'rejected')
  ),
  constraint demos_commercial_potential_range check (
    commercial_potential_score is null or commercial_potential_score between 1 and 5
  ),
  constraint demos_content_fingerprint_md5 check (
    content_fingerprint is null or content_fingerprint ~ '^[0-9a-f]{32}$'
  ),
  constraint demos_editor_pick_rank_positive check (editor_pick_rank is null or editor_pick_rank > 0),
  constraint demos_favorites_count_nonnegative check (favorites_count >= 0),
  constraint demos_published_content_complete check (
    status <> 'published' or (
      publisher_region <> 'unknown'
      and source_code_status <> 'not_disclosed'
      and primary_source_type is not null
      and primary_source_platform is not null and btrim(primary_source_platform) <> ''
      and primary_source_url ~ '^https://'
      and primary_source_verified_at is not null
      and cover_path is not null and (cover_path like '/%' or cover_path ~ '^https://')
      and cover_alt is not null and btrim(cover_alt) <> ''
      and cover_rights_holder is not null and btrim(cover_rights_holder) <> ''
      and cover_license is not null and btrim(cover_license) <> ''
      and cover_origin_kind is not null
      and cover_authorization_status = 'approved'
      and commercial_potential_score between 1 and 5
      and commercial_potential_rationale is not null and btrim(commercial_potential_rationale) <> ''
      and commercial_potential_evidence is not null and btrim(commercial_potential_evidence) <> ''
      and commercial_potential_rule_version is not null and btrim(commercial_potential_rule_version) <> ''
      and commercial_potential_verified_at is not null
      and content_fingerprint is not null
      and collected_on is not null
      and published_at is not null
      and pain_points is not null and btrim(pain_points) <> ''
      and solution is not null and btrim(solution) <> ''
      and why_it_works is not null and btrim(why_it_works) <> ''
      and target_users is not null and btrim(target_users) <> ''
      and core_features is not null and cardinality(core_features) > 0
      and ai_implementation is not null and btrim(ai_implementation) <> ''
      and technical_implementation is not null and btrim(technical_implementation) <> ''
      and monetization is not null and btrim(monetization) <> ''
      and truth_boundary is not null
      and jsonb_typeof(truth_boundary) = 'object'
      and jsonb_typeof(truth_boundary -> 'implemented') = 'array'
      and jsonb_typeof(truth_boundary -> 'simulated') = 'array'
      and jsonb_typeof(truth_boundary -> 'not_implemented') = 'array'
      and (
        jsonb_array_length(truth_boundary -> 'implemented')
        + jsonb_array_length(truth_boundary -> 'simulated')
        + jsonb_array_length(truth_boundary -> 'not_implemented')
      ) > 0
      and adapt_change_who is not null and btrim(adapt_change_who) <> ''
      and adapt_change_what is not null and btrim(adapt_change_what) <> ''
      and adapt_change_context is not null and btrim(adapt_change_context) <> ''
      and adapt_new_opportunity is not null and btrim(adapt_new_opportunity) <> ''
    ) is true
  )
);

create table public.demo_tools (
  demo_id uuid not null references public.demos(id) on delete cascade,
  tool_id uuid not null references public.tools(id) on delete restrict,
  verified_at timestamptz not null,
  source_url text not null,
  primary key (demo_id, tool_id),
  constraint demo_tools_source_url_https check (source_url ~ '^https://')
);

create table public.demo_publishers (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  demo_id uuid not null references public.demos(id) on delete cascade,
  name text not null,
  region text not null,
  role text not null,
  official_evidence_url text not null,
  verified_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint demo_publishers_name_present check (btrim(name) <> ''),
  constraint demo_publishers_region_valid check (region in ('mainland_china', 'international')),
  constraint demo_publishers_role_valid check (role in ('developer', 'service_operator', 'contracting_entity')),
  constraint demo_publishers_evidence_https check (official_evidence_url ~ '^https://'),
  unique (demo_id, name, role)
);

create table public.demo_links (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  demo_id uuid not null references public.demos(id) on delete cascade,
  link_type text not null,
  label text not null,
  url text not null,
  source_platform text not null,
  is_canonical boolean not null default false,
  source_is_mirror boolean not null default false,
  canonical_url text,
  last_verified_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint demo_links_type_valid check (
    link_type in ('online_demo', 'repository', 'documentation', 'pricing', 'primary_source', 'other')
  ),
  constraint demo_links_label_present check (btrim(label) <> ''),
  constraint demo_links_url_https check (url ~ '^https://'),
  constraint demo_links_platform_present check (btrim(source_platform) <> ''),
  constraint demo_links_mirror_has_canonical check (
    not source_is_mirror or (canonical_url is not null and canonical_url ~ '^https://' and canonical_url <> url)
  ),
  constraint demo_links_mirror_not_canonical check (not (source_is_mirror and is_canonical)),
  constraint demo_links_nonmirror_canonical_consistent check (
    source_is_mirror or canonical_url is null
  ),
  unique (demo_id, url)
);

create table public.demo_claims (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  demo_id uuid not null references public.demos(id) on delete cascade,
  section text not null,
  claim_type text not null,
  content text not null,
  source_url text,
  verified_at timestamptz,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  constraint demo_claims_section_present check (btrim(section) <> ''),
  constraint demo_claims_section_valid check (
    section in (
      'product_overview',
      'why_it_works',
      'pain_points',
      'solution',
      'target_users',
      'core_features',
      'ai_implementation',
      'technical_implementation',
      'monetization',
      'truth_boundary',
      'adaptation',
      'other'
    )
  ),
  constraint demo_claims_type_valid check (claim_type in ('fact', 'editorial_inference', 'hypothesis')),
  constraint demo_claims_content_present check (btrim(content) <> ''),
  constraint demo_claims_source_https check (source_url is null or source_url ~ '^https://'),
  constraint demo_claims_fact_has_source check (
    claim_type <> 'fact' or (source_url is not null and verified_at is not null)
  ),
  unique (demo_id, section, claim_type, content)
);

create table public.demo_media (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  demo_id uuid not null references public.demos(id) on delete cascade,
  role text not null,
  storage_path text not null,
  media_type text not null,
  alt_text text not null,
  rights_holder text not null,
  license_terms text not null,
  permission_basis text,
  authorization_status text not null default 'pending',
  source_url text,
  content_hash text not null,
  is_original boolean not null default false,
  captured_by_site boolean not null default false,
  explicit_permission boolean not null default false,
  is_abstract boolean not null default false,
  static_poster_path text,
  static_poster_hash text,
  has_narration boolean not null default false,
  captions_path text,
  text_summary text,
  is_muted_by_default boolean not null default true,
  allows_pause boolean not null default true,
  created_at timestamptz not null default now(),
  constraint demo_media_role_valid check (role in ('cover', 'product_preview', 'gallery')),
  constraint demo_media_storage_path_valid check (storage_path like '/%' or storage_path ~ '^https://'),
  constraint demo_media_type_valid check (media_type in ('image', 'gif', 'video')),
  constraint demo_media_authorization_status_valid check (
    authorization_status in ('pending', 'approved', 'rejected')
  ),
  constraint demo_media_permission_basis_present check (
    permission_basis is null or btrim(permission_basis) <> ''
  ),
  constraint demo_media_source_https check (source_url is null or source_url ~ '^https://'),
  constraint demo_media_hash_sha256 check (content_hash ~ '^[0-9a-f]{64}$'),
  constraint demo_media_poster_hash_sha256 check (
    static_poster_hash is null or static_poster_hash ~ '^[0-9a-f]{64}$'
  ),
  constraint demo_media_approved_metadata_complete check (
    authorization_status <> 'approved' or (
      btrim(alt_text) <> ''
      and btrim(rights_holder) <> ''
      and btrim(license_terms) <> ''
      and (is_original or source_url is not null)
    ) is true
  ),
  constraint demo_media_product_preview_rights check (
    role <> 'product_preview' or authorization_status <> 'approved' or (
      not is_abstract
      and source_url is not null
      and permission_basis is not null
      and btrim(permission_basis) <> ''
      and (captured_by_site or explicit_permission)
    )
  ),
  constraint demo_media_gif_has_poster check (
    media_type <> 'gif' or authorization_status <> 'approved' or (
      static_poster_path is not null
      and (static_poster_path like '/%' or static_poster_path ~ '^https://')
      and static_poster_hash is not null
    )
  ),
  constraint demo_media_video_accessible check (
    media_type <> 'video' or authorization_status <> 'approved' or (
      is_muted_by_default
      and allows_pause
      and (not has_narration or captions_path is not null or (text_summary is not null and btrim(text_summary) <> ''))
    )
  ),
  unique (demo_id, role, storage_path)
);

create table public.demo_evidence (
  id uuid primary key default pg_catalog.gen_random_uuid(),
  demo_id uuid not null references public.demos(id) on delete cascade,
  evidence_type text not null,
  description text not null,
  source_url text not null,
  verified_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint demo_evidence_type_valid check (
    evidence_type in ('open_source', 'public_adoption', 'public_pricing', 'commercial_service')
  ),
  constraint demo_evidence_description_present check (btrim(description) <> ''),
  constraint demo_evidence_source_https check (source_url ~ '^https://'),
  unique (demo_id, evidence_type, source_url)
);

create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  demo_id uuid not null references public.demos(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, demo_id)
);

create index demos_public_newest_idx on public.demos (published_at desc, slug) where status = 'published';
create index demos_category_idx on public.demos (category_id, status);
create index demos_difficulty_region_idx on public.demos (difficulty, publisher_region, status);
create index demos_commercial_idx on public.demos (commercial_potential_score desc, published_at desc) where status = 'published';
create index demos_favorites_idx on public.demos (favorites_count desc, published_at desc) where status = 'published';
create index demos_editor_pick_idx on public.demos (editor_pick_rank, published_at desc) where status = 'published';
create index demo_tools_tool_idx on public.demo_tools (tool_id, demo_id);
create index demo_publishers_demo_idx on public.demo_publishers (demo_id);
create index demo_links_demo_idx on public.demo_links (demo_id, link_type);
create index demo_claims_demo_idx on public.demo_claims (demo_id, claim_type);
create unique index demo_claims_one_primary_per_section_idx
on public.demo_claims (demo_id, section)
where is_primary;
create index demo_media_demo_idx on public.demo_media (demo_id, role, authorization_status);
create index demo_evidence_demo_idx on public.demo_evidence (demo_id, evidence_type);
create index favorites_demo_idx on public.favorites (demo_id);

create function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

create trigger demos_set_updated_at
before update of
  slug,
  name,
  tagline,
  summary,
  category_id,
  status,
  case_kind,
  maturity,
  publisher_region,
  technology_disclosure,
  source_code_status,
  difficulty,
  pain_points,
  solution,
  why_it_works,
  target_users,
  core_features,
  ai_implementation,
  technical_implementation,
  monetization,
  truth_boundary,
  adapt_change_who,
  adapt_change_what,
  adapt_change_context,
  adapt_new_opportunity,
  primary_source_type,
  primary_source_platform,
  primary_source_url,
  primary_source_verified_at,
  cover_path,
  cover_alt,
  cover_rights_holder,
  cover_license,
  cover_origin_kind,
  cover_authorization_status,
  commercial_potential_score,
  commercial_potential_rationale,
  commercial_potential_evidence,
  commercial_potential_rule_version,
  commercial_potential_verified_at,
  content_fingerprint,
  collected_on,
  published_at,
  featured,
  editor_pick_rank
on public.demos
for each row execute function public.set_updated_at();

create function public.has_complete_primary_claims(p_demo_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select pg_catalog.count(*) = 11
  from public.demo_claims as claim
  where claim.demo_id = p_demo_id
    and claim.is_primary
    and claim.section in (
      'product_overview',
      'why_it_works',
      'pain_points',
      'solution',
      'target_users',
      'core_features',
      'ai_implementation',
      'technical_implementation',
      'monetization',
      'truth_boundary',
      'adaptation'
    );
$$;

create function public.has_consistent_source_code_status(p_demo_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.demos as d
    where d.id = p_demo_id
      and (
        (
          d.source_code_status = 'open_source'
          and exists (
            select 1
            from public.demo_links as link
            join public.demo_evidence as evidence
              on evidence.demo_id = link.demo_id
             and evidence.evidence_type = 'open_source'
             and evidence.source_url = link.url
            where link.demo_id = d.id
              and link.link_type = 'repository'
              and link.is_canonical
              and not link.source_is_mirror
          )
        )
        or (
          d.source_code_status = 'closed_source'
          and not exists (
            select 1
            from public.demo_links as link
            where link.demo_id = d.id
              and link.link_type = 'repository'
          )
          and not exists (
            select 1
            from public.demo_evidence as evidence
            where evidence.demo_id = d.id
              and evidence.evidence_type = 'open_source'
          )
        )
      )
  );
$$;

-- 所有会影响发布门禁的子表写入都先锁定父案例。
-- 这样并发事务不能分别删除“最后一条”依赖后又各自在旧快照中通过延迟检查。
create function public.lock_demo_for_catalog_invariant()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_demo_ids uuid[];
begin
  if tg_op = 'INSERT' then
    affected_demo_ids := array[new.demo_id];
  elsif tg_op = 'DELETE' then
    affected_demo_ids := array[old.demo_id];
  else
    affected_demo_ids := array[new.demo_id, old.demo_id];
  end if;

  perform 1
  from public.demos as demo
  where demo.id = any(affected_demo_ids)
  order by demo.id
  for update;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create trigger demo_media_lock_catalog_invariant
before insert or update or delete on public.demo_media
for each row execute function public.lock_demo_for_catalog_invariant();

create trigger demo_publishers_lock_catalog_invariant
before insert or update or delete on public.demo_publishers
for each row execute function public.lock_demo_for_catalog_invariant();

create trigger demo_claims_lock_catalog_invariant
before insert or update or delete on public.demo_claims
for each row execute function public.lock_demo_for_catalog_invariant();

create trigger demo_links_lock_catalog_invariant
before insert or update or delete on public.demo_links
for each row execute function public.lock_demo_for_catalog_invariant();

create trigger demo_evidence_lock_catalog_invariant
before insert or update or delete on public.demo_evidence
for each row execute function public.lock_demo_for_catalog_invariant();

create function public.is_demo_public(p_demo_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.demos as d
    where d.id = p_demo_id
      and d.status = 'published'
      and (
        (
          d.publisher_region in ('mainland_china', 'international')
          and exists (
            select 1
            from public.demo_publishers as publisher
            where publisher.demo_id = d.id
              and publisher.region = d.publisher_region
          )
        )
        or (
          d.publisher_region = 'mixed'
          and exists (
            select 1
            from public.demo_publishers as mainland_publisher
            where mainland_publisher.demo_id = d.id
              and mainland_publisher.region = 'mainland_china'
          )
          and exists (
            select 1
            from public.demo_publishers as international_publisher
            where international_publisher.demo_id = d.id
              and international_publisher.region = 'international'
          )
        )
      )
      and exists (
        select 1
        from public.demo_media as media
        where media.demo_id = d.id
          and media.role = 'product_preview'
          and media.authorization_status = 'approved'
          and media.media_type in ('image', 'gif', 'video')
          and not media.is_abstract
          and (media.captured_by_site or media.explicit_permission)
      )
      and public.has_complete_primary_claims(d.id)
      and public.has_consistent_source_code_status(d.id)
  );
$$;

create function public.enforce_published_demo_product_preview()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_demo_id uuid;
  affected_demo_ids uuid[];
begin
  if tg_table_name = 'demos' then
    affected_demo_ids := array[new.id];
  elsif tg_op = 'INSERT' then
    affected_demo_ids := array[new.demo_id];
  elsif tg_op = 'DELETE' then
    affected_demo_ids := array[old.demo_id];
  else
    affected_demo_ids := array[new.demo_id, old.demo_id];
  end if;

  foreach affected_demo_id in array affected_demo_ids loop
    if exists (
      select 1
      from public.demos as d
      where d.id = affected_demo_id
        and d.status = 'published'
    ) and not exists (
      select 1
      from public.demo_media as media
      where media.demo_id = affected_demo_id
        and media.role = 'product_preview'
        and media.authorization_status = 'approved'
        and media.media_type in ('image', 'gif', 'video')
        and not media.is_abstract
        and (media.captured_by_site or media.explicit_permission)
    ) then
      raise exception using
        errcode = '23514',
        message = '已发布案例必须保留至少一份获准使用的真实产品展示媒体';
    end if;
  end loop;

  return null;
end;
$$;

create constraint trigger demos_require_product_preview
after insert or update on public.demos
deferrable initially deferred
for each row execute function public.enforce_published_demo_product_preview();

create constraint trigger demo_media_preserve_product_preview
after insert or update or delete on public.demo_media
deferrable initially deferred
for each row execute function public.enforce_published_demo_product_preview();

create function public.enforce_published_demo_publisher()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_demo_id uuid;
  affected_demo_ids uuid[];
begin
  if tg_table_name = 'demos' then
    affected_demo_ids := array[new.id];
  elsif tg_op = 'INSERT' then
    affected_demo_ids := array[new.demo_id];
  elsif tg_op = 'DELETE' then
    affected_demo_ids := array[old.demo_id];
  else
    affected_demo_ids := array[new.demo_id, old.demo_id];
  end if;

  foreach affected_demo_id in array affected_demo_ids loop
    if exists (
      select 1
      from public.demos as d
      where d.id = affected_demo_id
        and d.status = 'published'
    ) and not exists (
      select 1
      from public.demos as d
      where d.id = affected_demo_id
        and (
          (
            d.publisher_region in ('mainland_china', 'international')
            and exists (
              select 1
              from public.demo_publishers as publisher
              where publisher.demo_id = d.id
                and publisher.region = d.publisher_region
            )
          )
          or (
            d.publisher_region = 'mixed'
            and exists (
              select 1
              from public.demo_publishers as mainland_publisher
              where mainland_publisher.demo_id = d.id
                and mainland_publisher.region = 'mainland_china'
            )
            and exists (
              select 1
              from public.demo_publishers as international_publisher
              where international_publisher.demo_id = d.id
                and international_publisher.region = 'international'
            )
          )
        )
    ) then
      raise exception using
        errcode = '23514',
        message = '已发布案例必须保留与发布方地区一致的已核验发布方';
    end if;
  end loop;

  return null;
end;
$$;

create constraint trigger demos_require_publisher
after insert or update on public.demos
deferrable initially deferred
for each row execute function public.enforce_published_demo_publisher();

create constraint trigger demo_publishers_preserve_publisher
after insert or update or delete on public.demo_publishers
deferrable initially deferred
for each row execute function public.enforce_published_demo_publisher();

create function public.enforce_published_demo_claims()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_demo_id uuid;
  affected_demo_ids uuid[];
begin
  if tg_table_name = 'demos' then
    affected_demo_ids := array[new.id];
  elsif tg_op = 'INSERT' then
    affected_demo_ids := array[new.demo_id];
  elsif tg_op = 'DELETE' then
    affected_demo_ids := array[old.demo_id];
  else
    affected_demo_ids := array[new.demo_id, old.demo_id];
  end if;

  foreach affected_demo_id in array affected_demo_ids loop
    if exists (
      select 1
      from public.demos as d
      where d.id = affected_demo_id
        and d.status = 'published'
    ) and not public.has_complete_primary_claims(affected_demo_id) then
      raise exception using
        errcode = '23514',
        message = '已发布案例必须为 11 个详情区块各保留一条主要主张';
    end if;
  end loop;

  return null;
end;
$$;

create constraint trigger demos_require_primary_claims
after insert or update on public.demos
deferrable initially deferred
for each row execute function public.enforce_published_demo_claims();

create constraint trigger demo_claims_preserve_primary_claims
after insert or update or delete on public.demo_claims
deferrable initially deferred
for each row execute function public.enforce_published_demo_claims();

create function public.enforce_published_demo_source_code_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  affected_demo_id uuid;
  affected_demo_ids uuid[];
begin
  if tg_table_name = 'demos' then
    affected_demo_ids := array[new.id];
  elsif tg_op = 'INSERT' then
    affected_demo_ids := array[new.demo_id];
  elsif tg_op = 'DELETE' then
    affected_demo_ids := array[old.demo_id];
  else
    affected_demo_ids := array[new.demo_id, old.demo_id];
  end if;

  foreach affected_demo_id in array affected_demo_ids loop
    if exists (
      select 1
      from public.demos as d
      where d.id = affected_demo_id
        and d.status = 'published'
    ) and not public.has_consistent_source_code_status(affected_demo_id) then
      raise exception using
        errcode = '23514',
        message = '已发布案例的源码状态必须与仓库链接和开源证据一致';
    end if;
  end loop;

  return null;
end;
$$;

create constraint trigger demos_require_consistent_source_code_status
after insert or update on public.demos
deferrable initially deferred
for each row execute function public.enforce_published_demo_source_code_status();

create constraint trigger demo_links_preserve_source_code_status
after insert or update or delete on public.demo_links
deferrable initially deferred
for each row execute function public.enforce_published_demo_source_code_status();

create constraint trigger demo_evidence_preserve_source_code_status
after insert or update or delete on public.demo_evidence
deferrable initially deferred
for each row execute function public.enforce_published_demo_source_code_status();

create function public.update_demo_favorite_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.demos
    set favorites_count = public.demos.favorites_count + 1
    where public.demos.id = new.demo_id;
  elsif tg_op = 'DELETE' then
    update public.demos
    set favorites_count = public.demos.favorites_count - 1
    where public.demos.id = old.demo_id;
  end if;

  return null;
end;
$$;

create trigger favorites_update_demo_count
after insert or delete on public.favorites
for each row execute function public.update_demo_favorite_count();

create function public.reject_favorite_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception using
    errcode = '55000',
    message = '收藏关系不可更新或截断；请使用插入或删除';
end;
$$;

create trigger favorites_reject_update_or_truncate
before update or truncate on public.favorites
for each statement execute function public.reject_favorite_mutation();

create function public.recalculate_favorite_counts()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  changed_rows integer;
begin
  perform 1
  from public.demos as lock_target
  order by lock_target.id
  for update;

  update public.demos as d
  set favorites_count = counts.favorite_count
  from (
    select target.id, pg_catalog.count(f.user_id)::integer as favorite_count
    from public.demos as target
    left join public.favorites as f on f.demo_id = target.id
    group by target.id
  ) as counts
  where d.id = counts.id
    and d.favorites_count is distinct from counts.favorite_count;

  get diagnostics changed_rows = row_count;
  return changed_rows;
end;
$$;

alter table public.categories enable row level security;
alter table public.tools enable row level security;
alter table public.demos enable row level security;
alter table public.demo_tools enable row level security;
alter table public.demo_publishers enable row level security;
alter table public.demo_links enable row level security;
alter table public.demo_claims enable row level security;
alter table public.demo_media enable row level security;
alter table public.demo_evidence enable row level security;
alter table public.favorites enable row level security;

create policy categories_public_read on public.categories
for select to anon, authenticated
using (true);

create policy tools_public_read on public.tools
for select to anon, authenticated
using (true);

create policy demos_public_read on public.demos
for select to anon, authenticated
using (public.is_demo_public(id));

create policy demo_tools_public_read on public.demo_tools
for select to anon, authenticated
using (public.is_demo_public(demo_id));

create policy demo_publishers_public_read on public.demo_publishers
for select to anon, authenticated
using (public.is_demo_public(demo_id));

create policy demo_links_public_read on public.demo_links
for select to anon, authenticated
using (public.is_demo_public(demo_id));

create policy demo_claims_public_read on public.demo_claims
for select to anon, authenticated
using (public.is_demo_public(demo_id));

create policy demo_media_public_read on public.demo_media
for select to anon, authenticated
using (authorization_status = 'approved' and public.is_demo_public(demo_id));

create policy demo_evidence_public_read on public.demo_evidence
for select to anon, authenticated
using (public.is_demo_public(demo_id));

create policy favorites_owner_read on public.favorites
for select to authenticated
using (auth.uid() = user_id);

create policy favorites_owner_insert on public.favorites
for insert to authenticated
with check (auth.uid() = user_id and public.is_demo_public(demo_id));

create policy favorites_owner_delete on public.favorites
for delete to authenticated
using (auth.uid() = user_id);

create function public.search_demos(
  p_query text default null,
  p_category text default null,
  p_tool text default null,
  p_difficulty text default null,
  p_region text default null,
  p_sort text default 'newest',
  p_page integer default 1
)
returns table (
  id uuid,
  slug text,
  name text,
  tagline text,
  summary text,
  cover_path text,
  cover_alt text,
  difficulty text,
  maturity text,
  publisher_region text,
  case_kind text,
  primary_source_platform text,
  commercial_potential_score smallint,
  commercial_potential_rationale text,
  favorites_count integer,
  editor_pick_rank integer,
  featured boolean,
  published_at timestamptz,
  updated_at timestamptz,
  category_slug text,
  category_name text,
  tool_slugs text[],
  tool_names text[],
  total_count bigint
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  selected_sort text := coalesce(p_sort, 'newest');
begin
  if p_page is null or p_page < 1 then
    raise exception using errcode = '22023', message = '页码必须是大于等于 1 的整数';
  end if;

  if selected_sort not in ('newest', 'commercial-potential', 'most-favorited', 'editor-pick') then
    raise exception using errcode = '22023', message = '不支持的排序方式';
  end if;

  if p_difficulty is not null and p_difficulty not in ('beginner', 'intermediate', 'advanced') then
    raise exception using errcode = '22023', message = '不支持的难度筛选';
  end if;

  if p_region is not null and p_region not in ('mainland_china', 'international', 'mixed') then
    raise exception using errcode = '22023', message = '不支持的发布方地区筛选';
  end if;

  return query
  select
    d.id,
    d.slug,
    d.name,
    d.tagline,
    d.summary,
    d.cover_path,
    d.cover_alt,
    d.difficulty,
    d.maturity,
    d.publisher_region,
    d.case_kind,
    d.primary_source_platform,
    d.commercial_potential_score,
    d.commercial_potential_rationale,
    d.favorites_count,
    d.editor_pick_rank,
    d.featured,
    d.published_at,
    d.updated_at,
    category.slug,
    category.name_zh,
    tool_list.tool_slugs,
    tool_list.tool_names,
    pg_catalog.count(*) over () as total_count
  from public.demos as d
  join public.categories as category on category.id = d.category_id
  cross join lateral (
    select
      coalesce(
        pg_catalog.array_agg(tool.slug order by tool.name) filter (where tool.id is not null),
        array[]::text[]
      ) as tool_slugs,
      coalesce(
        pg_catalog.array_agg(tool.name order by tool.name) filter (where tool.id is not null),
        array[]::text[]
      ) as tool_names
    from public.demo_tools as relation
    join public.tools as tool on tool.id = relation.tool_id
    where relation.demo_id = d.id
  ) as tool_list
  where (
    p_query is null
    or pg_catalog.btrim(p_query) = ''
    or pg_catalog.strpos(
      pg_catalog.lower(pg_catalog.concat_ws(' ', d.name, d.tagline, d.summary)),
      pg_catalog.lower(pg_catalog.btrim(p_query))
    ) > 0
  )
    and (p_category is null or category.slug = p_category)
    and (
      p_tool is null
      or exists (
        select 1
        from public.demo_tools as filter_relation
        join public.tools as filter_tool on filter_tool.id = filter_relation.tool_id
        where filter_relation.demo_id = d.id
          and filter_tool.slug = p_tool
      )
    )
    and (p_difficulty is null or d.difficulty = p_difficulty)
    and (p_region is null or d.publisher_region = p_region)
    and public.is_demo_public(d.id)
  order by
    case when selected_sort = 'newest' then d.published_at end desc nulls last,
    case when selected_sort = 'commercial-potential' then d.commercial_potential_score end desc nulls last,
    case when selected_sort = 'most-favorited' then d.favorites_count end desc nulls last,
    case when selected_sort = 'editor-pick' then d.editor_pick_rank end asc nulls last,
    d.published_at desc,
    d.slug asc
  limit 12
  offset ((p_page::bigint - 1) * 12);
end;
$$;

create function public.get_featured_demos()
returns table (
  id uuid,
  slug text,
  name text,
  tagline text,
  summary text,
  cover_path text,
  cover_alt text,
  difficulty text,
  maturity text,
  publisher_region text,
  case_kind text,
  primary_source_platform text,
  commercial_potential_score smallint,
  commercial_potential_rationale text,
  favorites_count integer,
  editor_pick_rank integer,
  published_at timestamptz,
  updated_at timestamptz,
  category_slug text,
  category_name text,
  tool_slugs text[],
  tool_names text[]
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    d.id,
    d.slug,
    d.name,
    d.tagline,
    d.summary,
    d.cover_path,
    d.cover_alt,
    d.difficulty,
    d.maturity,
    d.publisher_region,
    d.case_kind,
    d.primary_source_platform,
    d.commercial_potential_score,
    d.commercial_potential_rationale,
    d.favorites_count,
    d.editor_pick_rank,
    d.published_at,
    d.updated_at,
    category.slug,
    category.name_zh,
    tool_list.tool_slugs,
    tool_list.tool_names
  from public.demos as d
  join public.categories as category on category.id = d.category_id
  cross join lateral (
    select
      coalesce(
        pg_catalog.array_agg(tool.slug order by tool.name) filter (where tool.id is not null),
        array[]::text[]
      ) as tool_slugs,
      coalesce(
        pg_catalog.array_agg(tool.name order by tool.name) filter (where tool.id is not null),
        array[]::text[]
      ) as tool_names
    from public.demo_tools as relation
    join public.tools as tool on tool.id = relation.tool_id
    where relation.demo_id = d.id
  ) as tool_list
  where d.featured
    and public.is_demo_public(d.id)
  order by d.published_at desc, d.slug asc;
$$;

create function public.get_public_catalog_contract()
returns table (
  contract_version text,
  published_demo_count bigint,
  open_source_demo_count bigint,
  primary_claim_count bigint,
  primary_demo_section_count bigint,
  distinct_primary_section_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with public_demos as (
    select demo.id, demo.source_code_status
    from public.demos as demo
    where public.is_demo_public(demo.id)
  ),
  primary_claims as (
    select claim.demo_id, claim.section
    from public.demo_claims as claim
    join public_demos as demo on demo.id = claim.demo_id
    where claim.is_primary
  )
  select
    'launch-curated-mvp-v1'::text,
    (select pg_catalog.count(*) from public_demos),
    (
      select pg_catalog.count(*)
      from public_demos
      where source_code_status = 'open_source'
    ),
    (select pg_catalog.count(*) from primary_claims),
    (
      select pg_catalog.count(*)
      from (
        select distinct claim.demo_id, claim.section
        from primary_claims as claim
      ) as demo_sections
    ),
    (
      select pg_catalog.count(distinct claim.section)
      from primary_claims as claim
    );
$$;

create function public.set_favorite(p_demo_id uuid, p_favorited boolean)
returns table (demo_id uuid, is_favorited boolean, favorite_count integer)
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception using errcode = '42501', message = '必须登录后才能收藏';
  end if;

  if p_favorited is null then
    raise exception using errcode = '22023', message = '收藏状态不能为空';
  end if;

  if p_demo_id is null or (p_favorited and not public.is_demo_public(p_demo_id)) then
    raise exception using errcode = 'P0002', message = '案例不存在或不可收藏';
  end if;

  if p_favorited then
    insert into public.favorites (user_id, demo_id)
    values (current_user_id, p_demo_id)
    on conflict on constraint favorites_pkey do nothing;
  else
    delete from public.favorites as favorite
    where favorite.user_id = current_user_id
      and favorite.demo_id = p_demo_id;

    if not public.is_demo_public(p_demo_id) then
      return query select p_demo_id, false, null::integer;
      return;
    end if;
  end if;

  return query
  select
    p_demo_id,
    exists (
      select 1
      from public.favorites as favorite
      where favorite.user_id = current_user_id
        and favorite.demo_id = p_demo_id
    ),
    d.favorites_count
  from public.demos as d
  where d.id = p_demo_id;
end;
$$;

revoke all on public.categories, public.tools, public.demos, public.demo_tools,
  public.demo_publishers, public.demo_links, public.demo_claims, public.demo_media,
  public.demo_evidence, public.favorites from anon, authenticated;
grant select on public.categories, public.tools, public.demos, public.demo_tools,
  public.demo_publishers, public.demo_links, public.demo_claims, public.demo_media,
  public.demo_evidence to anon, authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant all on public.categories, public.tools, public.demos, public.demo_tools,
  public.demo_publishers, public.demo_links, public.demo_claims, public.demo_media,
  public.demo_evidence to service_role;
grant select, insert, delete on public.favorites to service_role;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.lock_demo_for_catalog_invariant() from public, anon, authenticated;
revoke all on function public.enforce_published_demo_product_preview() from public, anon, authenticated;
revoke all on function public.enforce_published_demo_publisher() from public, anon, authenticated;
revoke all on function public.enforce_published_demo_claims() from public, anon, authenticated;
revoke all on function public.enforce_published_demo_source_code_status() from public, anon, authenticated;
revoke all on function public.update_demo_favorite_count() from public, anon, authenticated;
revoke all on function public.reject_favorite_mutation() from public, anon, authenticated;
revoke all on function public.recalculate_favorite_counts() from public, anon, authenticated;
revoke all on function public.has_complete_primary_claims(uuid) from public, anon, authenticated;
revoke all on function public.has_consistent_source_code_status(uuid) from public, anon, authenticated;
revoke all on function public.is_demo_public(uuid) from public;
revoke all on function public.search_demos(text, text, text, text, text, text, integer) from public;
revoke all on function public.get_featured_demos() from public;
revoke all on function public.get_public_catalog_contract() from public;
revoke all on function public.set_favorite(uuid, boolean) from public;

grant execute on function public.is_demo_public(uuid) to anon, authenticated, service_role;
grant execute on function public.search_demos(text, text, text, text, text, text, integer) to anon, authenticated, service_role;
grant execute on function public.get_featured_demos() to anon, authenticated, service_role;
grant execute on function public.get_public_catalog_contract() to anon, authenticated, service_role;
grant execute on function public.set_favorite(uuid, boolean) to authenticated, service_role;
grant execute on function public.recalculate_favorite_counts() to service_role;
