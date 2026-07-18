import { describe, expect, it } from "vitest"

import {
  CATALOG_CONTRACT_VERSION,
  LAUNCH_SLUGS,
  PRIMARY_CLAIM_SECTIONS,
  assertCatalogContract,
  assertExactLaunchDemos,
  assertPrimaryClaims,
} from "../../scripts/production-database-contract.mjs"

function validDemos() {
  return LAUNCH_SLUGS.map((slug, index) => ({
    id: `00000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`,
    slug,
    source_code_status: "open_source",
  }))
}

function validClaims(demos) {
  return demos.flatMap((demo) =>
    PRIMARY_CLAIM_SECTIONS.map((section) => ({
      demo_id: demo.id,
      section,
      is_primary: true,
    })),
  )
}

function validContract() {
  return [
    {
      contract_version: CATALOG_CONTRACT_VERSION,
      published_demo_count: 12,
      open_source_demo_count: 12,
      primary_claim_count: 132,
      primary_demo_section_count: 132,
      distinct_primary_section_count: 11,
    },
  ]
}

describe("生产数据库公开契约", () => {
  it("接受精确的 12 个源码状态和 132 条主要主张", () => {
    const demos = validDemos()

    expect(() => assertExactLaunchDemos(demos)).not.toThrow()
    expect(() => assertPrimaryClaims(validClaims(demos), demos)).not.toThrow()
    expect(() => assertCatalogContract(validContract())).not.toThrow()
  })

  it("拒绝错误源码状态", () => {
    const demos = validDemos()
    demos[0].source_code_status = "closed_source"

    expect(() => assertExactLaunchDemos(demos)).toThrow(/开源/u)
  })

  it("拒绝缺失或重复的主要主张区块", () => {
    const demos = validDemos()
    const claims = validClaims(demos)
    claims[0] = { ...claims[1] }

    expect(() => assertPrimaryClaims(claims, demos)).toThrow(/主要主张区块/u)
  })

  it("拒绝错误 schema contract 版本或数量", () => {
    const wrongVersion = validContract()
    wrongVersion[0].contract_version = "old-contract"
    expect(() => assertCatalogContract(wrongVersion)).toThrow(/contract_version/u)

    const wrongCount = validContract()
    wrongCount[0].primary_claim_count = 131
    expect(() => assertCatalogContract(wrongCount)).toThrow(/primary_claim_count/u)
  })
})
