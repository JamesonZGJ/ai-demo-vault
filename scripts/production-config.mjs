import { BlockList, isIP } from "node:net"

const PLACEHOLDER_PUBLISHABLE_KEY = "your-local-or-production-publishable-key"
const SUPABASE_PROJECT_REF_PATTERN = /^[a-z]{20}$/u
const FULL_GIT_COMMIT_PATTERN = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u

const nonPublicIpv4 = new BlockList()
for (const [network, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
]) {
  nonPublicIpv4.addSubnet(network, prefix, "ipv4")
}

const nonPublicIpv6 = new BlockList()
for (const [network, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["::ffff:0:0", 96],
  ["64:ff9b:1::", 48],
  ["100::", 64],
  ["2001:2::", 48],
  ["2001:db8::", 32],
  ["3fff::", 20],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
]) {
  nonPublicIpv6.addSubnet(network, prefix, "ipv6")
}

function isNonPublicIpLiteral(hostname) {
  const address = hostname.startsWith("[")
    ? hostname.slice(1, -1)
    : hostname
  const family = isIP(address)

  if (family === 4) return nonPublicIpv4.check(address, "ipv4")
  if (family === 6) return nonPublicIpv6.check(address, "ipv6")
  return false
}

function isLoopbackHost(hostname) {
  const normalized = hostname.endsWith(".") ? hostname.slice(0, -1) : hostname
  return (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized === "[::1]" ||
    /^127(?:\.\d{1,3}){3}$/u.test(normalized)
  )
}

export function parseProductionOrigin(value, name) {
  if (!value?.trim()) throw new Error(`缺少 ${name}`)

  try {
    const url = new URL(value.trim())
    if (
      url.protocol !== "https:" ||
      url.username !== "" ||
      url.password !== "" ||
      url.pathname !== "/" ||
      url.search !== "" ||
      url.hash !== "" ||
      isLoopbackHost(url.hostname) ||
      isNonPublicIpLiteral(url.hostname)
    ) {
      throw new Error("不是允许的生产 HTTPS origin")
    }
    return url
  } catch {
    throw new Error(
      `${name} 必须是无路径 HTTPS origin，且不能是 localhost 或私网/保留 IP 字面量`,
    )
  }
}

function readJwtRole(value) {
  const payload = value.split(".")[1]
  if (!payload) return null

  try {
    const normalized = payload.replace(/-/gu, "+").replace(/_/gu, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    return JSON.parse(globalThis.atob(padded)).role ?? null
  } catch {
    return null
  }
}

export function containsForbiddenClientSecret(value) {
  if (typeof value !== "string" || value === "") return false

  const fixedSecretPatterns = [
    /sb_secret_[A-Za-z0-9_-]{16,}/u,
    /postgres(?:ql)?:\/\/[^\s:@]+:[^\s@]+@/iu,
    /(?:SMTP_PASSWORD|SUPABASE_ACCESS_TOKEN)\s*[:=]\s*["'][^"']{8,}/iu,
  ]
  if (fixedSecretPatterns.some((pattern) => pattern.test(value))) return true

  const jwtPattern = /[A-Za-z0-9_-]{2,}\.[A-Za-z0-9_-]{2,}\.[A-Za-z0-9_-]{2,}/gu
  return [...value.matchAll(jwtPattern)].some(
    ([candidate]) => readJwtRole(candidate) === "service_role",
  )
}

export function findForbiddenPublicEnvNames(env = process.env) {
  return Object.keys(env).filter((name) => {
    if (!name.startsWith("NEXT_PUBLIC_")) return false

    const normalizedName = name
      .slice("NEXT_PUBLIC_".length)
      .replace(/[^A-Za-z0-9]/gu, "")
      .toUpperCase()

    return [
      "SERVICEROLE",
      "SERVICEKEY",
      "SECRET",
      "PASSWORD",
      "ACCESSTOKEN",
      "DATABASEURL",
      "PRIVATEKEY",
    ].some((forbiddenPart) => normalizedName.includes(forbiddenPart))
  })
}

export function assertProductionPublishableKey(value, name) {
  if (!value?.trim()) throw new Error(`缺少 ${name}`)

  const key = value.trim()
  const isPublishableKey = /^sb_publishable_[A-Za-z0-9_-]+$/u.test(key)
  const isLegacyAnonKey = readJwtRole(key) === "anon"
  if (
    key === PLACEHOLDER_PUBLISHABLE_KEY ||
    key.startsWith("sb_secret_") ||
    (!isPublishableKey && !isLegacyAnonKey)
  ) {
    throw new Error(`${name} 必须是 Supabase Publishable Key 或 legacy anon key`)
  }
  return key
}

export function assertExpectedReleaseCommit(expectedValue, actualValue) {
  const expected = expectedValue?.trim().toLowerCase()
  const actual = actualValue?.trim().toLowerCase()

  if (!expected) throw new Error("缺少 EXPECTED_RELEASE_COMMIT_SHA")
  if (!FULL_GIT_COMMIT_PATTERN.test(expected)) {
    throw new Error("EXPECTED_RELEASE_COMMIT_SHA 必须是完整 Git commit SHA")
  }
  if (!actual || !FULL_GIT_COMMIT_PATTERN.test(actual)) {
    throw new Error("当前 Git commit SHA 无效")
  }
  if (expected !== actual) {
    throw new Error(
      `当前 commit ${actual} 与 EXPECTED_RELEASE_COMMIT_SHA 不一致`,
    )
  }
  return actual
}

export function readPublicProductionConfig(env = process.env) {
  const deploymentTier = env.APP_DEPLOYMENT_TIER?.trim()
  if (deploymentTier && deploymentTier !== "production") {
    throw new Error("生产发布禁止使用 local 或 preview 部署层")
  }

  const forbiddenPublicNames = findForbiddenPublicEnvNames(env)
  if (forbiddenPublicNames.length > 0) {
    throw new Error(`发现禁止公开的环境变量名：${forbiddenPublicNames.join(", ")}`)
  }

  const siteUrl = parseProductionOrigin(
    env.NEXT_PUBLIC_SITE_URL,
    "NEXT_PUBLIC_SITE_URL",
  )
  const supabaseUrl = parseProductionOrigin(
    env.NEXT_PUBLIC_SUPABASE_URL,
    "NEXT_PUBLIC_SUPABASE_URL",
  )
  const publishableKey = assertProductionPublishableKey(
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  )

  return { siteUrl, supabaseUrl, publishableKey }
}

export function readProductionDatabaseConfig(env = process.env) {
  const projectRef = env.EXPECTED_SUPABASE_PROJECT_REF?.trim()
  if (!projectRef) throw new Error("缺少 EXPECTED_SUPABASE_PROJECT_REF")
  if (!SUPABASE_PROJECT_REF_PATTERN.test(projectRef)) {
    throw new Error("EXPECTED_SUPABASE_PROJECT_REF 必须是 20 位小写字母")
  }

  const supabaseUrl = parseProductionOrigin(
    env.PRODUCTION_SUPABASE_URL,
    "PRODUCTION_SUPABASE_URL",
  )
  const expectedSupabaseOrigin = `https://${projectRef}.supabase.co`
  if (supabaseUrl.origin !== expectedSupabaseOrigin) {
    throw new Error(
      `PRODUCTION_SUPABASE_URL 必须与 EXPECTED_SUPABASE_PROJECT_REF 精确匹配：${expectedSupabaseOrigin}`,
    )
  }
  const publishableKey = assertProductionPublishableKey(
    env.PRODUCTION_SUPABASE_PUBLISHABLE_KEY,
    "PRODUCTION_SUPABASE_PUBLISHABLE_KEY",
  )

  return { projectRef, supabaseUrl, publishableKey }
}
