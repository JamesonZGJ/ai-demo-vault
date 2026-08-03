import { describe, expect, it } from "vitest"

import {
  registeredDestination,
  registrationDestination,
} from "@/lib/auth/registration-destination"

describe("registrationDestination", () => {
  it("注册已创建会话时进入明确的成功结果页", () => {
    expect(
      registrationDestination({
        email: "jameson@example.com",
        hasSession: true,
        returnTo: "/favorites",
      }),
    ).toBe("/auth/registered?returnTo=%2Ffavorites")
  })

  it("需要邮箱确认时只把脱敏地址带到检查邮箱页", () => {
    expect(
      registrationDestination({
        email: "jameson@example.com",
        hasSession: false,
        returnTo: "/favorites",
      }),
    ).toBe("/auth/check-email?recipient=j***%40example.com")
  })

  it("确认邮件成功后先进入结果页再返回原目标", () => {
    expect(registeredDestination("/favorites")).toBe(
      "/auth/registered?returnTo=%2Ffavorites",
    )
    expect(registeredDestination("/")).toBe("/auth/registered")
  })
})
