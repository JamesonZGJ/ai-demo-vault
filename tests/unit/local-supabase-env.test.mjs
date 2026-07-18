import { describe, expect, it } from "vitest"

import {
  createLocalPublicEnv,
  parseSupabaseStatus,
} from "../../scripts/run-with-local-supabase.mjs"

const validStatus = [
  'API_URL="http://127.0.0.1:54321"',
  'MAILPIT_URL="http://127.0.0.1:54324"',
  'PUBLISHABLE_KEY="sb_publishable_local_public_key"',
  'SERVICE_ROLE_KEY="must-not-enter-child"',
].join("\n")

describe("Supabase Local 公开环境注入", () => {
  it("只注入浏览器可公开值并移除继承的服务端秘密", () => {
    const env = createLocalPublicEnv(validStatus, {
      PATH: "test-path",
      SERVICE_ROLE_KEY: "inherited-secret",
      SUPABASE_ACCESS_TOKEN: "inherited-token",
      VERCEL_ENV: "production",
    })

    expect(env).toMatchObject({
      APP_DEPLOYMENT_TIER: "local",
      MAILPIT_URL: "http://127.0.0.1:54324",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_local_public_key",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      PATH: "test-path",
    })
    expect(env).not.toHaveProperty("SERVICE_ROLE_KEY")
    expect(env).not.toHaveProperty("SUPABASE_ACCESS_TOKEN")
    expect(env).not.toHaveProperty("VERCEL_ENV")
  })

  it("解析带引号的状态，但不会自动暴露任何秘密字段", () => {
    expect(parseSupabaseStatus(validStatus)).toEqual({
      API_URL: "http://127.0.0.1:54321",
      MAILPIT_URL: "http://127.0.0.1:54324",
      PUBLISHABLE_KEY: "sb_publishable_local_public_key",
      SERVICE_ROLE_KEY: "must-not-enter-child",
    })
  })

  it.each([
    validStatus.replace("http://127.0.0.1:54321", "https://vault.example.com"),
    validStatus.replace("PUBLISHABLE_KEY=", "MISSING_PUBLISHABLE_KEY="),
  ])("错误或非本地状态立即失败", (status) => {
    expect(() => createLocalPublicEnv(status, {})).toThrow(
      /本机 HTTP origin|Publishable Key/u,
    )
  })

  it("拒绝继承任何伪装成公开变量的服务端秘密", () => {
    expect(() =>
      createLocalPublicEnv(validStatus, {
        NEXT_PUBLIC_supabaseServiceKey: "secret",
      }),
    ).toThrow(/禁止公开/u)
  })
})
