import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"
import process from "node:process"

import { findForbiddenPublicEnvNames } from "./production-config.mjs"

const root = process.cwd()
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"])
const PRIVATE_ENV_NAMES = [
  "ANON_KEY",
  "DATABASE_URL",
  "DB_URL",
  "JWT_SECRET",
  "SECRET_KEY",
  "SERVICE_ROLE_KEY",
  "SMTP_PASSWORD",
  "SUPABASE_ACCESS_TOKEN",
  "SUPABASE_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
]

export function parseSupabaseStatus(output) {
  const values = {}

  for (const line of output.split(/\r?\n/gu)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/u)
    if (!match) continue

    const [, name, rawValue] = match
    if (!name || rawValue === undefined) continue

    values[name] = decodeStatusValue(rawValue)
  }

  return values
}

export function createLocalPublicEnv(statusOutput, baseEnv = process.env) {
  const forbiddenPublicNames = findForbiddenPublicEnvNames(baseEnv)
  if (forbiddenPublicNames.length > 0) {
    throw new Error(
      `本地构建环境包含禁止公开的变量名：${forbiddenPublicNames.join(", ")}`,
    )
  }

  const status = parseSupabaseStatus(statusOutput)
  const apiUrl = requireLocalOrigin(status.API_URL, "Supabase Local API_URL")
  const mailpitUrl = requireLocalOrigin(status.MAILPIT_URL, "Supabase Local MAILPIT_URL")
  const publishableKey = status.PUBLISHABLE_KEY?.trim()

  if (!publishableKey || !/^sb_publishable_[A-Za-z0-9_-]+$/u.test(publishableKey)) {
    throw new Error("Supabase Local 没有返回有效 Publishable Key")
  }

  const childEnv = {
    ...baseEnv,
    APP_DEPLOYMENT_TIER: "local",
    MAILPIT_URL: mailpitUrl,
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishableKey,
    NEXT_PUBLIC_SUPABASE_URL: apiUrl,
  }

  delete childEnv.VERCEL_ENV
  for (const name of PRIVATE_ENV_NAMES) delete childEnv[name]

  return childEnv
}

function decodeStatusValue(rawValue) {
  const value = rawValue.trim()
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value)
    } catch {
      throw new Error("Supabase Local 状态包含无法解析的引号值")
    }
  }
  return value
}

function requireLocalOrigin(value, label) {
  if (!value?.trim()) throw new Error(`${label} 缺失`)

  try {
    const url = new URL(value.trim())
    if (
      url.protocol !== "http:" ||
      !LOCAL_HOSTS.has(url.hostname) ||
      url.username !== "" ||
      url.password !== "" ||
      url.pathname !== "/" ||
      url.search !== "" ||
      url.hash !== ""
    ) {
      throw new Error("不是本地 HTTP origin")
    }
    return url.origin
  } catch {
    throw new Error(`${label} 必须是本机 HTTP origin`)
  }
}

function runLocalMode(mode) {
  const commandByMode = {
    build: [path.join(root, "node_modules", "next", "dist", "bin", "next"), "build"],
    e2e: [path.join(root, "node_modules", "@playwright", "test", "cli.js"), "test"],
  }
  const command = commandByMode[mode]
  if (!command) throw new Error("本地 Supabase 运行器只接受 e2e 或 build")

  const supabaseCli = path.join(
    root,
    "node_modules",
    "supabase",
    "dist",
    "supabase.js",
  )
  const status = spawnSync(
    process.execPath,
    [supabaseCli, "status", "-o", "env"],
    { cwd: root, encoding: "utf8", windowsHide: true },
  )
  if (status.status !== 0) {
    throw new Error("Supabase Local 未运行或无法读取状态")
  }

  const result = spawnSync(process.execPath, command, {
    cwd: root,
    env: createLocalPublicEnv(status.stdout),
    stdio: "inherit",
    windowsHide: true,
  })
  if (result.error) throw result.error
  process.exit(result.status ?? 1)
}

const currentFile = path.resolve(fileURLToPath(import.meta.url))
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null
if (invokedFile === currentFile) {
  try {
    runLocalMode(process.argv[2])
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}
