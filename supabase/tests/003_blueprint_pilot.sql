begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select no_plan();

select has_table('public', 'blueprints', '存在 Blueprint 商品表');
select has_table('public', 'blueprint_demo_links', '存在 Demo 商品关系表');
select has_table('public', 'blueprint_deliverables', '存在公开交付摘要表');
select has_table('public', 'blueprint_resources', '存在私有资料表');
select has_table('public', 'blueprint_access_grants', '存在本地试用访问权表');
select has_table('public', 'blueprint_runtime_flags', '存在数据库本地试用开关');
select has_column('public', 'blueprints', 'product_overview', '商品包含 Product Overview');
select has_column('public', 'blueprints', 'target_users', '商品包含 Target Users');
select has_column('public', 'blueprints', 'problem_statement', '商品包含 Problem');
select has_column('public', 'blueprints', 'solution_statement', '商品包含 Solution');
select has_column('public', 'blueprints', 'feature_map', '商品包含 Feature Map');
select has_column('public', 'blueprints', 'user_flow', '商品包含 User Flow');
select has_column('public', 'blueprints', 'ui_screens', '商品包含 UI Screens');
select has_column('public', 'blueprints', 'blueprint_score', '商品包含 Blueprint Score');
select has_column('public', 'blueprints', 'build_timeline', '商品包含 Build Timeline');
select results_eq(
  $$
    select jsonb_typeof(blueprint_score), jsonb_typeof(build_timeline)
    from public.blueprints
    where slug = 'colorsnap-blueprint'
  $$,
  $$values ('object'::text, 'array'::text)$$,
  'ColorSnap 商品评分是对象、上线计划是数组'
);

select has_function(
  'public',
  'claim_blueprint_pilot',
  array['text'],
  '存在固定签名的 Blueprint 试用获取函数'
);
select ok(
  (select prosecdef from pg_catalog.pg_proc where oid = 'public.claim_blueprint_pilot(text)'::regprocedure),
  '试用获取函数使用 SECURITY DEFINER'
);
select ok(
  coalesce(
    (
      select 'search_path=""' = any(proconfig)
      from pg_catalog.pg_proc
      where oid = 'public.claim_blueprint_pilot(text)'::regprocedure
    ),
    false
  ),
  '试用获取函数固定为空 search_path'
);
select ok(
  not pg_catalog.has_function_privilege('anon', 'public.claim_blueprint_pilot(text)', 'EXECUTE'),
  '游客不能调用试用获取函数'
);

set local role anon;
select is(
  (select pg_catalog.count(*) from public.blueprints),
  1::bigint,
  '本地数据库开关开启时游客只看到一个 Blueprint 样品'
);
select is(
  (select pg_catalog.count(*) from public.blueprint_deliverables),
  7::bigint,
  'ColorSnap 商品页精确公开七类资料摘要'
);
select throws_ok(
  $$select pg_catalog.count(*) from public.blueprint_resources$$,
  '42501',
  'permission denied for table blueprint_resources',
  '游客不能读取资料正文'
);
reset role;

select throws_ok(
  $$
    update public.blueprints
    set pricing_status = 'approved',
        price_minor = 1900,
        currency = 'USD'
    where slug = 'colorsnap-blueprint'
  $$,
  '23514',
  'new row for relation "blueprints" violates check constraint "blueprints_pilot_state_consistent"',
  '数据库拒绝把本地试用商品误配置为已定价商品'
);

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
    '00000000-0000-0000-0000-000000000701',
    'authenticated',
    'authenticated',
    'blueprint-first@example.test',
    extensions.crypt('database-test-password', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000702',
    'authenticated',
    'authenticated',
    'blueprint-second@example.test',
    extensions.crypt('database-test-password', extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000701', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select is(
  (select pg_catalog.count(*) from public.blueprint_resources),
  0::bigint,
  '登录但未获取时不能读取资料正文'
);
select throws_ok(
  $$
    insert into public.blueprint_access_grants (user_id, blueprint_id)
    select auth.uid(), id from public.blueprints limit 1
  $$,
  '42501',
  'permission denied for table blueprint_access_grants',
  '客户端不能直接伪造访问权'
);
select lives_ok(
  $$select public.claim_blueprint_pilot('colorsnap-blueprint')$$,
  '登录用户可以通过窄 RPC 获取本地试用资料'
);
select is(
  (select pg_catalog.count(*) from public.blueprint_access_grants),
  1::bigint,
  '用户只能看到自己的一条访问权'
);
select is(
  (select pg_catalog.count(*) from public.blueprint_resources),
  7::bigint,
  '获得访问权后可以读取七类资料正文'
);
select results_eq(
  $$
    select public.claim_blueprint_pilot('colorsnap-blueprint')
      = public.claim_blueprint_pilot('colorsnap-blueprint')
  $$,
  $$values (true)$$,
  '重复获取幂等返回同一访问权'
);
select is(
  (select pg_catalog.count(*) from public.blueprint_access_grants),
  1::bigint,
  '重复获取不会制造第二条访问权'
);
reset role;

select throws_ok(
  $$
    update public.blueprints
    set pricing_status = 'approved',
        price_minor = 1900,
        currency = 'USD'
    where slug = 'colorsnap-blueprint'
  $$,
  '23514',
  null,
  '本地试用商品不能在未切换销售模式时进入已定价状态'
);
reset role;

update public.blueprints
set status = 'withdrawn',
    access_mode = 'paid_single',
    pricing_status = 'unavailable',
    price_minor = null,
    currency = null
where slug = 'colorsnap-blueprint';

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000701', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select is(
  (select pg_catalog.count(*) from public.blueprint_resources),
  0::bigint,
  '商品退出试用状态后既有访问权不能继续读取资料'
);
select throws_ok(
  $$select public.claim_blueprint_pilot('colorsnap-blueprint')$$,
  'P0002',
  'Blueprint 不存在或不可获取',
  '商品退出试用状态后不能通过 RPC 再次获取'
);
reset role;

update public.blueprints
set status = 'rework_required',
    access_mode = 'pilot_preview',
    pricing_status = 'undecided',
    price_minor = null,
    currency = null
where slug = 'colorsnap-blueprint';

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000702', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select is(
  (select pg_catalog.count(*) from public.blueprint_access_grants),
  0::bigint,
  '另一用户不能读取首个用户的访问权'
);
select is(
  (select pg_catalog.count(*) from public.blueprint_resources),
  0::bigint,
  '另一用户不能借用首个用户的资料权限'
);
reset role;

update public.blueprint_runtime_flags
set local_pilot_enabled = false,
    updated_at = now()
where singleton;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000701', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select is(
  (select pg_catalog.count(*) from public.blueprints),
  0::bigint,
  '数据库试用开关关闭后商品不可见'
);
select is(
  (select pg_catalog.count(*) from public.blueprint_resources),
  0::bigint,
  '数据库试用开关关闭后既有资料也不可读'
);
select throws_ok(
  $$select public.claim_blueprint_pilot('colorsnap-blueprint')$$,
  '55000',
  'Blueprint 本地试用未开启',
  '数据库试用开关关闭后 RPC 失败即停'
);
reset role;

select * from finish();
rollback;
