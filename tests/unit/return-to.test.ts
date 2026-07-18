import { describe, expect, it } from "vitest"

import { safeReturnTo } from "@/lib/auth/return-to"

describe("safeReturnTo", () => {
  it.each([
    "/",
    "/favorites",
    "/demos/roomgpt?from=home#media",
    "/demos?difficulty=beginner&page=2",
  ])("保留安全站内路径 %s", (value) => {
    expect(safeReturnTo(value)).toBe(value)
  })

  it.each([
    "https://evil.example/steal",
    "//evil.example/steal",
    "/\\evil.example/steal",
    "/%5Cevil.example/steal",
    "/%2F%2Fevil.example/steal",
    "javascript:alert(1)",
    "favorites",
    null,
    undefined,
  ])("拒绝危险或无效回跳值 %s", (value) => {
    expect(safeReturnTo(value)).toBe("/")
  })

  it("无效编码不会绕过检查", () => {
    expect(safeReturnTo("/%E0%A4%A")).toBe("/")
  })
})
