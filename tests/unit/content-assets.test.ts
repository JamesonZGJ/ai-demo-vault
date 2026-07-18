import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

type CoverAsset = {
  slug: string
  path: string
  sha256: string
  role: string
  alt: string
  origin_kind: string
  rights_holder: string
  license: string
  authorization: string
  width: number
  height: number
  is_abstract: boolean
  is_product_screenshot: boolean
}

type ProductAsset = {
  slug: string
  path: string
  sha256: string
  role: string
  media_type: "image" | "gif" | "video"
  alt: string
  rights_holder: string
  license_terms: string
  authorization: string
  source_url: string
  permission_basis: string
  explicit_permission: boolean
  captured_by_site: boolean
  is_abstract: boolean
  static_poster_path?: string
  static_poster_sha256?: string
}

type SeedCase = {
  slug: string
  cover_path: string
  cover_alt: string
  cover_hash: string
  preview: Omit<ProductAsset, "slug">
}

type AssetManifest<T> = {
  asset_count: number
  hash_algorithm: string
  assets: T[]
}

const projectRoot = process.cwd()
const publicRoot = path.resolve(projectRoot, "public")
const coverManifest = readManifest<CoverAsset>("content/media-rights.json")
const productManifest = readManifest<ProductAsset>("content/product-media-rights.json")
const seedSource = readFileSync(
  path.join(projectRoot, "supabase/seed_content.sql"),
  "utf8",
)
const seedCatalog = readSeedCatalog(seedSource)

const launchSlugs = [
  "anythingllm",
  "cogvideo",
  "funclip",
  "maxkb",
  "novel",
  "open-notebook",
  "opengame",
  "postiz",
  "pptagent",
  "presenton",
  "restorephotos",
  "roomgpt",
].sort()

function readManifest<T>(relativePath: string): AssetManifest<T> {
  return JSON.parse(
    readFileSync(path.join(projectRoot, relativePath), "utf8"),
  ) as AssetManifest<T>
}

function publicFilePath(assetPath: string) {
  expect(assetPath).toMatch(/^\/media\//u)
  expect(assetPath.includes("\\")).toBe(false)

  const resolvedPath = path.resolve(publicRoot, `.${assetPath}`)
  const relativePath = path.relative(publicRoot, resolvedPath)
  expect(relativePath.startsWith("..") || path.isAbsolute(relativePath)).toBe(false)
  return resolvedPath
}

function sha256(filePath: string) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex")
}

function readSeedCatalog(source: string): SeedCase[] {
  const match = source.match(/\$catalog\$\s*([\s\S]*?)\s*\$catalog\$::jsonb/u)
  if (!match?.[1]) {
    throw new Error("seed_content.sql 缺少可解析的 $catalog$ JSON")
  }

  return JSON.parse(match[1]) as SeedCase[]
}

describe("首发案例素材契约", () => {
  it("封面与产品预览恰好对应同一批 12 个案例", () => {
    expect(coverManifest.asset_count).toBe(12)
    expect(productManifest.asset_count).toBe(12)
    expect(coverManifest.assets).toHaveLength(coverManifest.asset_count)
    expect(productManifest.assets).toHaveLength(productManifest.asset_count)
    expect(seedCatalog).toHaveLength(12)
    expect(coverManifest.assets.map(({ slug }) => slug).sort()).toEqual(launchSlugs)
    expect(productManifest.assets.map(({ slug }) => slug).sort()).toEqual(launchSlugs)
    expect(seedCatalog.map(({ slug }) => slug).sort()).toEqual(launchSlugs)
  })

  it("所有清单文件存在且 SHA-256 与登记值一致", () => {
    for (const manifest of [coverManifest, productManifest]) {
      expect(manifest.hash_algorithm).toBe("SHA-256")

      for (const asset of manifest.assets) {
        const filePath = publicFilePath(asset.path)
        expect(existsSync(filePath), `${asset.slug} 素材不存在`).toBe(true)
        expect(sha256(filePath), `${asset.slug} 素材哈希不一致`).toBe(asset.sha256)
      }
    }
  })

  it("原创封面只作为抽象目录图，不冒充产品界面", () => {
    for (const asset of coverManifest.assets) {
      expect(asset.role).toBe("cover")
      expect(asset.origin_kind).toBe("original")
      expect(asset.authorization).toBe("approved")
      expect(asset.alt.trim()).not.toBe("")
      expect(asset.rights_holder.trim()).not.toBe("")
      expect(asset.license.trim()).not.toBe("")
      expect(asset.is_abstract).toBe(true)
      expect(asset.is_product_screenshot).toBe(false)
      expect([asset.width, asset.height]).toEqual([1586, 992])
    }
  })

  it("每份产品预览都有官方 HTTPS 来源和明确使用依据", () => {
    for (const asset of productManifest.assets) {
      expect(asset.role).toBe("product_preview")
      expect(asset.authorization).toBe("approved")
      expect(asset.is_abstract).toBe(false)
      expect(asset.alt.trim()).not.toBe("")
      expect(asset.rights_holder.trim()).not.toBe("")
      expect(asset.license_terms.trim()).not.toBe("")
      expect(asset.permission_basis.trim()).not.toBe("")
      expect(asset.source_url).toMatch(/^https:\/\//u)
      expect(asset.explicit_permission || asset.captured_by_site).toBe(true)
    }
  })

  it("获准使用的 GIF 同时登记静态海报且文件存在", () => {
    const animatedAssets = productManifest.assets.filter(
      ({ media_type }) => media_type === "gif",
    )

    expect(animatedAssets.length).toBeGreaterThan(0)
    for (const asset of animatedAssets) {
      expect(asset.static_poster_path).toBeTruthy()
      expect(asset.static_poster_sha256).toMatch(/^[0-9a-f]{64}$/u)
      const posterPath = publicFilePath(asset.static_poster_path!)
      expect(existsSync(posterPath)).toBe(true)
      expect(sha256(posterPath)).toBe(asset.static_poster_sha256)
    }
  })

  it("数据库种子与两份权属清单逐案例一致", () => {
    const covers = new Map(coverManifest.assets.map((asset) => [asset.slug, asset]))
    const previews = new Map(productManifest.assets.map((asset) => [asset.slug, asset]))

    for (const item of seedCatalog) {
      const cover = covers.get(item.slug)
      const preview = previews.get(item.slug)
      expect(cover, `${item.slug} 缺少封面清单`).toBeDefined()
      expect(preview, `${item.slug} 缺少产品预览清单`).toBeDefined()

      expect({
        alt: item.cover_alt,
        path: item.cover_path,
        sha256: item.cover_hash,
      }).toEqual({
        alt: cover!.alt,
        path: cover!.path,
        sha256: cover!.sha256,
      })

      const previewContract = Object.fromEntries(
        Object.entries(preview!).filter(([key]) => key !== "slug"),
      )
      expect(item.preview).toEqual(previewContract)
    }
  })
})
