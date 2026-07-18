import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

async function expectNoBlockingA11y(page: Page) {
  const result = await new AxeBuilder({ page }).analyze()
  expect(result.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([])
}

test("Launch 首页围绕 Build Blocks 和搜索展示", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Build AI products faster with reusable UI, prompts and code.")
  await expect(page.getByRole("searchbox", { name: "Search Build Blocks" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: "Featured Build Blocks" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Glass" }).first()).toHaveAttribute("href", "/explore?q=Glass")
  await expect(page.getByRole("link", { name: "Explore Blueprint" }).first()).toHaveAttribute("href", "/blueprints")
  await expect(page.getByText("120+").first()).toBeVisible()
  await expect(page.locator("article.capability-card").first()).toBeVisible()
  await expectNoBlockingA11y(page)
})

test("Launch 搜索、Preview、Package 状态和移动端路径可用", async ({ page }) => {
  await page.goto("/explore?q=Glass")
  await expect(page.getByRole("heading", { level: 2, name: "1 Build Blocks" })).toBeVisible()
  await page.getByRole("link", { name: "Glass Surface" }).first().click()
  await expect(page).toHaveURL(/\/explore\/glass-surface$/u)
  await expect(page.getByRole("heading", { level: 1, name: "Glass Surface" })).toBeVisible()
  await expect(page.getByText("Preview only", { exact: true })).toBeVisible()
  await expect(page.getByText("No purchase or download yet", { exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: "From preview to your project." })).toBeVisible()
  await expect(page.getByRole("button", { name: "Get Block" })).toBeDisabled()

  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ["/", "/explore", "/explore/color-extraction", "/about", "/license", "/copyright", "/privacy"]) {
      await page.goto(path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, `${path} 在 ${width}px 出现横向溢出`).toBeLessThanOrEqual(0)
    }
  }
})

test("Launch 静态 SEO 页面与 404 存在", async ({ request }) => {
  for (const path of ["/about", "/license", "/copyright", "/privacy", "/explore", "/bundles"]) {
    const response = await request.get(path)
    expect(response.ok(), path).toBe(true)
  }
  const notFound = await request.get("/launch-not-found")
  expect(notFound.status()).toBe(404)
  const robots = await (await request.get("/robots.txt")).text()
  expect(robots).toContain("Allow: /explore")
  expect(robots).toContain("Allow: /about")
  const sitemap = await (await request.get("/sitemap.xml")).text()
  expect(sitemap).toContain("/explore/color-extraction")
  expect(sitemap).toContain("/license")
})
