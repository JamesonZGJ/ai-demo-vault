import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { PGlite } from "@electric-sql/pglite"

const root = process.cwd()
const launchSlugs = [
  "roomgpt",
  "cogvideo",
  "funclip",
  "presenton",
  "pptagent",
  "novel",
  "open-notebook",
  "postiz",
  "opengame",
  "restorephotos",
  "maxkb",
  "anythingllm",
]

const [
  migrationSource,
  productionBaseMigration,
  productionContentMigration,
  baseSeed,
  contentSeed,
  coverManifestSource,
  productManifestSource,
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
  readFile(path.join(root, "supabase/seed.sql"), "utf8"),
  readFile(path.join(root, "supabase/seed_content.sql"), "utf8"),
  readFile(path.join(root, "content/media-rights.json"), "utf8"),
  readFile(path.join(root, "content/product-media-rights.json"), "utf8"),
])

const coverManifest = JSON.parse(coverManifestSource)
const productManifest = JSON.parse(productManifestSource)

assertSourceMirror(productionBaseMigration, baseSeed, "基础内容 migration")
assertSourceMirror(productionContentMigration, contentSeed, "首发内容 migration")

// PGlite 的 PostgreSQL 已内置 gen_random_uuid，但不打包 Supabase 的 pgcrypto 控制文件。
// 这里只移除扩展安装语句；表、函数、RLS、约束和两份 seed 均按生产 SQL 原样执行。
const migration = migrationSource.replace(
  /^create extension if not exists pgcrypto with schema extensions;\r?\n\r?\n/u,
  "",
)

const supabasePrelude = `
  create schema extensions;
  create schema auth;
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin;
  create table auth.users (id uuid primary key);
  create function auth.uid()
  returns uuid
  language sql
  stable
  as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  $$;
`

const db = new PGlite()

try {
  await db.exec(supabasePrelude)
  await db.exec(migration)
  await db.exec(productionBaseMigration)
  await db.exec(productionContentMigration)
  await assertLaunchContract(db)

  // 本地 reset 会在 migrations 后再次执行 seed，结果和更新时间都必须保持不变。
  const observableStateBefore = await launchObservableState(db)
  await db.exec(baseSeed)
  await db.exec(contentSeed)
  await assertLaunchContract(db)
  const observableStateAfter = await launchObservableState(db)
  assertEqual(
    JSON.stringify(observableStateAfter),
    JSON.stringify(observableStateBefore),
    "无内容变化时的案例及关系标识与时间",
  )

  console.log("生产内容 migration 与本地 seed 校验通过：12 个案例、10 个类别、24 份素材，重复执行无重复数据。")
} finally {
  await db.close()
}

async function assertLaunchContract(database) {
  const result = await database.query(
    `
      select
        count(*) filter (where demo.status = 'published')::integer as published_count,
        count(distinct category.slug)::integer as category_count,
        count(*) filter (where public.is_demo_public(demo.id))::integer as public_count,
        count(*) filter (where demo.publisher_region = 'mainland_china')::integer as mainland_count,
        count(*) filter (where demo.publisher_region = 'international')::integer as international_count
      from public.demos as demo
      join public.categories as category on category.id = demo.category_id
      where demo.slug = any($1::text[])
    `,
    [launchSlugs],
  )

  const summary = result.rows[0]
  assertEqual(summary.published_count, 12, "已发布案例数")
  assertEqual(summary.category_count, 10, "覆盖类别数")
  assertEqual(summary.public_count, 12, "通过公开门禁的案例数")
  assertEqual(summary.mainland_count, 4, "国内案例数")
  assertEqual(summary.international_count, 8, "海外案例数")

  const media = await database.query(
    `
      select
        count(*) filter (where media.role = 'cover')::integer as cover_count,
        count(*) filter (where media.role = 'product_preview')::integer as preview_count
      from public.demo_media as media
      join public.demos as demo on demo.id = media.demo_id
      where demo.slug = any($1::text[])
        and media.authorization_status = 'approved'
    `,
    [launchSlugs],
  )

  assertEqual(media.rows[0].cover_count, 12, "获准封面数")
  assertEqual(media.rows[0].preview_count, 12, "获准产品预览数")

  const relationshipRows = await database.query(
    `
      select
        demo.slug,
        (select count(*) from public.demo_publishers where demo_id = demo.id)::integer as publisher_count,
        (select count(*) from public.demo_links where demo_id = demo.id)::integer as link_count,
        (select count(*) from public.demo_claims where demo_id = demo.id)::integer as claim_count,
        (select count(distinct claim_type) from public.demo_claims where demo_id = demo.id)::integer as claim_type_count,
        (select count(*) from public.demo_claims where demo_id = demo.id and is_primary)::integer as primary_claim_count,
        (select count(distinct section) from public.demo_claims where demo_id = demo.id and is_primary)::integer as primary_section_count,
        (select count(*) from public.demo_claims where demo_id = demo.id and is_primary and claim_type = 'fact' and (source_url is null or verified_at is null))::integer as invalid_primary_fact_count,
        (select count(*) from public.demo_evidence where demo_id = demo.id)::integer as evidence_count,
        (select count(*) from public.demo_tools where demo_id = demo.id)::integer as tool_count,
        demo.source_code_status
      from public.demos as demo
      where demo.slug = any($1::text[])
      order by demo.slug
    `,
    [launchSlugs],
  )

  for (const row of relationshipRows.rows) {
    assertAtLeast(row.publisher_count, 1, `${row.slug} 发布方数`)
    assertAtLeast(row.link_count, 1, `${row.slug} 链接数`)
    assertAtLeast(row.claim_count, 14, `${row.slug} 主张数`)
    assertEqual(row.claim_type_count, 3, `${row.slug} 主张类型数`)
    assertEqual(row.primary_claim_count, 11, `${row.slug} 主要主张数`)
    assertEqual(row.primary_section_count, 11, `${row.slug} 主要主张区块数`)
    assertEqual(row.invalid_primary_fact_count, 0, `${row.slug} 无依据主要事实数`)
    assertEqual(row.source_code_status, "open_source", `${row.slug} 源码状态`)
    assertAtLeast(row.evidence_count, 1, `${row.slug} 证据数`)
    assertAtLeast(row.tool_count, 1, `${row.slug} 已核验工具数`)
  }

  await assertMediaContract(database)

  const colorsnap = await database.query(
    `
      select
        status,
        source_code_status,
        summary like '%当前没有 AI%' as summary_discloses_no_ai,
        ai_implementation like '%当前没有 AI 能力%' as implementation_discloses_no_ai,
        jsonb_array_length(truth_boundary -> 'implemented')::integer as implemented_count,
        jsonb_array_length(truth_boundary -> 'simulated')::integer as simulated_count,
        jsonb_array_length(truth_boundary -> 'not_implemented')::integer as missing_count
      from public.demos
      where slug = 'colorsnap'
    `,
  )
  const colorsnapRow = colorsnap.rows[0]
  assertEqual(colorsnapRow?.status, "draft", "ColorSnap 状态")
  assertEqual(colorsnapRow?.source_code_status, "closed_source", "ColorSnap 源码状态")
  assertEqual(colorsnapRow?.summary_discloses_no_ai, true, "ColorSnap 摘要真实性")
  assertEqual(
    colorsnapRow?.implementation_discloses_no_ai,
    true,
    "ColorSnap AI 实现边界",
  )
  assertEqual(colorsnapRow?.implemented_count, 4, "ColorSnap 已实现边界数")
  assertEqual(colorsnapRow?.simulated_count, 3, "ColorSnap 模拟边界数")
  assertEqual(colorsnapRow?.missing_count, 4, "ColorSnap 未实现边界数")
}

async function assertMediaContract(database) {
  const result = await database.query(
    `
      select
        demo.slug,
        demo.cover_path,
        demo.cover_alt,
        demo.cover_rights_holder,
        demo.cover_license,
        media.role,
        media.storage_path,
        media.media_type,
        media.alt_text,
        media.rights_holder,
        media.license_terms,
        media.permission_basis,
        media.authorization_status,
        media.source_url,
        media.content_hash,
        media.captured_by_site,
        media.explicit_permission,
        media.is_abstract,
        media.static_poster_path,
        media.static_poster_hash
      from public.demos as demo
      join public.demo_media as media on media.demo_id = demo.id
      where demo.slug = any($1::text[])
      order by demo.slug, media.role
    `,
    [launchSlugs],
  )

  const rowsByKey = new Map(
    result.rows.map((row) => [`${row.slug}:${row.role}`, row]),
  )

  for (const asset of coverManifest.assets) {
    const row = rowsByKey.get(`${asset.slug}:cover`)
    if (!row) throw new Error(`${asset.slug} 缺少数据库封面`)
    assertEqual(row.cover_path, asset.path, `${asset.slug} 案例封面路径`)
    assertEqual(row.cover_alt, asset.alt, `${asset.slug} 案例封面替代文本`)
    assertEqual(row.cover_rights_holder, asset.rights_holder, `${asset.slug} 案例封面权利人`)
    assertEqual(row.cover_license, asset.license, `${asset.slug} 案例封面许可`)
    assertEqual(row.storage_path, asset.path, `${asset.slug} 媒体封面路径`)
    assertEqual(row.content_hash, asset.sha256, `${asset.slug} 媒体封面哈希`)
    assertEqual(row.is_abstract, true, `${asset.slug} 封面抽象标记`)
  }

  for (const asset of productManifest.assets) {
    const row = rowsByKey.get(`${asset.slug}:product_preview`)
    if (!row) throw new Error(`${asset.slug} 缺少数据库产品预览`)
    assertEqual(row.storage_path, asset.path, `${asset.slug} 产品预览路径`)
    assertEqual(row.media_type, asset.media_type, `${asset.slug} 产品预览类型`)
    assertEqual(row.alt_text, asset.alt, `${asset.slug} 产品预览替代文本`)
    assertEqual(row.rights_holder, asset.rights_holder, `${asset.slug} 产品预览权利人`)
    assertEqual(row.license_terms, asset.license_terms, `${asset.slug} 产品预览许可`)
    assertEqual(row.permission_basis, asset.permission_basis, `${asset.slug} 使用依据`)
    assertEqual(row.authorization_status, asset.authorization, `${asset.slug} 授权状态`)
    assertEqual(row.source_url, asset.source_url, `${asset.slug} 产品预览来源`)
    assertEqual(row.content_hash, asset.sha256, `${asset.slug} 产品预览哈希`)
    assertEqual(row.captured_by_site, asset.captured_by_site, `${asset.slug} 采集标记`)
    assertEqual(row.explicit_permission, asset.explicit_permission, `${asset.slug} 明确许可标记`)
    assertEqual(row.is_abstract, asset.is_abstract, `${asset.slug} 产品预览抽象标记`)
    assertEqual(
      row.static_poster_path,
      asset.static_poster_path ?? null,
      `${asset.slug} 静态海报路径`,
    )
    assertEqual(
      row.static_poster_hash,
      asset.static_poster_sha256 ?? null,
      `${asset.slug} 静态海报哈希`,
    )
  }
}

async function launchObservableState(database) {
  const result = await database.query(
    `
      with launch_demos as (
        select id, slug, updated_at
        from public.demos
        where slug = any($1::text[])
      )
      select relation_name, row_identity, observed_at
      from (
        select
          'demos'::text as relation_name,
          demo.id::text as row_identity,
          demo.updated_at::text as observed_at
        from launch_demos as demo

        union all

        select 'demo_publishers', publisher.id::text, publisher.created_at::text
        from public.demo_publishers as publisher
        join launch_demos as demo on demo.id = publisher.demo_id

        union all

        select 'demo_links', link.id::text, link.created_at::text
        from public.demo_links as link
        join launch_demos as demo on demo.id = link.demo_id

        union all

        select 'demo_claims', claim.id::text, claim.created_at::text
        from public.demo_claims as claim
        join launch_demos as demo on demo.id = claim.demo_id

        union all

        select 'demo_media', media.id::text, media.created_at::text
        from public.demo_media as media
        join launch_demos as demo on demo.id = media.demo_id

        union all

        select 'demo_evidence', evidence.id::text, evidence.created_at::text
        from public.demo_evidence as evidence
        join launch_demos as demo on demo.id = evidence.demo_id

        union all

        select
          'demo_tools',
          relation.demo_id::text || ':' || relation.tool_id::text,
          relation.verified_at::text
        from public.demo_tools as relation
        join launch_demos as demo on demo.id = relation.demo_id
      ) as observable_rows
      order by relation_name, row_identity
    `,
    [launchSlugs],
  )
  return result.rows
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}不符合预期：期望 ${expected}，实际 ${actual}`)
  }
}

function assertAtLeast(actual, minimum, label) {
  if (actual < minimum) {
    throw new Error(`${label}不符合预期：至少 ${minimum}，实际 ${actual}`)
  }
}

function assertSourceMirror(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}与对应 seed 不一致；请先同步再部署`)
  }
}
