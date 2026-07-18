const HTTP_PROTOCOLS = new Set(["http:", "https:"])
const PLACEHOLDER_PUBLISHABLE_KEY = "your-local-or-production-publishable-key"
const DEPLOYMENT_TIERS = new Set(["local", "preview", "production"])

function requireEnv(name: string): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`缺少必需环境变量：${name}`)
  }

  return value
}

export function getSupabaseConfig() {
  const value = requireEnv("NEXT_PUBLIC_SUPABASE_URL")
  const publishableKey = requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
  const url = parseOrigin(value, "NEXT_PUBLIC_SUPABASE_URL")

  if (isVercelProduction()) {
    assertProductionOrigin(url, "NEXT_PUBLIC_SUPABASE_URL")
    assertProductionPublishableKey(publishableKey)
  }

  return { url: url.origin, publishableKey }
}

export function getSiteUrl(): URL {
  const configuredValue = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const vercelPreviewValue = process.env.VERCEL_URL?.trim()
  const value =
    configuredValue ||
    (process.env.VERCEL_ENV === "preview" && vercelPreviewValue
      ? `https://${vercelPreviewValue}`
      : undefined)

  if (!value) {
    throw new Error("缺少必需环境变量：NEXT_PUBLIC_SITE_URL")
  }

  const url = parseOrigin(value, "NEXT_PUBLIC_SITE_URL")

  if (isVercelProduction()) {
    assertProductionOrigin(url, "NEXT_PUBLIC_SITE_URL")
  }

  return url
}

export function isLocalBlueprintPilot(): boolean {
  const rawTier = process.env.APP_DEPLOYMENT_TIER?.trim()

  if (rawTier && !DEPLOYMENT_TIERS.has(rawTier)) {
    throw new Error("APP_DEPLOYMENT_TIER 只能是 local、preview 或 production")
  }

  if (rawTier !== "local") return false

  if (process.env.VERCEL_ENV?.trim()) {
    throw new Error("Vercel 托管环境禁止开启本地 Blueprint 试用")
  }

  const siteUrl = parseOrigin(
    requireEnv("NEXT_PUBLIC_SITE_URL"),
    "NEXT_PUBLIC_SITE_URL",
  )
  const supabaseUrl = parseOrigin(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    "NEXT_PUBLIC_SUPABASE_URL",
  )
  if (
    siteUrl.protocol !== "http:" ||
    supabaseUrl.protocol !== "http:" ||
    !isLoopbackHost(siteUrl.hostname) ||
    !isLoopbackHost(supabaseUrl.hostname)
  ) {
    throw new Error("本地 Blueprint 试用要求站点和 Supabase 都是本机 HTTP origin")
  }

  return true
}

/**
 * Vercel Preview 只展示自研静态目录，不连接 Supabase，也不开放账号、收藏和试用权益。
 * 生产环境不能通过这个开关绕过公开配置校验。
 */
export function isStaticPreviewMode(): boolean {
  const rawTier = process.env.APP_DEPLOYMENT_TIER?.trim()

  if (rawTier && !DEPLOYMENT_TIERS.has(rawTier)) {
    throw new Error("APP_DEPLOYMENT_TIER 只能是 local、preview 或 production")
  }

  if (rawTier === "preview" && process.env.VERCEL_ENV === "production") {
    throw new Error("Vercel 生产环境禁止开启静态 Preview 模式")
  }

  return rawTier === "preview"
}

function parseOrigin(value: string, name: string): URL {
  try {
    const url = new URL(value)
    if (
      !HTTP_PROTOCOLS.has(url.protocol) ||
      url.username !== "" ||
      url.password !== "" ||
      url.pathname !== "/" ||
      url.search !== "" ||
      url.hash !== ""
    ) {
      throw new Error("不是纯 origin")
    }
    return url
  } catch {
    throw new Error(`${name} 必须是有效的 HTTP(S) origin`)
  }
}

function isVercelProduction() {
  return process.env.VERCEL_ENV === "production"
}

function isLoopbackHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "[::1]" ||
    /^127(?:\.\d{1,3}){3}$/u.test(hostname)
  )
}

function assertProductionOrigin(url: URL, name: string) {
  if (url.protocol !== "https:" || isLoopbackHost(url.hostname)) {
    throw new Error(`${name} 在 Vercel 生产环境必须使用公网 HTTPS origin`)
  }
}

function readJwtRole(value: string): string | null {
  const payload = value.split(".")[1]
  if (!payload) return null

  try {
    const normalized = payload.replace(/-/gu, "+").replace(/_/gu, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    const decoded = JSON.parse(globalThis.atob(padded)) as { role?: unknown }
    return typeof decoded.role === "string" ? decoded.role : null
  } catch {
    return null
  }
}

function assertProductionPublishableKey(value: string) {
  const isPublishableKey = /^sb_publishable_[A-Za-z0-9_-]+$/u.test(value)
  const isLegacyAnonKey = readJwtRole(value) === "anon"

  if (
    value === PLACEHOLDER_PUBLISHABLE_KEY ||
    value.startsWith("sb_secret_") ||
    (!isPublishableKey && !isLegacyAnonKey)
  ) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 必须是 Supabase Publishable Key 或 legacy anon key",
    )
  }
}
