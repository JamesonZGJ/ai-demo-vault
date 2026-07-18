create extension if not exists pgtap with schema extensions;
create extension if not exists dblink with schema extensions;
set search_path = public, extensions;

select no_plan();

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

select extensions.dblink_connect(
  'blueprint_pilot_setup',
  pg_temp.local_dblink_connection()
);
select extensions.dblink_exec(
  'blueprint_pilot_setup',
  $setup$
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
    values (
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000703',
      'authenticated',
      'authenticated',
      'blueprint-concurrent@example.test',
      extensions.crypt('database-test-password', extensions.gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now()
    )
    on conflict (id) do nothing
  $setup$
);
select extensions.dblink_disconnect('blueprint_pilot_setup');

select extensions.dblink_connect(
  'blueprint_pilot_a',
  pg_temp.local_dblink_connection('blueprint_pilot_a')
);
select extensions.dblink_connect(
  'blueprint_pilot_b',
  pg_temp.local_dblink_connection('blueprint_pilot_b')
);

create temporary table blueprint_pilot_pids (
  writer text primary key,
  pid integer not null
);
insert into pg_temp.blueprint_pilot_pids (writer, pid)
select 'a', remote.pid
from extensions.dblink(
  'blueprint_pilot_a',
  'select pg_catalog.pg_backend_pid()'
) as remote(pid integer)
union all
select 'b', remote.pid
from extensions.dblink(
  'blueprint_pilot_b',
  'select pg_catalog.pg_backend_pid()'
) as remote(pid integer);

select extensions.dblink_exec('blueprint_pilot_a', 'begin');
select extensions.dblink_exec('blueprint_pilot_a', 'set role authenticated');
select extensions.dblink_exec(
  'blueprint_pilot_a',
  $$set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000703'$$
);
select extensions.dblink_exec('blueprint_pilot_b', 'begin');
select extensions.dblink_exec('blueprint_pilot_b', 'set role authenticated');
select extensions.dblink_exec(
  'blueprint_pilot_b',
  $$set request.jwt.claim.sub = '00000000-0000-0000-0000-000000000703'$$
);

create temporary table blueprint_pilot_results (
  writer text primary key,
  grant_id uuid not null
);
insert into pg_temp.blueprint_pilot_results (writer, grant_id)
select 'a', remote.grant_id
from extensions.dblink(
  'blueprint_pilot_a',
  $$select public.claim_blueprint_pilot('colorsnap-blueprint')$$
) as remote(grant_id uuid);

select extensions.dblink_send_query(
  'blueprint_pilot_b',
  $$select public.claim_blueprint_pilot('colorsnap-blueprint')$$
);
select ok(
  pg_temp.wait_until_blocked(
    (select pid from pg_temp.blueprint_pilot_pids where writer = 'b'),
    (select pid from pg_temp.blueprint_pilot_pids where writer = 'a'),
    200
  ),
  '第二个试用获取确定被唯一访问权写入阻塞'
);

select extensions.dblink_exec('blueprint_pilot_a', 'commit');
insert into pg_temp.blueprint_pilot_results (writer, grant_id)
select 'b', remote.grant_id
from extensions.dblink_get_result('blueprint_pilot_b') as remote(grant_id uuid);
select *
from extensions.dblink_get_result('blueprint_pilot_b') as drained(grant_id uuid);
select extensions.dblink_exec('blueprint_pilot_b', 'commit');

select is(
  (select pg_catalog.count(*) from pg_temp.blueprint_pilot_results),
  2::bigint,
  '两个并发调用都返回访问权'
);
select is(
  (select pg_catalog.count(distinct grant_id) from pg_temp.blueprint_pilot_results),
  1::bigint,
  '两个并发调用返回同一访问权 ID'
);
select is(
  (
    select pg_catalog.count(*)
    from public.blueprint_access_grants
    where user_id = '00000000-0000-0000-0000-000000000703'
  ),
  1::bigint,
  '并发获取后数据库只保留一条访问权'
);

select extensions.dblink_disconnect('blueprint_pilot_a');
select extensions.dblink_disconnect('blueprint_pilot_b');

select extensions.dblink_connect(
  'blueprint_pilot_cleanup',
  pg_temp.local_dblink_connection()
);
select extensions.dblink_exec(
  'blueprint_pilot_cleanup',
  $$delete from auth.users where id = '00000000-0000-0000-0000-000000000703'$$
);
select extensions.dblink_disconnect('blueprint_pilot_cleanup');

select is(
  (
    select pg_catalog.count(*)
    from public.blueprint_access_grants
    where user_id = '00000000-0000-0000-0000-000000000703'
  ),
  0::bigint,
  '并发测试清理后没有残留访问权'
);

select * from finish();
