import { readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { sourceCodeStatusLabels } from "../../lib/demos/labels"

const projectRoot = process.cwd()
const colorSnapSources = [
  "supabase/seed.sql",
  "supabase/migrations/20260716000200_base_catalog_content.sql",
]

describe("内容可信边界", () => {
  it("源码状态标签不把闭源、未知和开源混为一谈", () => {
    expect(sourceCodeStatusLabels).toEqual({
      open_source: "源码已公开",
      closed_source: "源码未开放",
      not_disclosed: "源码状态未披露",
    })
    expect(new Set(Object.values(sourceCodeStatusLabels)).size).toBe(3)
  })

  it.each(colorSnapSources)("ColorSnap 在 %s 中明确是闭源非 AI 草稿", (relativePath) => {
    const source = readFileSync(path.resolve(projectRoot, relativePath), "utf8")

    expect(source).toContain("'ColorSnap'")
    expect(source).toContain("'从想法到界面的非 AI 交互原型记录'")
    expect(source).toContain("'draft'")
    expect(source).toContain("'closed_source'")
    expect(source).toContain(
      "'当前没有 AI 能力；“共鸣分”来自 CIEDE2000 色差计算，不是模型推理。'",
    )
    expect(source).toContain('"simulated":["地图与附近用户"')
    expect(source).toContain('"not_implemented":["AI 模型调用"')
  })
})
