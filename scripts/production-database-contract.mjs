export const CATALOG_CONTRACT_VERSION = "launch-curated-mvp-v1"

export const LAUNCH_SLUGS = [
  "anythingllm",
  "cogvideo",
  "funclip",
  "maxkb",
  "novel",
  "open-notebook",
  "opengame",
  "postiz",
  "pptagent",
  "presenton",
  "restorephotos",
  "roomgpt",
]

export const PRIMARY_CLAIM_SECTIONS = [
  "adaptation",
  "ai_implementation",
  "core_features",
  "monetization",
  "pain_points",
  "product_overview",
  "solution",
  "target_users",
  "technical_implementation",
  "truth_boundary",
  "why_it_works",
]

function assertArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label}不是数组`)
  return value
}

function assertExactStringSet(actualValues, expectedValues, label) {
  if (
    actualValues.some((value) => typeof value !== "string") ||
    new Set(actualValues).size !== expectedValues.length ||
    JSON.stringify([...new Set(actualValues)].sort()) !==
      JSON.stringify([...expectedValues].sort())
  ) {
    throw new Error(`${label}不符合发布合同`)
  }
}

export function assertExactLaunchDemos(value) {
  const rows = assertArray(value, "生产公开案例")
  if (rows.length !== LAUNCH_SLUGS.length) {
    throw new Error(`生产公开案例数量不是 ${LAUNCH_SLUGS.length}`)
  }

  assertExactStringSet(
    rows.map((row) => row?.slug),
    LAUNCH_SLUGS,
    "生产公开案例 slug",
  )
  assertExactStringSet(
    rows.map((row) => row?.id),
    rows.map((row) => row?.id),
    "生产公开案例 id",
  )

  if (rows.some((row) => row?.source_code_status !== "open_source")) {
    throw new Error("生产首发案例没有全部显式标记为开源")
  }

  return rows
}

export function assertPrimaryClaims(value, demos) {
  const rows = assertArray(value, "生产主要主张")
  const expectedClaimCount = LAUNCH_SLUGS.length * PRIMARY_CLAIM_SECTIONS.length
  if (rows.length !== expectedClaimCount) {
    throw new Error(`生产主要主张数量不是 ${expectedClaimCount}`)
  }

  const demoIds = demos.map((demo) => demo.id)
  assertExactStringSet(demoIds, demoIds, "生产公开案例 id")
  const expectedDemoIds = new Set(demoIds)

  for (const row of rows) {
    if (
      row?.is_primary !== true ||
      !expectedDemoIds.has(row?.demo_id) ||
      typeof row?.section !== "string"
    ) {
      throw new Error("生产主要主张包含无效案例、区块或主要标记")
    }
  }

  for (const demoId of demoIds) {
    const sections = rows
      .filter((row) => row.demo_id === demoId)
      .map((row) => row.section)
    assertExactStringSet(
      sections,
      PRIMARY_CLAIM_SECTIONS,
      `案例 ${demoId} 的主要主张区块`,
    )
  }
}

export function assertCatalogContract(value) {
  const rows = assertArray(value, "生产目录 schema contract")
  if (rows.length !== 1 || typeof rows[0] !== "object" || rows[0] === null) {
    throw new Error("生产目录 schema contract 必须精确返回一行")
  }

  const row = rows[0]
  const expected = {
    contract_version: CATALOG_CONTRACT_VERSION,
    published_demo_count: 12,
    open_source_demo_count: 12,
    primary_claim_count: 132,
    primary_demo_section_count: 132,
    distinct_primary_section_count: 11,
  }

  for (const [field, expectedValue] of Object.entries(expected)) {
    const actualValue =
      typeof expectedValue === "number" ? Number(row[field]) : row[field]
    if (actualValue !== expectedValue) {
      throw new Error(
        `生产目录 schema contract 的 ${field} 不符合 ${String(expectedValue)}`,
      )
    }
  }
}
