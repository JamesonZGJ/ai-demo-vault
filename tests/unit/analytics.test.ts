import { describe, expect, it } from "vitest"

import {
  isMeasuredPublicPath,
  sanitizePublicAnalyticsEvent,
} from "@/components/analytics/public-analytics"

describe("公开页面统计边界", () => {
  it.each(["/", "/demos", "/demos/roomgpt"])("允许公开发现路径 %s", (path) => {
    expect(isMeasuredPublicPath(path)).toBe(true)
  })

  it.each([
    "/privacy",
    "/login",
    "/register",
    "/auth/confirm",
    "/favorites",
    "/demos/colorsnap",
    "/blueprints",
    "/blueprints/colorsnap-blueprint",
    "/checkout/colorsnap-blueprint",
    "/account/library",
  ])(
    "排除私有或隐私路径 %s",
    (path) => {
      expect(isMeasuredPublicPath(path)).toBe(false)
    },
  )

  it("发送前移除查询参数与片段", () => {
    expect(
      sanitizePublicAnalyticsEvent(
        { mode: "pageview", url: "/demos?q=private-email%40example.test#result" },
        "https://vault.example",
      ),
    ).toEqual({ mode: "pageview", url: "https://vault.example/demos" })
  })

  it("即使事件被直接构造也拒绝私有路径", () => {
    expect(
      sanitizePublicAnalyticsEvent(
        { mode: "pageview", url: "https://vault.example/favorites?user=secret" },
        "https://vault.example",
      ),
    ).toBeNull()
  })

  it("成功页面只接受自身路径，拒绝 404、草稿和路由切换事件", () => {
    expect(
      sanitizePublicAnalyticsEvent(
        { mode: "pageview", url: "/demos/roomgpt?source=email" },
        "https://vault.example",
        "/demos/roomgpt",
      ),
    ).toEqual({ mode: "pageview", url: "https://vault.example/demos/roomgpt" })

    for (const path of [
      "/demos/colorsnap",
      "/demos/not-found",
      "/login",
    ]) {
      expect(
        sanitizePublicAnalyticsEvent(
          { mode: "pageview", url: path },
          "https://vault.example",
          "/demos/roomgpt",
        ),
      ).toBeNull()
    }
  })
})
