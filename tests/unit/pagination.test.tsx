import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { Pagination } from "@/components/filters/pagination"
import type { CatalogFilters } from "@/lib/demos/types"

afterEach(() => {
  cleanup()
})

const filters: CatalogFilters = {
  page: 3,
  q: "room",
  sort: "commercial-potential",
}

describe("案例库分页", () => {
  it("单页结果不显示虚假分页", () => {
    const { container } = render(
      <Pagination filters={{ page: 1, sort: "newest" }} pageCount={1} />,
    )

    expect(container.childElementCount).toBe(0)
  })

  it("保留筛选条件并标明当前页、前一页和后一页", () => {
    render(<Pagination filters={filters} pageCount={6} />)

    expect(screen.getByRole("navigation", { name: "案例库分页" })).not.toBeNull()
    expect(screen.getByText("3").getAttribute("aria-current")).toBe("page")
    expect(screen.getByRole("link", { name: "上一页" }).getAttribute("href")).toBe(
      "/demos?q=room&sort=commercial-potential&page=2",
    )
    expect(screen.getByRole("link", { name: "下一页" }).getAttribute("href")).toBe(
      "/demos?q=room&sort=commercial-potential&page=4",
    )
    expect(screen.getByRole("link", { name: "5" }).getAttribute("href")).toBe(
      "/demos?q=room&sort=commercial-potential&page=5",
    )
  })
})
