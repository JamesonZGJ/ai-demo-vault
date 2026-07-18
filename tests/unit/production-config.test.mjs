import { describe, expect, it } from "vitest"

import {
  assertExpectedReleaseCommit,
  assertProductionPublishableKey,
  containsForbiddenClientSecret,
  parseProductionOrigin,
  readProductionDatabaseConfig,
  readPublicProductionConfig,
} from "../../scripts/production-config.mjs"

describe("生产发布配置", () => {
  it("接受无路径 HTTPS origin", () => {
    expect(parseProductionOrigin("https://vault.example", "SITE").origin).toBe(
      "https://vault.example",
    )
  })

  it.each([
    undefined,
    "http://vault.example",
    "https://localhost",
    "https://localhost.",
    "https://app.localhost",
    "https://app.localhost.",
    "https://127.0.0.2",
    "https://2130706433",
    "https://0x7f000001",
    "https://10.0.0.1",
    "https://100.64.0.1",
    "https://169.254.1.1",
    "https://172.16.0.1",
    "https://192.168.1.1",
    "https://198.18.0.1",
    "https://[::1]",
    "https://[::ffff:10.0.0.1]",
    "https://[fc00::1]",
    "https://[fe80::1]",
    "https://user:password@vault.example",
    "https://vault.example/path",
    "https://vault.example?query=1",
    "https://vault.example#hash",
  ])("拒绝不允许的生产 HTTPS origin：%s", (value) => {
    expect(() => parseProductionOrigin(value, "SITE")).toThrow(
      /无路径 HTTPS origin|缺少 SITE/u,
    )
  })

  it.each([
    "https://8.8.8.8",
    "https://1.1.1.1",
    "https://[2001:4860:4860::8888]",
  ])("接受公网 IP origin：%s", (value) => {
    expect(parseProductionOrigin(value, "SITE").origin).toBe(value)
  })

  it("只接受公开 Supabase 密钥", () => {
    expect(
      assertProductionPublishableKey(
        "sb_publishable_a_valid_public_value",
        "KEY",
      ),
    ).toBe("sb_publishable_a_valid_public_value")

    const anonPayload = Buffer.from(JSON.stringify({ role: "anon" })).toString(
      "base64url",
    )
    expect(
      assertProductionPublishableKey(`header.${anonPayload}.signature`, "KEY"),
    ).toContain(anonPayload)

    for (const value of [
      undefined,
      "your-local-or-production-publishable-key",
      "sb_secret_not_allowed",
      "not-a-supabase-key",
    ]) {
      expect(() => assertProductionPublishableKey(value, "KEY")).toThrow(
        /Publishable Key|缺少 KEY/u,
      )
    }
  })

  it("只接受与当前版本一致的完整 commit SHA", () => {
    const sha1 = "a".repeat(40)
    const sha256 = "b".repeat(64)

    expect(assertExpectedReleaseCommit(sha1.toUpperCase(), sha1)).toBe(sha1)
    expect(assertExpectedReleaseCommit(sha256, sha256)).toBe(sha256)
  })

  it.each([
    [undefined, "a".repeat(40)],
    ["a".repeat(12), "a".repeat(40)],
    ["g".repeat(40), "a".repeat(40)],
    ["a".repeat(40), "b".repeat(40)],
    ["a".repeat(40), undefined],
  ])("拒绝无效或不匹配的发布 commit：%s / %s", (expected, actual) => {
    expect(() => assertExpectedReleaseCommit(expected, actual)).toThrow(
      /commit SHA|不一致|缺少 EXPECTED_RELEASE_COMMIT_SHA/u,
    )
  })

  it.each([
    "NEXT_PUBLIC_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_service_role_key",
    "NEXT_PUBLIC_SUPABASE_SERVICE_KEY",
    "NEXT_PUBLIC_supabaseServiceKey",
    "NEXT_PUBLIC_PRIVATE_KEY",
  ])("构建预检拒绝公开名称中的秘密变量：%s", (forbiddenName) => {
    expect(() =>
      readPublicProductionConfig({
        NEXT_PUBLIC_SITE_URL: "https://vault.example",
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
          "sb_publishable_a_valid_public_value",
        [forbiddenName]: "forbidden",
      }),
    ).toThrow(/禁止公开/u)
  })

  it("构建产物扫描识别 legacy service_role JWT", () => {
    const serviceRolePayload = Buffer.from(
      JSON.stringify({ role: "service_role" }),
    ).toString("base64url")
    const anonPayload = Buffer.from(JSON.stringify({ role: "anon" })).toString(
      "base64url",
    )

    expect(
      containsForbiddenClientSecret(
        `const key="legacy.${serviceRolePayload}.a-valid-signature"`,
      ),
    ).toBe(true)
    expect(
      containsForbiddenClientSecret(`const key="legacy.${anonPayload}.a-valid-signature"`),
    ).toBe(false)
    expect(containsForbiddenClientSecret("sb_secret_a_secret_value_1234")).toBe(
      true,
    )
  })

  it.each(["local", "preview"])("生产预检拒绝 %s 部署层", (tier) => {
    expect(() =>
      readPublicProductionConfig({
        APP_DEPLOYMENT_TIER: tier,
        NEXT_PUBLIC_SITE_URL: "https://vault.example",
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
          "sb_publishable_a_valid_public_value",
      }),
    ).toThrow(/生产发布禁止/u)
  })

  it("数据库验收只读取专用生产变量", () => {
    const projectRef = "abcdefghijklmnopqrst"
    const config = readProductionDatabaseConfig({
      EXPECTED_SUPABASE_PROJECT_REF: projectRef,
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "local-key",
      PRODUCTION_SUPABASE_URL: `https://${projectRef}.supabase.co`,
      PRODUCTION_SUPABASE_PUBLISHABLE_KEY:
        "sb_publishable_a_valid_public_value",
    })

    expect(config.projectRef).toBe(projectRef)
    expect(config.supabaseUrl.origin).toBe(`https://${projectRef}.supabase.co`)
    expect(config.publishableKey).toBe("sb_publishable_a_valid_public_value")
  })

  it.each([
    undefined,
    "abcdefghijklmnopqrs",
    "abcdefghijklmnopqrstu",
    "abcdefghijklmnopqrs1",
    "ABCDEFGHIJKLMNOPQRST",
  ])("拒绝无效生产 Supabase Project Ref：%s", (projectRef) => {
    expect(() =>
      readProductionDatabaseConfig({
        EXPECTED_SUPABASE_PROJECT_REF: projectRef,
        PRODUCTION_SUPABASE_URL: "https://abcdefghijklmnopqrst.supabase.co",
        PRODUCTION_SUPABASE_PUBLISHABLE_KEY:
          "sb_publishable_a_valid_public_value",
      }),
    ).toThrow(/EXPECTED_SUPABASE_PROJECT_REF/u)
  })

  it("拒绝与 Project Ref 不匹配的生产 Supabase URL", () => {
    expect(() =>
      readProductionDatabaseConfig({
        EXPECTED_SUPABASE_PROJECT_REF: "abcdefghijklmnopqrst",
        PRODUCTION_SUPABASE_URL: "https://bcdefghijklmnopqrstu.supabase.co",
        PRODUCTION_SUPABASE_PUBLISHABLE_KEY:
          "sb_publishable_a_valid_public_value",
      }),
    ).toThrow(/精确匹配/u)
  })
})
