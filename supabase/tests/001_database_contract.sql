begin;

create extension if not exists pgtap with schema extensions;
create extension if not exists dblink with schema extensions;
set local search_path = public, extensions;

select no_plan();

-- Supabase Local 的 postgres 角色仍要求密码；并发连接只使用固定本地测试凭据。
create function pg_temp.local_dblink_connection(p_application_name text default null)
returns text
language sql
stable
set search_path = ''
as $$
  select pg_catalog.format(
    'host=db port=%s dbname=%s user=postgres password=postgres%s',
    pg_catalog.current_setting('port'),
    pg_catalog.current_database(),
    case
      when p_application_name is null then ''
      else pg_catalog.format(' application_name=%s', p_application_name)
    end
  )
$$;

select has_table('public', 'categories', '存在分类表');
select has_table('public', 'tools', '存在工具表');
select has_table('public', 'demos', '存在案例表');
select has_table('public', 'demo_tools', '存在案例工具关系表');
select has_table('public', 'demo_publishers', '存在发布方表');
select has_table('public', 'demo_links', '存在链接表');
select has_table('public', 'demo_claims', '存在逐条主张表');
select has_table('public', 'demo_media', '存在素材表');
select has_table('public', 'demo_evidence', '存在证据表');
select has_table('public', 'favorites', '存在收藏表');
select has_column('public', 'demos', 'source_code_status', '案例显式记录源码公开状态');
select has_column('public', 'demo_claims', 'is_primary', '逐条主张显式记录是否为详情页主要主张');

select has_function(
  'public',
  'search_demos',
  array['text', 'text', 'text', 'text', 'text', 'text', 'integer'],
  '存在固定签名的搜索函数'
);
select has_function(
  'public',
  'set_favorite',
  array['uuid', 'boolean'],
  '存在显式收藏函数'
);
select has_function(
  'public',
  'recalculate_favorite_counts',
  array[]::text[],
  '存在收藏计数重算函数'
);
select has_function(
  'public',
  'get_public_catalog_contract',
  array[]::text[],
  '存在版本化公开目录合同函数'
);
select ok(
  (select prosecdef from pg_catalog.pg_proc where oid = 'public.is_demo_public(uuid)'::regprocedure),
  '公开谓词保持 SECURITY DEFINER，避免调用者 RLS 递归'
);
select ok(
  coalesce(
    (select 'search_path=""' = any(proconfig) from pg_catalog.pg_proc where oid = 'public.is_demo_public(uuid)'::regprocedure),
    false
  ),
  'SECURITY DEFINER 公开谓词固定为空 search_path'
);
select ok(
  not (select prosecdef from pg_catalog.pg_proc where oid = 'public.search_demos(text,text,text,text,text,text,integer)'::regprocedure),
  '搜索函数保持 SECURITY INVOKER'
);
select ok(
  not pg_catalog.has_function_privilege('anon', 'public.recalculate_favorite_counts()', 'EXECUTE'),
  '游客不能执行收藏计数重算函数'
);
select ok(
  not pg_catalog.has_function_privilege('anon', 'public.has_complete_primary_claims(uuid)', 'EXECUTE'),
  '游客不能绕过目录接口探测主要主张完整性'
);
select ok(
  not pg_catalog.has_function_privilege('anon', 'public.has_consistent_source_code_status(uuid)', 'EXECUTE'),
  '游客不能绕过目录接口探测源码状态证据'
);
select ok(
  not pg_catalog.has_function_privilege('anon', 'public.lock_demo_for_catalog_invariant()', 'EXECUTE'),
  '游客不能直接执行发布门禁父行锁函数'
);
select ok(
  not (select prosecdef from pg_catalog.pg_proc where oid = 'public.get_public_catalog_contract()'::regprocedure),
  '公开目录合同保持 SECURITY INVOKER'
);
select ok(
  pg_catalog.has_function_privilege('anon', 'public.get_public_catalog_contract()', 'EXECUTE'),
  '游客可以只读取得版本化公开目录合同'
);

set local role anon;
select results_eq(
  $$select * from public.get_public_catalog_contract()$$,
  $$values ('launch-curated-mvp-v1'::text, 12::bigint, 12::bigint, 132::bigint, 132::bigint, 11::bigint)$$,
  '版本化公开目录合同精确绑定首发 schema 与内容规模'
);
reset role;

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000101',
    'authenticated',
    'authenticated',
    'first@example.test',
    extensions.crypt('database-test-password', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000102',
    'authenticated',
    'authenticated',
    'second@example.test',
    extensions.crypt('database-test-password', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  );

insert into public.categories (id, slug, name_zh, sort_order)
values (
  '00000000-0000-0000-0000-000000000201',
  'database-test',
  '数据库测试分类',
  999
);

insert into public.tools (id, slug, name, official_url)
values (
  '00000000-0000-0000-0000-000000000301',
  'verified-tool',
  'Verified Tool',
  'https://example.test/tool'
);

create function pg_temp.insert_complete_draft(p_id uuid, p_slug text)
returns void
language plpgsql
as $$
begin
  insert into public.demos (
    id,
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
  )
  values (
    p_id,
    p_slug,
    'Visible 100% Demo ' || p_slug,
    '可核验的短句',
    '用于数据库契约测试的完整摘要。',
    '00000000-0000-0000-0000-000000000201',
    'draft',
    'product',
    'production_product',
    'international',
    'verified',
    'closed_source',
    'intermediate',
    '用户需要更快完成一项真实工作。',
    '提供可运行的 AI 输入、处理和输出闭环。',
    '高频任务与清晰结果让该方向具备成立条件。',
    '需要提高效率的个人和小团队。',
    array['提交输入', '生成结果', '保存结果'],
    '使用已核验的模型能力处理用户输入。',
    'Web 应用、数据库与外部模型接口。',
    '订阅或按次收费，属于编辑推断。',
    '{"implemented":["真实输入输出"],"simulated":[],"not_implemented":[]}'::jsonb,
    '把目标用户改为垂直行业团队。',
    '把通用结果改为行业交付物。',
    '把个人场景改为企业工作流。',
    '面向垂直行业建立带人工复核的服务，属于产品假设。',
    'official_site',
    'Official Site',
    'https://example.test/product',
    timestamptz '2026-07-16 00:00:00+00',
    '/media/covers/' || p_slug || '.webp',
    p_slug || ' 的原创抽象封面',
    'AI Demo Vault',
    '本站原创，仅用于本站案例展示',
    'original',
    'approved',
    4,
    '付费者、重复价值和公开替代成本清晰。',
    '官方产品页展示可用服务，本分数仅为站内编辑判断。',
    'commercial-v1',
    timestamptz '2026-07-16 00:00:00+00',
    pg_catalog.repeat('b', 32),
    date '2026-07-16',
    timestamptz '2026-07-16 00:00:00+00',
    true,
    1
  );
end;
$$;

create function pg_temp.add_verified_publisher(p_demo_id uuid)
returns void
language sql
as $$
  insert into public.demo_publishers (
    demo_id,
    name,
    region,
    role,
    official_evidence_url,
    verified_at
  )
  values (
    p_demo_id,
    'Verified Publisher',
    'international',
    'developer',
    'https://example.test/about',
    timestamptz '2026-07-16 00:00:00+00'
  );
$$;

create function pg_temp.add_approved_preview(p_demo_id uuid, p_media_id uuid, p_suffix text)
returns void
language sql
as $$
  insert into public.demo_media (
    id,
    demo_id,
    role,
    storage_path,
    media_type,
    alt_text,
    rights_holder,
    license_terms,
    permission_basis,
    authorization_status,
    source_url,
    content_hash,
    captured_by_site,
    is_abstract
  )
  values (
    p_media_id,
    p_demo_id,
    'product_preview',
    '/media/previews/' || p_suffix || '.webp',
    'image',
    p_suffix || ' 的真实产品界面截图',
    'Verified Publisher',
    '已获准由本站实际运行并采集用于案例展示',
    '测试夹具由本站实际运行并采集',
    'approved',
    'https://example.test/product',
    pg_catalog.repeat('a', 64),
    true,
    false
  );
$$;

create function pg_temp.add_primary_claims(p_demo_id uuid)
returns void
language sql
as $$
  insert into public.demo_claims (
    demo_id,
    section,
    claim_type,
    content,
    source_url,
    verified_at,
    is_primary
  )
  values
    (p_demo_id, 'product_overview', 'fact', '产品是什么。', 'https://example.test/product', timestamptz '2026-07-16 00:00:00+00', true),
    (p_demo_id, 'why_it_works', 'editorial_inference', '为什么成立。', null, null, true),
    (p_demo_id, 'pain_points', 'editorial_inference', '用户痛点。', null, null, true),
    (p_demo_id, 'solution', 'fact', '解决方案。', 'https://example.test/product', timestamptz '2026-07-16 00:00:00+00', true),
    (p_demo_id, 'target_users', 'editorial_inference', '目标用户。', null, null, true),
    (p_demo_id, 'core_features', 'fact', '核心功能。', 'https://example.test/product', timestamptz '2026-07-16 00:00:00+00', true),
    (p_demo_id, 'ai_implementation', 'fact', 'AI 实现。', 'https://example.test/product', timestamptz '2026-07-16 00:00:00+00', true),
    (p_demo_id, 'technical_implementation', 'fact', '技术实现。', 'https://example.test/product', timestamptz '2026-07-16 00:00:00+00', true),
    (p_demo_id, 'monetization', 'editorial_inference', '盈利方式。', null, null, true),
    (p_demo_id, 'truth_boundary', 'editorial_inference', '真实性边界。', null, null, true),
    (p_demo_id, 'adaptation', 'hypothesis', '创业改造。', null, null, true);
$$;

select pg_temp.insert_complete_draft(
  '00000000-0000-0000-0000-000000000401',
  'public-demo'
);
select pg_temp.add_verified_publisher('00000000-0000-0000-0000-000000000401');
select pg_temp.add_approved_preview(
  '00000000-0000-0000-0000-000000000401',
  '00000000-0000-0000-0000-000000000501',
  'public-demo'
);
select pg_temp.add_primary_claims('00000000-0000-0000-0000-000000000401');
update public.demos
set status = 'published'
where id = '00000000-0000-0000-0000-000000000401';

insert into public.demo_tools (demo_id, tool_id, verified_at, source_url)
values (
  '00000000-0000-0000-0000-000000000401',
  '00000000-0000-0000-0000-000000000301',
  timestamptz '2026-07-16 00:00:00+00',
  'https://example.test/docs'
);

insert into public.demo_links (
  demo_id,
  link_type,
  label,
  url,
  source_platform,
  is_canonical,
  last_verified_at
)
values (
  '00000000-0000-0000-0000-000000000401',
  'online_demo',
  '在线体验',
  'https://example.test/product',
  'Official Site',
  true,
  timestamptz '2026-07-16 00:00:00+00'
);

insert into public.demo_claims (
  demo_id,
  section,
  claim_type,
  content,
  source_url,
  verified_at
)
values
  (
    '00000000-0000-0000-0000-000000000401',
    'product_overview',
    'fact',
    '官方产品页提供真实可用入口。',
    'https://example.test/product',
    timestamptz '2026-07-16 00:00:00+00'
  ),
  (
    '00000000-0000-0000-0000-000000000401',
    'adaptation',
    'hypothesis',
    '可以面向垂直团队重做。',
    null,
    null
  );

insert into public.demo_evidence (
  demo_id,
  evidence_type,
  description,
  source_url,
  verified_at
)
values (
  '00000000-0000-0000-0000-000000000401',
  'commercial_service',
  '官方提供可访问服务。',
  'https://example.test/product',
  timestamptz '2026-07-16 00:00:00+00'
);

insert into public.demo_media (
  demo_id,
  role,
  storage_path,
  media_type,
  alt_text,
  rights_holder,
  license_terms,
  authorization_status,
  source_url,
  content_hash,
  is_abstract
)
values (
  '00000000-0000-0000-0000-000000000401',
  'gallery',
  '/media/gallery/pending.webp',
  'image',
  '尚未授权的图库图片',
  'Unknown',
  '尚待核验',
  'pending',
  'https://example.test/pending',
  pg_catalog.repeat('b', 64),
  false
);

select pg_temp.insert_complete_draft(
  '00000000-0000-0000-0000-000000000402',
  'private-draft'
);
select pg_temp.add_verified_publisher('00000000-0000-0000-0000-000000000402');
select pg_temp.add_approved_preview(
  '00000000-0000-0000-0000-000000000402',
  '00000000-0000-0000-0000-000000000502',
  'private-draft'
);
insert into public.demo_tools (demo_id, tool_id, verified_at, source_url)
values (
  '00000000-0000-0000-0000-000000000402',
  '00000000-0000-0000-0000-000000000301',
  timestamptz '2026-07-16 00:00:00+00',
  'https://example.test/draft-docs'
);
insert into public.demo_links (
  demo_id,
  link_type,
  label,
  url,
  source_platform,
  is_canonical,
  last_verified_at
)
values (
  '00000000-0000-0000-0000-000000000402',
  'primary_source',
  '草稿主来源',
  'https://example.test/draft',
  'Official Site',
  true,
  timestamptz '2026-07-16 00:00:00+00'
);
insert into public.demo_claims (
  demo_id,
  section,
  claim_type,
  content,
  source_url,
  verified_at
)
values (
  '00000000-0000-0000-0000-000000000402',
  'product_overview',
  'fact',
  '草稿事实也不得公开。',
  'https://example.test/draft',
  timestamptz '2026-07-16 00:00:00+00'
);
insert into public.demo_evidence (
  demo_id,
  evidence_type,
  description,
  source_url,
  verified_at
)
values (
  '00000000-0000-0000-0000-000000000402',
  'open_source',
  '草稿证据不得公开。',
  'https://example.test/draft-source',
  timestamptz '2026-07-16 00:00:00+00'
);
update public.demos
set solution = null
where id = '00000000-0000-0000-0000-000000000402';

select pg_temp.insert_complete_draft(
  '00000000-0000-0000-0000-000000000403',
  'publisher-missing'
);
select pg_temp.add_approved_preview(
  '00000000-0000-0000-0000-000000000403',
  '00000000-0000-0000-0000-000000000503',
  'publisher-missing'
);
select pg_temp.add_primary_claims('00000000-0000-0000-0000-000000000403');
set constraints all immediate;
select throws_ok(
  $$update public.demos set status = 'published' where id = '00000000-0000-0000-0000-000000000403'$$,
  '23514',
  '已发布案例必须保留与发布方地区一致的已核验发布方',
  '立即约束拒绝缺少已核验发布方的案例'
);
set constraints all deferred;

set local role anon;

select results_eq(
  $$
    select slug
    from public.demos
    where id in (
      '00000000-0000-0000-0000-000000000401',
      '00000000-0000-0000-0000-000000000402',
      '00000000-0000-0000-0000-000000000403'
    )
    order by slug
  $$,
  $$values ('public-demo'::text)$$,
  '游客直接查表只能看到满足全部门槛的案例'
);
select is(
  (
    select pg_catalog.count(*)
    from public.demo_publishers
    where demo_id in (
      '00000000-0000-0000-0000-000000000401',
      '00000000-0000-0000-0000-000000000402',
      '00000000-0000-0000-0000-000000000403'
    )
  ),
  1::bigint,
  '游客只能看到公开案例的已核验发布方'
);
select is(
  (
    select pg_catalog.count(*)
    from public.demo_media
    where demo_id in (
      '00000000-0000-0000-0000-000000000401',
      '00000000-0000-0000-0000-000000000402',
      '00000000-0000-0000-0000-000000000403'
    )
  ),
  1::bigint,
  '游客看不到草稿、无发布方案例或未批准素材的媒体'
);
select is(
  (
    select pg_catalog.count(*)
    from public.demo_claims
    where demo_id in (
      '00000000-0000-0000-0000-000000000401',
      '00000000-0000-0000-0000-000000000402',
      '00000000-0000-0000-0000-000000000403'
    )
  ),
  13::bigint,
  '游客只能看到公开案例的全部主要与补充主张'
);
select is(
  (
    select pg_catalog.count(*)
    from public.demo_evidence
    where demo_id in (
      '00000000-0000-0000-0000-000000000401',
      '00000000-0000-0000-0000-000000000402',
      '00000000-0000-0000-0000-000000000403'
    )
  ),
  1::bigint,
  '游客只能读取公开案例证据'
);
select is(
  (
    select pg_catalog.count(*)
    from public.demo_tools
    where demo_id in (
      '00000000-0000-0000-0000-000000000401',
      '00000000-0000-0000-0000-000000000402',
      '00000000-0000-0000-0000-000000000403'
    )
  ),
  1::bigint,
  '游客能读取公开案例的已核验工具关系'
);
select is(
  (
    select pg_catalog.count(*)
    from public.demo_links
    where demo_id in (
      '00000000-0000-0000-0000-000000000401',
      '00000000-0000-0000-0000-000000000402',
      '00000000-0000-0000-0000-000000000403'
    )
  ),
  1::bigint,
  '游客看不到草稿案例链接'
);
select results_eq(
  $$select slug from public.search_demos('100%', null, null, null, null, 'newest', 1)$$,
  $$values ('public-demo'::text)$$,
  '搜索把百分号当普通文本而不是 SQL 通配符'
);
select is(
  (select pg_catalog.count(*) from public.search_demos(null, 'database-test', 'verified-tool', 'intermediate', 'international', 'commercial-potential', 1)),
  1::bigint,
  '搜索函数组合筛选且只返回公开案例'
);
select results_eq(
  $$
    select slug
    from public.get_featured_demos()
    where slug in ('public-demo', 'hidden-draft', 'publisher-missing')
    order by slug
  $$,
  $$values ('public-demo'::text)$$,
  '完整精选池也受相同公开门槛保护'
);
select throws_ok(
  $$select * from public.search_demos(null, null, null, null, null, 'unknown-sort', 1)$$,
  '22023',
  '不支持的排序方式',
  '搜索函数拒绝未知排序'
);
select throws_ok(
  $$select * from public.search_demos(null, null, null, null, null, 'newest', 0)$$,
  '22023',
  '页码必须是大于等于 1 的整数',
  '搜索函数拒绝非法页码'
);
select throws_ok(
  $$insert into public.favorites (user_id, demo_id) values ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000401')$$,
  '42501',
  'permission denied for table favorites',
  '游客不能直接写收藏'
);

reset role;

update public.demos
set updated_at = timestamptz '2026-01-01 00:00:00+00'
where id = '00000000-0000-0000-0000-000000000401';

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000101', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select results_eq(
  $$select is_favorited, favorite_count from public.set_favorite('00000000-0000-0000-0000-000000000401', true)$$,
  $$values (true, 1)$$,
  '首次收藏创建一条关系并增加一次计数'
);
select is(
  (select updated_at from public.demos where id = '00000000-0000-0000-0000-000000000401'),
  timestamptz '2026-01-01 00:00:00+00',
  '收藏计数变化不伪装成案例内容更新'
);
select results_eq(
  $$select is_favorited, favorite_count from public.set_favorite('00000000-0000-0000-0000-000000000401', true)$$,
  $$values (true, 1)$$,
  '重复收藏保持幂等且不重复计数'
);
select is(
  (select pg_catalog.count(*) from public.favorites),
  1::bigint,
  '用户只看到自己的单条收藏关系'
);
select throws_ok(
  $$insert into public.favorites (user_id, demo_id) values ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000401')$$,
  '42501',
  'new row violates row-level security policy for table "favorites"',
  '用户不能伪造收藏所有者'
);
select throws_ok(
  $$select * from public.set_favorite('00000000-0000-0000-0000-000000000402', true)$$,
  'P0002',
  '案例不存在或不可收藏',
  '草稿不能被收藏'
);

reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000102', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select results_eq(
  $$select is_favorited, favorite_count from public.set_favorite('00000000-0000-0000-0000-000000000401', true)$$,
  $$values (true, 2)$$,
  '第二个用户的收藏独立增加真实计数'
);

reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000101', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select is(
  (select pg_catalog.count(*) from public.favorites),
  1::bigint,
  '用户甲不能读取用户乙的收藏关系'
);
delete from public.favorites
where user_id = '00000000-0000-0000-0000-000000000102'
  and demo_id = '00000000-0000-0000-0000-000000000401';
select results_eq(
  $$select is_favorited, favorite_count from public.set_favorite('00000000-0000-0000-0000-000000000401', false)$$,
  $$values (false, 1)$$,
  '取消自己的收藏不影响另一个用户'
);
select results_eq(
  $$select is_favorited, favorite_count from public.set_favorite('00000000-0000-0000-0000-000000000401', false)$$,
  $$values (false, 1)$$,
  '重复取消保持幂等且计数不为负'
);

reset role;

select throws_ok(
  $$update public.favorites set demo_id = demo_id$$,
  '55000',
  '收藏关系不可更新或截断；请使用插入或删除',
  '数据库拒绝更新不可变收藏关系'
);
select throws_ok(
  $$truncate table public.favorites$$,
  '55000',
  '收藏关系不可更新或截断；请使用插入或删除',
  '数据库拒绝截断收藏表导致计数漂移'
);
select is(
  (select favorites_count from public.demos where id = '00000000-0000-0000-0000-000000000401'),
  1,
  '收藏计数与剩余关系一致'
);
update public.demos
set favorites_count = 7
where id = '00000000-0000-0000-0000-000000000401';
select is(
  public.recalculate_favorite_counts(),
  1,
  '重算函数修正发生漂移的计数'
);
select is(
  (select favorites_count from public.demos where id = '00000000-0000-0000-0000-000000000401'),
  1,
  '重算后的计数等于收藏关系数'
);
select matches(
  pg_catalog.pg_get_functiondef('public.update_demo_favorite_count()'::regprocedure),
  'favorites_count [+] 1',
  '收藏触发器在案例行上执行原子加法以承受并发写入'
);
select doesnt_match(
  pg_catalog.pg_get_functiondef('public.update_demo_favorite_count()'::regprocedure),
  'else 0',
  '收藏删除不把损坏计数静默钳制为零'
);

select throws_ok(
  $$insert into public.demo_claims (demo_id, section, claim_type, content) values ('00000000-0000-0000-0000-000000000402', 'product_overview', 'fact', '缺来源的事实')$$,
  '23514',
  'new row for relation "demo_claims" violates check constraint "demo_claims_fact_has_source"',
  '数据库拒绝没有来源和核验日期的事实主张'
);

select throws_ok(
  $$insert into public.demo_media (demo_id, role, storage_path, media_type, alt_text, rights_holder, license_terms, authorization_status, source_url, content_hash) values ('00000000-0000-0000-0000-000000000402', 'product_preview', '/media/previews/unapproved.webp', 'image', '无权利依据截图', 'Unknown', '未授权', 'approved', 'https://example.test/product', 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc')$$,
  '23514',
  'new row for relation "demo_media" violates check constraint "demo_media_product_preview_rights"',
  '数据库拒绝既非本站合规采集也无明确授权的展示媒体'
);
select throws_ok(
  $$insert into public.demo_media (demo_id, role, storage_path, media_type, alt_text, rights_holder, license_terms, authorization_status, source_url, content_hash, explicit_permission) values ('00000000-0000-0000-0000-000000000402', 'product_preview', '/media/previews/missing-basis.webp', 'image', '缺少使用依据的截图', 'Verified Publisher', '仓库许可', 'approved', 'https://example.test/product', 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', true)$$,
  '23514',
  'new row for relation "demo_media" violates check constraint "demo_media_product_preview_rights"',
  '数据库拒绝未登记使用依据的产品预览'
);
select throws_ok(
  $$insert into public.demo_media (demo_id, role, storage_path, media_type, alt_text, rights_holder, license_terms, permission_basis, authorization_status, source_url, content_hash, explicit_permission, static_poster_path) values ('00000000-0000-0000-0000-000000000402', 'product_preview', '/media/previews/missing-poster-hash.gif', 'gif', '缺少静态海报哈希的动图', 'Verified Publisher', '仓库许可', '官方仓库许可', 'approved', 'https://example.test/product', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', true, '/media/previews/poster.webp')$$,
  '23514',
  'new row for relation "demo_media" violates check constraint "demo_media_gif_has_poster"',
  '数据库拒绝未登记静态海报哈希的获准 GIF'
);
select throws_ok(
  $$insert into public.demo_media (demo_id, role, storage_path, media_type, alt_text, rights_holder, license_terms, authorization_status, source_url, content_hash, is_original) values ('00000000-0000-0000-0000-000000000402', 'gallery', '/media/gallery/missing-source.webp', 'image', '缺来源的图库素材', 'Unknown', '未提供来源', 'approved', null, 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', false)$$,
  '23514',
  'new row for relation "demo_media" violates check constraint "demo_media_approved_metadata_complete"',
  '数据库拒绝既非原创又缺少来源的已批准素材'
);

select throws_ok(
  $$update public.demos set status = 'published' where id = '00000000-0000-0000-0000-000000000402'$$,
  '23514',
  'new row for relation "demos" violates check constraint "demos_published_content_complete"',
  '本表约束拒绝缺少完整发布字段的草稿'
);

select pg_temp.insert_complete_draft(
  '00000000-0000-0000-0000-000000000406',
  'missing-source-url'
);
select pg_temp.add_verified_publisher('00000000-0000-0000-0000-000000000406');
select pg_temp.add_approved_preview(
  '00000000-0000-0000-0000-000000000406',
  '00000000-0000-0000-0000-000000000507',
  'missing-source-url'
);
update public.demos
set primary_source_url = null
where id = '00000000-0000-0000-0000-000000000406';
select throws_ok(
  $$update public.demos set status = 'published' where id = '00000000-0000-0000-0000-000000000406'$$,
  '23514',
  'new row for relation "demos" violates check constraint "demos_published_content_complete"',
  '发布约束拒绝 NULL 官方主来源 URL'
);

select pg_temp.insert_complete_draft(
  '00000000-0000-0000-0000-000000000408',
  'missing-commercial-score'
);
select pg_temp.add_verified_publisher('00000000-0000-0000-0000-000000000408');
select pg_temp.add_approved_preview(
  '00000000-0000-0000-0000-000000000408',
  '00000000-0000-0000-0000-000000000508',
  'missing-commercial-score'
);
update public.demos
set commercial_potential_score = null
where id = '00000000-0000-0000-0000-000000000408';
select throws_ok(
  $$update public.demos set status = 'published' where id = '00000000-0000-0000-0000-000000000408'$$,
  '23514',
  'new row for relation "demos" violates check constraint "demos_published_content_complete"',
  '发布约束拒绝 NULL 商业潜力分数'
);

select pg_temp.insert_complete_draft(
  '00000000-0000-0000-0000-000000000410',
  'empty-truth-boundary'
);
select pg_temp.add_verified_publisher('00000000-0000-0000-0000-000000000410');
select pg_temp.add_approved_preview(
  '00000000-0000-0000-0000-000000000410',
  '00000000-0000-0000-0000-000000000510',
  'empty-truth-boundary'
);
select pg_temp.add_primary_claims('00000000-0000-0000-0000-000000000410');
update public.demos
set truth_boundary = '{"implemented":[],"simulated":[],"not_implemented":[]}'::jsonb
where id = '00000000-0000-0000-0000-000000000410';
select throws_ok(
  $$update public.demos set status = 'published' where id = '00000000-0000-0000-0000-000000000410'$$,
  '23514',
  'new row for relation "demos" violates check constraint "demos_published_content_complete"',
  '发布约束拒绝三组都为空的真实性边界'
);

select pg_temp.insert_complete_draft(
  '00000000-0000-0000-0000-000000000409',
  'missing-primary-claims'
);
select pg_temp.add_verified_publisher('00000000-0000-0000-0000-000000000409');
select pg_temp.add_approved_preview(
  '00000000-0000-0000-0000-000000000409',
  '00000000-0000-0000-0000-000000000509',
  'missing-primary-claims'
);
set constraints all immediate;
select throws_ok(
  $$update public.demos set status = 'published' where id = '00000000-0000-0000-0000-000000000409'$$,
  '23514',
  '已发布案例必须为 11 个详情区块各保留一条主要主张',
  '发布门禁拒绝缺少 11 个主要主张的案例'
);
select is(
  (
    select pg_catalog.count(*)
    from public.demo_claims
    where demo_id = '00000000-0000-0000-0000-000000000401'
      and is_primary
  ),
  11::bigint,
  '公开案例恰好保留 11 个详情区块的主要主张'
);
select throws_ok(
  $$delete from public.demo_claims where demo_id = '00000000-0000-0000-0000-000000000401' and section = 'truth_boundary' and is_primary$$,
  '23514',
  '已发布案例必须为 11 个详情区块各保留一条主要主张',
  '删除公开案例的任一主要主张会被阻止'
);
select throws_ok(
  $$update public.demos set source_code_status = 'open_source' where id = '00000000-0000-0000-0000-000000000401'$$,
  '23514',
  '已发布案例的源码状态必须与仓库链接和开源证据一致',
  '公开案例不能在缺少仓库和开源证据时声明开源'
);
select throws_ok(
  $$update public.demos set source_code_status = 'not_disclosed' where id = '00000000-0000-0000-0000-000000000401'$$,
  '23514',
  'new row for relation "demos" violates check constraint "demos_published_content_complete"',
  '公开案例不能把源码状态改回未披露'
);
select throws_ok(
  $$insert into public.demo_links (demo_id, link_type, label, url, source_platform, is_canonical, last_verified_at) values ('00000000-0000-0000-0000-000000000401', 'repository', '冲突仓库', 'https://example.test/repository', 'GitHub', false, timestamptz '2026-07-16 00:00:00+00')$$,
  '23514',
  '已发布案例的源码状态必须与仓库链接和开源证据一致',
  '闭源案例不能保留仓库链接'
);
set constraints all deferred;

select pg_temp.insert_complete_draft(
  '00000000-0000-0000-0000-000000000411',
  'mismatched-open-source-evidence'
);
select pg_temp.add_verified_publisher('00000000-0000-0000-0000-000000000411');
select pg_temp.add_approved_preview(
  '00000000-0000-0000-0000-000000000411',
  '00000000-0000-0000-0000-000000000511',
  'mismatched-open-source-evidence'
);
select pg_temp.add_primary_claims('00000000-0000-0000-0000-000000000411');
insert into public.demo_links (
  demo_id,
  link_type,
  label,
  url,
  source_platform,
  is_canonical,
  last_verified_at
)
values (
  '00000000-0000-0000-0000-000000000411',
  'repository',
  '官方仓库',
  'https://example.test/source-repository',
  'GitHub',
  true,
  timestamptz '2026-07-16 00:00:00+00'
);
insert into public.demo_evidence (
  demo_id,
  evidence_type,
  description,
  source_url,
  verified_at
)
values (
  '00000000-0000-0000-0000-000000000411',
  'open_source',
  '这条证据故意指向另一地址。',
  'https://example.test/unrelated-evidence',
  timestamptz '2026-07-16 00:00:00+00'
);
update public.demos
set source_code_status = 'open_source'
where id = '00000000-0000-0000-0000-000000000411';
set constraints all immediate;
select throws_ok(
  $$update public.demos set status = 'published' where id = '00000000-0000-0000-0000-000000000411'$$,
  '23514',
  '已发布案例的源码状态必须与仓库链接和开源证据一致',
  '开源证据必须与规范仓库指向同一地址'
);
set constraints all deferred;

select pg_temp.insert_complete_draft(
  '00000000-0000-0000-0000-000000000404',
  'missing-preview'
);
select pg_temp.add_verified_publisher('00000000-0000-0000-0000-000000000404');
select pg_temp.add_primary_claims('00000000-0000-0000-0000-000000000404');
set constraints all immediate;
select throws_ok(
  $$update public.demos set status = 'published' where id = '00000000-0000-0000-0000-000000000404'$$,
  '23514',
  '已发布案例必须保留至少一份获准使用的真实产品展示媒体',
  '立即校验模式下拒绝发布缺少真实产品展示媒体的案例'
);

select pg_temp.insert_complete_draft(
  '00000000-0000-0000-0000-000000000405',
  'media-gate'
);
select pg_temp.add_verified_publisher('00000000-0000-0000-0000-000000000405');
select pg_temp.add_approved_preview(
  '00000000-0000-0000-0000-000000000405',
  '00000000-0000-0000-0000-000000000505',
  'media-gate-first'
);
select pg_temp.add_primary_claims('00000000-0000-0000-0000-000000000405');
update public.demos
set status = 'published'
where id = '00000000-0000-0000-0000-000000000405';

select throws_ok(
  $$delete from public.demo_media where id = '00000000-0000-0000-0000-000000000505'$$,
  '23514',
  '已发布案例必须保留至少一份获准使用的真实产品展示媒体',
  '删除最后一份产品展示媒体会被阻止'
);
select throws_ok(
  $$update public.demo_media set authorization_status = 'pending' where id = '00000000-0000-0000-0000-000000000505'$$,
  '23514',
  '已发布案例必须保留至少一份获准使用的真实产品展示媒体',
  '降级最后一份产品展示媒体会被阻止'
);

set constraints all deferred;
select pg_temp.add_approved_preview(
  '00000000-0000-0000-0000-000000000405',
  '00000000-0000-0000-0000-000000000506',
  'media-gate-replacement'
);
delete from public.demo_media
where id = '00000000-0000-0000-0000-000000000505';
set constraints all immediate;
select is(
  (
    select pg_catalog.count(*)
    from public.demo_media
    where demo_id = '00000000-0000-0000-0000-000000000405'
      and role = 'product_preview'
      and authorization_status = 'approved'
  ),
  1::bigint,
  '同一事务先补合格媒体再删除旧媒体可以提交'
);

set constraints all deferred;
update public.demos
set status = 'archived'
where id = '00000000-0000-0000-0000-000000000405';
delete from public.demo_media
where id = '00000000-0000-0000-0000-000000000506';
set constraints all immediate;
select ok(
  not public.is_demo_public('00000000-0000-0000-0000-000000000405'),
  '同一事务先撤下案例后可以删除最后一份展示媒体'
);

set constraints all immediate;
select throws_ok(
  $$delete from public.demo_publishers where demo_id = '00000000-0000-0000-0000-000000000401'$$,
  '23514',
  '已发布案例必须保留与发布方地区一致的已核验发布方',
  '删除最后一条匹配发布方会被阻止'
);
select throws_ok(
  $$update public.demo_publishers set region = 'mainland_china' where demo_id = '00000000-0000-0000-0000-000000000401'$$,
  '23514',
  '已发布案例必须保留与发布方地区一致的已核验发布方',
  '把最后一条发布方改成不匹配地区会被阻止'
);
set constraints all deferred;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000101', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select throws_ok(
  $$insert into public.categories (slug, name_zh) values ('forged-admin-write', '越权写入')$$,
  '42501',
  'permission denied for table categories',
  '普通登录用户不能写内容表'
);
reset role;

set local role service_role;
select lives_ok(
  $$insert into public.categories (slug, name_zh) values ('admin-write-test', '管理写入测试')$$,
  '受控管理角色可以写内容表'
);
reset role;

do $$
declare
  item integer;
  demo_identifier uuid;
begin
  for item in 1..13 loop
    demo_identifier := pg_catalog.gen_random_uuid();
    perform pg_temp.insert_complete_draft(demo_identifier, 'page-demo-' || item::text);
    perform pg_temp.add_verified_publisher(demo_identifier);
    perform pg_temp.add_approved_preview(
      demo_identifier,
      pg_catalog.gen_random_uuid(),
      'page-demo-' || item::text
    );
    perform pg_temp.add_primary_claims(demo_identifier);
    update public.demos set status = 'published' where id = demo_identifier;
  end loop;
end;
$$;

set local role anon;
select is(
  (select pg_catalog.count(*) from public.search_demos('page-demo-', null, null, null, null, 'newest', 1)),
  12::bigint,
  '搜索第一页固定最多返回 12 条'
);
select is(
  (select pg_catalog.count(*) from public.search_demos('page-demo-', null, null, null, null, 'newest', 2)),
  1::bigint,
  '搜索第二页返回剩余结果且分页稳定'
);
select is(
  (
    select pg_catalog.min(total_count)
    from public.search_demos('page-demo-', null, null, null, null, 'editor-pick', 1)
  ),
  13::bigint,
  '搜索结果附带过滤后的完整总数'
);
reset role;

do $$
declare
  item integer;
  demo_identifier uuid;
begin
  for item in 1..4 loop
    demo_identifier := pg_catalog.gen_random_uuid();
    perform pg_temp.insert_complete_draft(
      demo_identifier,
      'sort-demo-' || item::text
    );
    perform pg_temp.add_verified_publisher(demo_identifier);
    perform pg_temp.add_approved_preview(
      demo_identifier,
      pg_catalog.gen_random_uuid(),
      'sort-demo-' || item::text
    );
    perform pg_temp.add_primary_claims(demo_identifier);
    update public.demos
    set status = 'published'
    where id = demo_identifier;
  end loop;
end;
$$;

update public.demos
set
  published_at = case slug
    when 'sort-demo-1' then timestamptz '2026-07-16 04:00:00+00'
    when 'sort-demo-2' then timestamptz '2026-07-16 03:00:00+00'
    when 'sort-demo-3' then timestamptz '2026-07-16 02:00:00+00'
    when 'sort-demo-4' then timestamptz '2026-07-16 01:00:00+00'
  end,
  commercial_potential_score = case slug
    when 'sort-demo-1' then 1
    when 'sort-demo-2' then 4
    when 'sort-demo-3' then 3
    when 'sort-demo-4' then 2
  end,
  editor_pick_rank = case slug
    when 'sort-demo-1' then 3
    when 'sort-demo-2' then 2
    when 'sort-demo-3' then 1
    when 'sort-demo-4' then 4
  end
where slug like 'sort-demo-%';

insert into public.favorites (user_id, demo_id)
select '00000000-0000-0000-0000-000000000101', id
from public.demos
where slug = 'sort-demo-4';

set local role anon;
select results_eq(
  $$select slug from public.search_demos('sort-demo-', null, null, null, null, 'newest', 1)$$,
  $$values ('sort-demo-1'::text), ('sort-demo-2'::text), ('sort-demo-3'::text), ('sort-demo-4'::text)$$,
  '最新排序按发布时间倒序且顺序稳定'
);
select results_eq(
  $$select slug from public.search_demos('sort-demo-', null, null, null, null, 'commercial-potential', 1)$$,
  $$values ('sort-demo-2'::text), ('sort-demo-3'::text), ('sort-demo-4'::text), ('sort-demo-1'::text)$$,
  '商业潜力排序按编辑分数倒序且顺序稳定'
);
select results_eq(
  $$select slug from public.search_demos('sort-demo-', null, null, null, null, 'most-favorited', 1)$$,
  $$values ('sort-demo-4'::text), ('sort-demo-1'::text), ('sort-demo-2'::text), ('sort-demo-3'::text)$$,
  '收藏排序使用真实收藏关系计数且顺序稳定'
);
select results_eq(
  $$select slug from public.search_demos('sort-demo-', null, null, null, null, 'editor-pick', 1)$$,
  $$values ('sort-demo-3'::text), ('sort-demo-2'::text), ('sort-demo-1'::text), ('sort-demo-4'::text)$$,
  '编辑精选排序按明确名次升序且顺序稳定'
);
reset role;

select extensions.dblink_connect(
  'favorite_concurrency_setup',
  pg_temp.local_dblink_connection()
);
select extensions.dblink_exec(
  'favorite_concurrency_setup',
  $setup$
    delete from public.demos
    where id = '00000000-0000-0000-0000-000000000407';
    delete from auth.users
    where id in (
      '00000000-0000-0000-0000-000000000107',
      '00000000-0000-0000-0000-000000000108'
    );
    delete from public.categories
    where id = '00000000-0000-0000-0000-000000000207';

    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    values
      (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000107',
        'authenticated',
        'authenticated',
        'concurrent-first@example.test',
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{}'::jsonb,
        now(),
        now()
      ),
      (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000108',
        'authenticated',
        'authenticated',
        'concurrent-second@example.test',
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{}'::jsonb,
        now(),
        now()
      );

    insert into public.categories (id, slug, name_zh, sort_order)
    values (
      '00000000-0000-0000-0000-000000000207',
      'concurrency-test',
      '并发测试分类',
      1007
    );

    insert into public.demos (
      id,
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
      difficulty
    )
    values (
      '00000000-0000-0000-0000-000000000407',
      'favorite-concurrency-test',
      '收藏并发测试',
      '只用于本地数据库并发验证',
      '两个独立连接同时写入不同用户对同一案例的收藏。',
      '00000000-0000-0000-0000-000000000207',
      'draft',
      'product',
      'concept',
      'unknown',
      'not_disclosed',
      'beginner'
    );
  $setup$
);
select extensions.dblink_disconnect('favorite_concurrency_setup');

select extensions.dblink_connect(
  'favorite_writer_a',
  pg_temp.local_dblink_connection('favorite_writer_a')
);
select extensions.dblink_connect(
  'favorite_writer_b',
  pg_temp.local_dblink_connection('favorite_writer_b')
);

create temporary table favorite_concurrency_pids (
  writer text primary key,
  pid integer not null
) on commit drop;

insert into pg_temp.favorite_concurrency_pids (writer, pid)
select 'favorite_writer_a', remote.pid
from extensions.dblink(
  'favorite_writer_a',
  'select pg_catalog.pg_backend_pid()'
) as remote(pid integer)
union all
select 'favorite_writer_b', remote.pid
from extensions.dblink(
  'favorite_writer_b',
  'select pg_catalog.pg_backend_pid()'
) as remote(pid integer);

create function pg_temp.wait_until_blocked(
  p_blocked_pid integer,
  p_blocking_pid integer,
  p_max_attempts integer
)
returns boolean
language plpgsql
as $$
declare
  current_attempt integer;
begin
  for current_attempt in 1..p_max_attempts loop
    if p_blocking_pid = any(pg_catalog.pg_blocking_pids(p_blocked_pid)) then
      return true;
    end if;

    perform pg_catalog.pg_sleep(0.01);
  end loop;

  return false;
end;
$$;

select extensions.dblink_exec('favorite_writer_a', 'begin');
select extensions.dblink_exec(
  'favorite_writer_a',
  $writer_a$
    insert into public.favorites (user_id, demo_id)
    values (
      '00000000-0000-0000-0000-000000000107',
      '00000000-0000-0000-0000-000000000407'
    )
  $writer_a$
);
select extensions.dblink_send_query(
  'favorite_writer_b',
  $writer_b$
    insert into public.favorites (user_id, demo_id)
    values (
      '00000000-0000-0000-0000-000000000108',
      '00000000-0000-0000-0000-000000000407'
    )
    returning user_id
  $writer_b$
);
select ok(
  pg_temp.wait_until_blocked(
    (
      select pid
      from pg_temp.favorite_concurrency_pids
      where writer = 'favorite_writer_b'
    ),
    (
      select pid
      from pg_temp.favorite_concurrency_pids
      where writer = 'favorite_writer_a'
    ),
    200
  ),
  '第二个写入连接确定被第一个事务阻塞在案例行锁'
);
select extensions.dblink_exec('favorite_writer_a', 'commit');
select *
from extensions.dblink_get_result('favorite_writer_b') as writer_b_result(user_id uuid);
select *
from extensions.dblink_get_result('favorite_writer_b') as writer_b_drained(user_id uuid);
select extensions.dblink_disconnect('favorite_writer_a');
select extensions.dblink_disconnect('favorite_writer_b');

select is(
  (
    select favorites_count
    from public.demos
    where id = '00000000-0000-0000-0000-000000000407'
  ),
  2,
  '两个独立连接并发收藏同一案例后原子计数为 2'
);
select is(
  (
    select pg_catalog.count(*)
    from public.favorites
    where demo_id = '00000000-0000-0000-0000-000000000407'
  ),
  2::bigint,
  '并发收藏后的计数与两条真实关系一致'
);

select extensions.dblink_connect(
  'favorite_concurrency_cleanup',
  pg_temp.local_dblink_connection()
);
select extensions.dblink_exec(
  'favorite_concurrency_cleanup',
  $cleanup$
    delete from public.demos
    where id = '00000000-0000-0000-0000-000000000407';
    delete from auth.users
    where id in (
      '00000000-0000-0000-0000-000000000107',
      '00000000-0000-0000-0000-000000000108'
    );
    delete from public.categories
    where id = '00000000-0000-0000-0000-000000000207';
  $cleanup$
);
select extensions.dblink_disconnect('favorite_concurrency_cleanup');

update public.demos
set status = 'archived'
where id = '00000000-0000-0000-0000-000000000401';
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000102', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select results_eq(
  $$select is_favorited, favorite_count from public.set_favorite('00000000-0000-0000-0000-000000000401', false)$$,
  $$values (false, null::integer)$$,
  '案例撤下后用户仍能删除自己的旧收藏关系'
);
reset role;
select is(
  (select favorites_count from public.demos where id = '00000000-0000-0000-0000-000000000401'),
  0,
  '撤下案例取消最后一个收藏后计数归零'
);

select is(
  (
    select pg_catalog.count(*)
    from public.demos
    where slug = any(array[
      'roomgpt',
      'cogvideo',
      'funclip',
      'presenton',
      'pptagent',
      'novel',
      'open-notebook',
      'postiz',
      'opengame',
      'restorephotos',
      'maxkb',
      'anythingllm'
    ])
      and status = 'published'
  ),
  12::bigint,
  '首发 12 个案例全部通过发布门禁'
);

select is(
  (
    select pg_catalog.count(*)
    from public.demos
    where slug = any(array[
      'roomgpt', 'cogvideo', 'funclip', 'presenton', 'pptagent', 'novel',
      'open-notebook', 'postiz', 'opengame', 'restorephotos', 'maxkb', 'anythingllm'
    ])
      and source_code_status = 'open_source'
  ),
  12::bigint,
  '首发 12 个案例都显式标记为开源'
);

select is(
  (
    select pg_catalog.count(*)
    from public.demos
    where slug = any(array[
      'roomgpt', 'cogvideo', 'funclip', 'presenton', 'pptagent', 'novel',
      'open-notebook', 'postiz', 'opengame', 'restorephotos', 'maxkb', 'anythingllm'
    ])
      and public.has_consistent_source_code_status(id)
  ),
  12::bigint,
  '首发 12 个开源声明都有仓库链接和开源证据'
);

select is(
  (
    select pg_catalog.count(*)
    from public.demos
    where slug = any(array[
      'roomgpt', 'cogvideo', 'funclip', 'presenton', 'pptagent', 'novel',
      'open-notebook', 'postiz', 'opengame', 'restorephotos', 'maxkb', 'anythingllm'
    ])
      and public.has_complete_primary_claims(id)
  ),
  12::bigint,
  '首发 12 个案例都覆盖 11 个详情区块的主要主张'
);

select is(
  (
    select pg_catalog.count(*)
    from public.demo_claims as claim
    join public.demos as demo on demo.id = claim.demo_id
    where demo.slug = any(array[
      'roomgpt', 'cogvideo', 'funclip', 'presenton', 'pptagent', 'novel',
      'open-notebook', 'postiz', 'opengame', 'restorephotos', 'maxkb', 'anythingllm'
    ])
      and claim.is_primary
  ),
  132::bigint,
  '首发内容恰好包含 12 乘 11 条主要主张'
);

select is(
  (
    select pg_catalog.count(*)
    from public.demo_claims as claim
    join public.demos as demo on demo.id = claim.demo_id
    where demo.slug = any(array[
      'roomgpt', 'cogvideo', 'funclip', 'presenton', 'pptagent', 'novel',
      'open-notebook', 'postiz', 'opengame', 'restorephotos', 'maxkb', 'anythingllm'
    ])
      and claim.is_primary
      and claim.section = 'technical_implementation'
      and claim.claim_type = 'editorial_inference'
      and claim.source_url is null
      and claim.verified_at is null
  ),
  12::bigint,
  '首发技术实现全部明确标记为编辑推断而不是已核验事实'
);

select cmp_ok(
  (
    select pg_catalog.count(*)
    from public.demo_claims as claim
    join public.demos as demo on demo.id = claim.demo_id
    where demo.slug = any(array[
      'roomgpt', 'cogvideo', 'funclip', 'presenton', 'pptagent', 'novel',
      'open-notebook', 'postiz', 'opengame', 'restorephotos', 'maxkb', 'anythingllm'
    ])
  ),
  '>=',
  168::bigint,
  '首发内容在 132 条主要主张外至少保留 36 条补充主张'
);

set constraints all immediate;
select throws_ok(
  $$delete from public.demo_links where demo_id = (select id from public.demos where slug = 'roomgpt') and link_type = 'repository'$$,
  '23514',
  '已发布案例的源码状态必须与仓库链接和开源证据一致',
  '删除开源案例的最后一条仓库链接会被阻止'
);
select throws_ok(
  $$delete from public.demo_evidence where demo_id = (select id from public.demos where slug = 'roomgpt') and evidence_type = 'open_source'$$,
  '23514',
  '已发布案例的源码状态必须与仓库链接和开源证据一致',
  '删除开源案例的最后一条开源证据会被阻止'
);
set constraints all deferred;

select is(
  (
    select pg_catalog.count(distinct category.slug)
    from public.demos as demo
    join public.categories as category on category.id = demo.category_id
    where demo.slug = any(array[
      'roomgpt', 'cogvideo', 'funclip', 'presenton', 'pptagent', 'novel',
      'open-notebook', 'postiz', 'opengame', 'restorephotos', 'maxkb', 'anythingllm'
    ])
  ),
  10::bigint,
  '首发案例覆盖约定的 10 个方向'
);

select is(
  (
    select pg_catalog.count(*)
    from public.demos
    where slug = any(array[
      'roomgpt', 'cogvideo', 'funclip', 'presenton', 'pptagent', 'novel',
      'open-notebook', 'postiz', 'opengame', 'restorephotos', 'maxkb', 'anythingllm'
    ])
      and publisher_region = 'mainland_china'
  ),
  4::bigint,
  '首发内容包含 4 个国内发布方案例'
);

select is(
  (
    select pg_catalog.count(*)
    from public.demos
    where slug = any(array[
      'roomgpt', 'cogvideo', 'funclip', 'presenton', 'pptagent', 'novel',
      'open-notebook', 'postiz', 'opengame', 'restorephotos', 'maxkb', 'anythingllm'
    ])
      and publisher_region = 'international'
  ),
  8::bigint,
  '首发内容包含 8 个海外发布方案例'
);

select is(
  (
    select pg_catalog.count(distinct demo.id)
    from public.demo_media as media
    join public.demos as demo on demo.id = media.demo_id
    where demo.slug = any(array[
      'roomgpt', 'cogvideo', 'funclip', 'presenton', 'pptagent', 'novel',
      'open-notebook', 'postiz', 'opengame', 'restorephotos', 'maxkb', 'anythingllm'
    ])
      and media.role = 'cover'
      and media.authorization_status = 'approved'
      and media.is_original
      and media.is_abstract
  ),
  12::bigint,
  '每个首发案例都有一张获准使用的原创抽象封面'
);

select is(
  (
    select pg_catalog.count(distinct demo.id)
    from public.demo_media as media
    join public.demos as demo on demo.id = media.demo_id
    where demo.slug = any(array[
      'roomgpt', 'cogvideo', 'funclip', 'presenton', 'pptagent', 'novel',
      'open-notebook', 'postiz', 'opengame', 'restorephotos', 'maxkb', 'anythingllm'
    ])
      and media.role = 'product_preview'
      and media.authorization_status = 'approved'
      and not media.is_abstract
      and (media.captured_by_site or media.explicit_permission)
  ),
  12::bigint,
  '每个首发案例都有一份获准使用的真实产品预览'
);

select is(
  (select status from public.demos where slug = 'colorsnap'),
  'draft',
  'ColorSnap 未达到事实门槛前保持草稿'
);

select is(
  (select source_code_status from public.demos where slug = 'colorsnap'),
  'closed_source',
  'ColorSnap 明确标记为闭源而不是未披露'
);

select is(
  (select ai_implementation from public.demos where slug = 'colorsnap'),
  '当前没有 AI 能力；“共鸣分”来自 CIEDE2000 色差计算，不是模型推理。',
  'ColorSnap 明确说明当前没有 AI 能力'
);

select is(
  (select truth_boundary from public.demos where slug = 'colorsnap'),
  '{"implemented":["每日抽取色卡","现实寻色与模拟拍摄","手动取色与 CIEDE2000 比色","色卡收藏与分享"],"simulated":["地图与附近用户","交换与发布","定位和社区互动"],"not_implemented":["AI 模型调用","真实账号与后端数据库","支付与商业化","真实用户、留存或收入验证"]}'::jsonb,
  'ColorSnap 完整区分已实现、模拟和未实现边界'
);

select * from finish();
rollback;
