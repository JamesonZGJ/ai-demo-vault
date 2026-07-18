import { readProductionDatabaseConfig } from "./production-config.mjs"
import {
  assertCatalogContract,
  assertExactLaunchDemos,
  assertPrimaryClaims,
} from "./production-database-contract.mjs"

const { supabaseUrl: baseUrl, publishableKey: key } =
  readProductionDatabaseConfig()
const headers = { apikey: key, Authorization: `Bearer ${key}` }

async function readJson(path, init = {}) {
  const response = await fetch(new URL(path, baseUrl), {
    ...init,
    headers: { ...headers, "Content-Type": "application/json", ...init.headers },
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`生产数据库只读请求失败：${response.status}`)
  return response.json()
}

const demos = await readJson(
  "/rest/v1/demos?select=id,slug,status,publisher_region,category_id,source_code_status&status=eq.published&order=slug.asc",
)
assertExactLaunchDemos(demos)
const categoryCount = new Set(demos.map(({ category_id }) => category_id)).size
const mainland = demos.filter(({ publisher_region }) => publisher_region === "mainland_china").length
const international = demos.filter(({ publisher_region }) => publisher_region === "international").length
if (categoryCount !== 10 || mainland !== 4 || international !== 8) {
  throw new Error("生产首发分类或地区合同不一致")
}

const draft = await readJson("/rest/v1/demos?select=slug&slug=eq.colorsnap")
if (!Array.isArray(draft) || draft.length !== 0) {
  throw new Error("匿名角色能够读取 ColorSnap 草稿")
}

const blueprints = await readJson("/rest/v1/blueprints?select=slug")
if (!Array.isArray(blueprints) || blueprints.length !== 0) {
  throw new Error("生产匿名角色能够读取本地 Blueprint 试用商品")
}

const blueprintPilotEnabled = await readJson(
  "/rest/v1/rpc/is_blueprint_pilot_enabled",
  { method: "POST", body: "{}" },
)
if (blueprintPilotEnabled !== false) {
  throw new Error("生产数据库的 Blueprint 本地试用开关没有关闭")
}

const search = await readJson("/rest/v1/rpc/search_demos", {
  method: "POST",
  body: JSON.stringify({
    p_category: null,
    p_difficulty: null,
    p_page: 1,
    p_query: null,
    p_region: null,
    p_sort: "newest",
    p_tool: null,
  }),
})
assertExactLaunchDemos(
  search.map((row) => ({
    ...row,
    id: demos.find((demo) => demo.slug === row.slug)?.id,
    source_code_status: "open_source",
  })),
)
if (search.some(({ total_count }) => Number(total_count) !== demos.length)) {
  throw new Error("生产公开搜索 RPC 的 total_count 不是 12")
}

const primaryClaims = await readJson(
  "/rest/v1/demo_claims?select=demo_id,section,is_primary&is_primary=eq.true&order=demo_id.asc,section.asc",
)
assertPrimaryClaims(primaryClaims, demos)

const catalogContract = await readJson(
  "/rest/v1/rpc/get_public_catalog_contract",
  { method: "POST", body: "{}" },
)
assertCatalogContract(catalogContract)

console.log(
  "生产数据库只读验收通过：schema contract、12 个源码状态、132 条主要主张、10 个分类、国内 4、海外 8，草稿和本地 Blueprint 不可读。",
)
