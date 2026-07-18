import { describe, expect, it } from "vitest"

import {
  canonicalStaticCatalogQueryString,
  parseCatalogFilters,
} from "@/lib/catalog/search-params"

describe("案例库查询参数规范化", () => {
  it("移除非法枚举、非法页码和未知参数", () => {
    const query = new URLSearchParams(
      "difficulty=impossible&page=-2&unexpected=value",
    )

    expect(canonicalStaticCatalogQueryString(query)).toBe("")
  })

  it("保留数据库核验字段并规范顺序、空白和页码", () => {
    const query = new URLSearchParams(
      "tool=nextjs&q=%20room%20&page=02&category=interior-design",
    )

    expect(canonicalStaticCatalogQueryString(query)).toBe(
      "q=room&category=interior-design&tool=nextjs&page=2",
    )
  })

  it("在代理和页面两层拒绝超出业务上限的页码", () => {
    const tooLarge = "2147483648"

    expect(
      canonicalStaticCatalogQueryString(
        new URLSearchParams(`page=${tooLarge}`),
      ),
    ).toBe("")
    expect(
      parseCatalogFilters(
        { page: tooLarge },
        { categories: [], tools: [] },
      ),
    ).toEqual({
      filters: { page: 1, sort: "newest" },
      needsRedirect: true,
    })
  })
})
