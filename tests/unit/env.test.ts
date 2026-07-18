import { afterEach, describe, expect, it } from "vitest"

import {
  getSiteUrl,
  getSupabaseConfig,
  isLocalBlueprintPilot,
  isPreviewMockMode,
  isStaticPreviewMode,
  requireSupabaseConfig,
} from "@/lib/env"

const originalEnv = { ...process.env }

afterEach(() => {
  process.env = { ...originalEnv }
})

describe("环境变量", () => {
  it("读取唯一站点 origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://vault.example"
    expect(getSiteUrl().toString()).toBe("https://vault.example/")
  })

  it("Preview 没有显式站点地址时使用 Vercel Preview origin", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    process.env.VERCEL_ENV = "preview"
    process.env.VERCEL_URL = "demo-marketplace-preview.vercel.app"

    expect(getSiteUrl().origin).toBe("https://demo-marketplace-preview.vercel.app")
  })

  it("生产环境不能用 VERCEL_URL 替代正式站点地址", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    process.env.VERCEL_ENV = "production"
    process.env.VERCEL_URL = "demo-marketplace-preview.vercel.app"

    expect(() => getSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/u)
  })

  it.each([
    "",
    "ftp://vault.example",
    "not-a-url",
    "https://vault.example/path",
    "https://vault.example?query=1",
    "https://user:password@vault.example",
  ])("拒绝不是纯 HTTP(S) origin 的站点地址 %s", (value) => {
    process.env.NEXT_PUBLIC_SITE_URL = value
    expect(() => getSiteUrl()).toThrow()
  })

  it("读取公开 Supabase 配置", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321"
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key"
    expect(getSupabaseConfig()).toEqual({
      url: "http://127.0.0.1:54321",
      publishableKey: "publishable-key",
    })
  })

  it("密钥缺失时进入 Mock Mode，真正访问数据库时才失败", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321"
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    expect(getSupabaseConfig()).toBeNull()
    expect(isPreviewMockMode()).toBe(true)
    expect(() => requireSupabaseConfig()).toThrow(/需要 Supabase/u)
  })

  it("兼容 Supabase legacy anon key", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321"
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key"
    expect(getSupabaseConfig()).toEqual({
      url: "http://127.0.0.1:54321",
      publishableKey: "anon-key",
    })
  })

  it("Vercel 生产环境拒绝 HTTP、回环地址和占位密钥", () => {
    process.env.VERCEL_ENV = "production"
    process.env.NEXT_PUBLIC_SITE_URL = "http://vault.example"
    expect(() => getSiteUrl()).toThrow(/公网 HTTPS origin/u)

    process.env.NEXT_PUBLIC_SITE_URL = "https://vault.example"
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321"
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
      "your-local-or-production-publishable-key"
    expect(() => requireSupabaseConfig()).toThrow(/公网 HTTPS origin/u)

    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co"
    expect(() => requireSupabaseConfig()).toThrow(/Publishable Key/u)
  })

  it("Vercel 生产环境接受公网 HTTPS 与 Supabase Publishable Key", () => {
    process.env.VERCEL_ENV = "production"
    process.env.NEXT_PUBLIC_SITE_URL = "https://vault.example"
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co"
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
      "sb_publishable_a_valid_public_value"

    expect(getSiteUrl().origin).toBe("https://vault.example")
    expect(getSupabaseConfig()).toEqual({
      publishableKey: "sb_publishable_a_valid_public_value",
      url: "https://project.supabase.co",
    })
  })

  it("Vercel 生产环境拒绝 legacy Service Role JWT", () => {
    process.env.VERCEL_ENV = "production"
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co"
    const payload = Buffer.from(JSON.stringify({ role: "service_role" }))
      .toString("base64url")
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = `header.${payload}.signature`

    expect(() => getSupabaseConfig()).toThrow(/Publishable Key/u)
  })

  it("只在显式本地层开启 Blueprint 试用", () => {
    delete process.env.VERCEL_ENV
    delete process.env.APP_DEPLOYMENT_TIER
    expect(isLocalBlueprintPilot()).toBe(false)

    process.env.APP_DEPLOYMENT_TIER = "local"
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000"
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321"
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key"
    expect(isLocalBlueprintPilot()).toBe(true)

    process.env.APP_DEPLOYMENT_TIER = "preview"
    expect(isLocalBlueprintPilot()).toBe(false)
  })

  it("Preview 静态模式不连接 Supabase", () => {
    process.env.APP_DEPLOYMENT_TIER = "preview"
    process.env.VERCEL_ENV = "preview"

    expect(isStaticPreviewMode()).toBe(true)
  })

  it("生产环境拒绝 Preview 静态模式", () => {
    process.env.APP_DEPLOYMENT_TIER = "preview"
    process.env.VERCEL_ENV = "production"

    expect(() => isStaticPreviewMode()).toThrow(/禁止开启/u)
  })

  it("生产环境拒绝本地 Blueprint 试用配置", () => {
    process.env.VERCEL_ENV = "production"
    process.env.APP_DEPLOYMENT_TIER = "local"
    expect(() => isLocalBlueprintPilot()).toThrow(/禁止开启/u)
  })

  it.each(["preview", "development"])(
    "Vercel %s 环境拒绝本地 Blueprint 试用配置",
    (vercelEnv) => {
      process.env.VERCEL_ENV = vercelEnv
      process.env.APP_DEPLOYMENT_TIER = "local"
      expect(() => isLocalBlueprintPilot()).toThrow(/托管环境禁止/u)
    },
  )

  it.each([
    ["https://vault.example", "http://127.0.0.1:54321"],
    ["http://localhost:3000", "https://project.supabase.co"],
    ["http://192.168.1.10:3000", "http://127.0.0.1:54321"],
  ])("拒绝非本机 HTTP 的试用 origin：%s / %s", (siteUrl, supabaseUrl) => {
    delete process.env.VERCEL_ENV
    process.env.APP_DEPLOYMENT_TIER = "local"
    process.env.NEXT_PUBLIC_SITE_URL = siteUrl
    process.env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable-key"
    expect(() => isLocalBlueprintPilot()).toThrow(/本机 HTTP origin/u)
  })
})
