import { createHash } from "node:crypto"
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"

import {
  assertExpectedReleaseCommit,
  containsForbiddenClientSecret,
  readProductionDatabaseConfig,
  readPublicProductionConfig,
} from "./production-config.mjs"

const projectRoot = process.cwd()
const packageJson = JSON.parse(
  readFileSync(path.join(projectRoot, "package.json"), "utf8"),
)
const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm"
const expectedMigrations = [
  "20260716000100_initial_catalog.sql",
  "20260716000200_base_catalog_content.sql",
  "20260716000300_launch_catalog_content.sql",
  "20260717000100_blueprint_marketplace_foundation.sql",
  "20260717000200_colorsnap_pilot_access.sql",
]
const expectedVercelCliVersion = "56.2.1"

function fail(message) {
  throw new Error(`发布预检失败：${message}`)
}

function run(file, args, options = {}) {
  try {
    return execFileSync(file, args, {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      ...options,
    }).trim()
  } catch {
    fail(`${file} ${args.join(" ")} 未成功`)
  }
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex")
}

function requireProductionEnv() {
  try {
    const publicConfig = readPublicProductionConfig()
    const databaseConfig = readProductionDatabaseConfig({
      EXPECTED_SUPABASE_PROJECT_REF:
        process.env.EXPECTED_SUPABASE_PROJECT_REF,
      PRODUCTION_SUPABASE_URL: publicConfig.supabaseUrl.origin,
      PRODUCTION_SUPABASE_PUBLISHABLE_KEY: publicConfig.publishableKey,
    })
    return { ...publicConfig, projectRef: databaseConfig.projectRef }
  } catch (error) {
    fail(error instanceof Error ? error.message : "生产环境变量无效")
  }
}

function verifyGitBaseline() {
  run("git", ["rev-parse", "--verify", "HEAD"])
  const status = run("git", ["status", "--porcelain", "--", "."])
  if (status) fail("项目目录不是干净的已提交版本")
  return run("git", ["rev-parse", "HEAD"])
}

function verifyExpectedCommit(commit) {
  try {
    return assertExpectedReleaseCommit(
      process.env.EXPECTED_RELEASE_COMMIT_SHA,
      commit,
    )
  } catch (error) {
    fail(error instanceof Error ? error.message : "commit SHA 无效")
  }
}

function verifyCliVersion() {
  const expected = packageJson.devDependencies?.supabase
  if (typeof expected !== "string") fail("package.json 未固定 Supabase CLI")
  const actual = run(command, ["exec", "supabase", "--version"])
  if (actual !== expected) {
    fail(`Supabase CLI 版本不一致，期望 ${expected}，实际 ${actual}`)
  }
  return actual
}

function verifyMigrations() {
  const migrationRoot = path.join(projectRoot, "supabase", "migrations")
  const actual = readdirSync(migrationRoot)
    .filter((name) => name.endsWith(".sql"))
    .sort()
  if (JSON.stringify(actual) !== JSON.stringify(expectedMigrations)) {
    fail("生产迁移文件集合与发布合同不一致")
  }

  const baseMigration = path.join(migrationRoot, expectedMigrations[1])
  const launchMigration = path.join(migrationRoot, expectedMigrations[2])
  if (
    readFileSync(baseMigration, "utf8") !==
    readFileSync(path.join(projectRoot, "supabase", "seed.sql"), "utf8")
  ) {
    fail("基础内容 migration 与 seed.sql 不一致")
  }
  if (
    readFileSync(launchMigration, "utf8") !==
    readFileSync(path.join(projectRoot, "supabase", "seed_content.sql"), "utf8")
  ) {
    fail("首发内容 migration 与 seed_content.sql 不一致")
  }

  return Object.fromEntries(
    actual.map((name) => [name, sha256(path.join(migrationRoot, name))]),
  )
}

function textFiles(root) {
  if (!existsSync(root)) return []
  const files = []
  for (const entry of readdirSync(root)) {
    const filePath = path.join(root, entry)
    const stat = statSync(filePath)
    if (stat.isDirectory()) files.push(...textFiles(filePath))
    else if (stat.size <= 5_000_000) files.push(filePath)
  }
  return files
}

function verifyClientBundle() {
  const leakedFiles = textFiles(path.join(projectRoot, ".next", "static")).filter(
    (filePath) => containsForbiddenClientSecret(readFileSync(filePath, "utf8")),
  )
  if (leakedFiles.length > 0) fail("浏览器构建产物包含禁止的秘密格式")
}

const productionConfig = requireProductionEnv()
const commit = verifyExpectedCommit(verifyGitBaseline())
const supabaseCliVersion = verifyCliVersion()
const migrations = verifyMigrations()
run(command, ["build"], {
  env: { ...process.env, VERCEL_ENV: "production" },
})
verifyClientBundle()
verifyExpectedCommit(verifyGitBaseline())

const evidence = {
  schemaVersion: 1,
  commit,
  projectRef: productionConfig.projectRef,
  siteOrigin: productionConfig.siteUrl.origin,
  supabaseOrigin: productionConfig.supabaseUrl.origin,
  packageLockSha256: sha256(path.join(projectRoot, "pnpm-lock.yaml")),
  buildId: readFileSync(path.join(projectRoot, ".next", "BUILD_ID"), "utf8").trim(),
  migrationSha256: migrations,
  toolchain: {
    supabaseCli: supabaseCliVersion,
    requiredVercelCli: expectedVercelCliVersion,
  },
}

console.log(`RELEASE_PREFLIGHT_EVIDENCE=${JSON.stringify(evidence)}`)
