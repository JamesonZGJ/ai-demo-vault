import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import GlobalError from "@/app/error"
import GlobalLoading from "@/app/loading"
import CatalogLoading from "@/app/(public)/demos/loading"
import DetailLoading from "@/app/(public)/demos/[slug]/loading"

afterEach(() => {
  cleanup()
})

describe("公开页面状态", () => {
  it.each([
    [GlobalLoading, "正在加载 Capability Marketplace"],
    [CatalogLoading, "正在加载案例库"],
    [DetailLoading, "正在加载案例详情"],
  ])("%s 明确标记正在加载而不是显示空结果", (LoadingState, label) => {
    const { container } = render(<LoadingState />)

    expect(container.querySelector('main[aria-busy="true"]')).not.toBeNull()
    expect(screen.getByText(label)).not.toBeNull()
    expect(screen.queryByText("0 个结果")).toBeNull()
  })

  it("错误页明确说明失败并允许重试", () => {
    const reset = vi.fn()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)
    const error = Object.assign(new Error("数据库不可达"), { digest: "safe-digest" })

    render(<GlobalError error={error} reset={reset} />)

    expect(screen.getByRole("alert").textContent).toContain("暂时无法加载内容")
    expect(screen.getByRole("alert").textContent).toContain("不会把失败伪装成空结果")
    fireEvent.click(screen.getByRole("button", { name: "重试" }))
    expect(reset).toHaveBeenCalledOnce()
    expect(consoleError).toHaveBeenCalledWith("公开页面加载失败", "safe-digest")
  })
})
