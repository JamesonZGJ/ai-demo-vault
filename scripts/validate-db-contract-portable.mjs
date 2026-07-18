import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { PGlite } from "@electric-sql/pglite"
import { pgtap } from "@electric-sql/pglite/pgtap"

const root = process.cwd()
const [
  migrationSource,
  productionBaseMigration,
  productionContentMigration,
  blueprintFoundationMigration,
  blueprintPilotMigration,
  blueprintScoreTimelineMigration,
  blueprintPilotSeed,
  contractSource,
  blueprintPilotContract,
] = await Promise.all([
  readFile(
    path.join(root, "supabase/migrations/20260716000100_initial_catalog.sql"),
    "utf8",
  ),
  readFile(
    path.join(root, "supabase/migrations/20260716000200_base_catalog_content.sql"),
    "utf8",
  ),
  readFile(
    path.join(root, "supabase/migrations/20260716000300_launch_catalog_content.sql"),
    "utf8",
  ),
  readFile(
    path.join(root, "supabase/migrations/20260717000100_blueprint_marketplace_foundation.sql"),
    "utf8",
  ),
  readFile(
    path.join(root, "supabase/migrations/20260717000200_colorsnap_pilot_access.sql"),
    "utf8",
  ),
  readFile(
    path.join(root, "supabase/migrations/20260718000100_blueprint_score_timeline.sql"),
    "utf8",
  ),
  readFile(path.join(root, "supabase/seed_blueprint_pilot.sql"), "utf8"),
  readFile(path.join(root, "supabase/tests/001_database_contract.sql"), "utf8"),
  readFile(path.join(root, "supabase/tests/003_blueprint_pilot.sql"), "utf8"),
])

const migration = migrationSource.replace(
  /^create extension if not exists pgcrypto with schema extensions;\r?\n\r?\n/u,
  "",
)

const withoutDblinkExtension = contractSource.replace(
  /create extension if not exists dblink with schema extensions;\r?\n/u,
  "",
)
const concurrencyBlock = /select extensions\.dblink_connect\(\s*'favorite_concurrency_setup'[\s\S]*?select extensions\.dblink_disconnect\('favorite_concurrency_cleanup'\);\r?\n/u
if (!concurrencyBlock.test(withoutDblinkExtension)) {
  throw new Error("未找到应由正式 PostgreSQL 执行的 dblink 并发测试块")
}
const portableContract = withoutDblinkExtension.replace(concurrencyBlock, "")

const supabasePrelude = `
  create schema extensions;
  create schema auth;
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  grant usage on schema extensions, auth
  to anon, authenticated, service_role;
  create table auth.users (
    instance_id uuid,
    id uuid primary key,
    aud text,
    role text,
    email text,
    encrypted_password text,
    email_confirmed_at timestamptz,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    created_at timestamptz,
    updated_at timestamptz
  );
  create function auth.uid()
  returns uuid
  language sql
  stable
  as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
  create function extensions.gen_salt(text)
  returns text
  language sql
  immutable
  as $$ select 'portable-pgtap-salt'::text $$;
  create function extensions.crypt(text, text)
  returns text
  language sql
  immutable
  as $$ select md5($1 || $2) $$;
`

const db = new PGlite({ extensions: { pgtap } })

try {
  await db.exec(supabasePrelude)
  await db.exec(migration)
  await db.exec(productionBaseMigration)
  await db.exec(productionContentMigration)
  await db.exec(blueprintFoundationMigration)
  await db.exec(blueprintPilotMigration)
  await db.exec(blueprintScoreTimelineMigration)
  await db.exec(blueprintPilotSeed)

  const results = [
    ...(await db.exec(portableContract)),
    ...(await db.exec(blueprintPilotContract)),
  ]
  const tapLines = results.flatMap(({ rows }) =>
    rows.flatMap((row) => Object.values(row).filter((value) => typeof value === "string")),
  )
  const failures = tapLines.filter((line) => /^not ok\b/u.test(line))
  if (failures.length > 0) {
    throw new Error(`便携 pgTAP 失败：\n${failures.join("\n")}`)
  }

  const passed = tapLines.filter((line) => /^ok\b/u.test(line)).length
  if (passed === 0) {
    throw new Error("便携 pgTAP 未产生任何通过断言")
  }

  console.log(
    `便携 pgTAP 通过：${passed} 项；真实 dblink 多连接并发仍须由 Supabase Local PostgreSQL 执行。`,
  )
} finally {
  await db.close()
}
