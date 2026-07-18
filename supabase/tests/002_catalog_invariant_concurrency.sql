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
  'catalog_invariant_setup',
  pg_temp.local_dblink_connection()
);
select extensions.dblink_exec(
  'catalog_invariant_setup',
  $catalog_setup$
    insert into public.demo_evidence (
      demo_id,
      evidence_type,
      description,
      source_url,
      verified_at
    )
    select
      id,
      'open_source',
      '并发发布门禁测试的第二份开源证据。',
      'https://example.test/concurrent-repository',
      timestamptz '2026-07-16 00:00:00+00'
    from public.demos
    where slug = 'roomgpt';

    insert into public.demo_links (
      demo_id,
      link_type,
      label,
      url,
      source_platform,
      is_canonical,
      last_verified_at
    )
    select
      id,
      'repository',
      '并发测试仓库',
      'https://example.test/concurrent-repository',
      'GitHub',
      true,
      timestamptz '2026-07-16 00:00:00+00'
    from public.demos
    where slug = 'roomgpt';
  $catalog_setup$
);
select extensions.dblink_disconnect('catalog_invariant_setup');

select extensions.dblink_connect(
  'catalog_writer_a',
  pg_temp.local_dblink_connection('catalog_writer_a')
);
select extensions.dblink_connect(
  'catalog_writer_b',
  pg_temp.local_dblink_connection('catalog_writer_b')
);

create temporary table catalog_invariant_pids (
  writer text primary key,
  pid integer not null
);

insert into pg_temp.catalog_invariant_pids (writer, pid)
select 'catalog_writer_a', remote.pid
from extensions.dblink(
  'catalog_writer_a',
  'select pg_catalog.pg_backend_pid()'
) as remote(pid integer)
union all
select 'catalog_writer_b', remote.pid
from extensions.dblink(
  'catalog_writer_b',
  'select pg_catalog.pg_backend_pid()'
) as remote(pid integer);

select extensions.dblink_exec('catalog_writer_a', 'begin');
select extensions.dblink_exec(
  'catalog_writer_a',
  $catalog_writer_a$
    delete from public.demo_links
    where demo_id = (select id from public.demos where slug = 'roomgpt')
      and url = 'https://example.test/concurrent-repository'
  $catalog_writer_a$
);
select extensions.dblink_exec('catalog_writer_b', 'begin');
select extensions.dblink_send_query(
  'catalog_writer_b',
  $catalog_writer_b$
    delete from public.demo_links
    where demo_id = (select id from public.demos where slug = 'roomgpt')
      and url = (select primary_source_url from public.demos where slug = 'roomgpt')
    returning url
  $catalog_writer_b$
);
select ok(
  pg_temp.wait_until_blocked(
    (
      select pid
      from pg_temp.catalog_invariant_pids
      where writer = 'catalog_writer_b'
    ),
    (
      select pid
      from pg_temp.catalog_invariant_pids
      where writer = 'catalog_writer_a'
    ),
    200
  ),
  '第二个目录写入确定被第一个事务阻塞在同一案例父行锁'
);
select extensions.dblink_exec('catalog_writer_a', 'commit');
select *
from extensions.dblink_get_result('catalog_writer_b') as catalog_writer_b_result(url text);
select *
from extensions.dblink_get_result('catalog_writer_b') as catalog_writer_b_drained(url text);
select is(
  extensions.dblink_exec('catalog_writer_b', 'set constraints all immediate', false),
  'ERROR',
  '后提交事务在新快照中看到最后仓库已被删除并被发布门禁拒绝'
);
select extensions.dblink_exec('catalog_writer_b', 'rollback');
select extensions.dblink_disconnect('catalog_writer_a');
select extensions.dblink_disconnect('catalog_writer_b');

select is(
  (
    select pg_catalog.count(*)
    from public.demo_links
    where demo_id = (select id from public.demos where slug = 'roomgpt')
      and link_type = 'repository'
  ),
  1::bigint,
  '并发删除后仍保留一条与开源证据一致的规范仓库'
);
select ok(
  public.is_demo_public((select id from public.demos where slug = 'roomgpt')),
  '并发冲突后 RoomGPT 仍满足公开门禁'
);

select extensions.dblink_connect(
  'catalog_invariant_cleanup',
  pg_temp.local_dblink_connection()
);
select extensions.dblink_exec(
  'catalog_invariant_cleanup',
  $catalog_cleanup$
    delete from public.demo_evidence
    where demo_id = (select id from public.demos where slug = 'roomgpt')
      and source_url = 'https://example.test/concurrent-repository'
  $catalog_cleanup$
);
select extensions.dblink_disconnect('catalog_invariant_cleanup');

select is(
  (
    select pg_catalog.count(*)
    from public.demo_evidence
    where demo_id = (select id from public.demos where slug = 'roomgpt')
      and source_url = 'https://example.test/concurrent-repository'
  ),
  0::bigint,
  '并发测试清理后没有残留额外证据'
);

select * from finish();
