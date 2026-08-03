import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

async function expectNoBlockingA11y(page: Page) {
  const result = await new AxeBuilder({ page }).analyze()
  expect(result.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([])
}

test("Launch 首页围绕 Build Blocks 和搜索展示", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("找到 AI 产品里真正可复用的交互模块")
  await expect(page.getByRole("searchbox", { name: "搜索 AI 产品模块" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: "精选 AI 构建模块" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: "最近完成" })).toBeVisible()
  await expect(page.getByRole("link", { name: "智能输入框" })).toHaveAttribute("href", "/explore?q=Prompt%20Composer")
  await expect(page.getByText("120+")).toHaveCount(0)
  await expect(page.getByText("Mock", { exact: true })).toHaveCount(0)
  await expect(page.getByText("免费开放", { exact: true }).first()).toBeVisible()
  await expect(page.locator("article.vault-block-card")).toHaveCount(12)
  await expectNoBlockingA11y(page)
})

test("Launch 搜索、Preview、Package 状态和移动端路径可用", async ({ page }) => {
  await page.goto("/explore")
  await page.getByRole("searchbox", { name: "即时搜索模块" }).fill("Glass Surface")
  await expect(page.getByRole("heading", { level: 1, name: "1 个 Build Blocks" })).toBeVisible()
  await page.getByRole("link", { name: "玻璃拟态卡片" }).first().click()
  await expect(page).toHaveURL(/\/explore\/glass-surface$/u)
  await expect(page.getByRole("heading", { level: 1, name: "玻璃拟态卡片" })).toBeVisible()
  await expect(page.getByText("资料已准备", { exact: true })).toBeVisible()
  await expect(page.getByText("当前资料免费公开，无需支付。", { exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: "接入顺序" })).toBeVisible()
  await expect(page.getByRole("link", { name: "查看源码与接入说明" })).toHaveAttribute("href", "#materials")
  await expect(page.getByText("免费开放 · 无需支付", { exact: true })).toBeVisible()
  await expect(page.getByText(/获取模块/u)).toHaveCount(0)

  for (const width of [360, 390, 430, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of ["/", "/explore", "/explore/color-extraction", "/about", "/license", "/copyright", "/privacy"]) {
      await page.goto(path)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow, `${path} 在 ${width}px 出现横向溢出`).toBeLessThanOrEqual(0)
      if (path === "/") expect(await page.evaluate(() => window.scrollY), `首页在 ${width}px 自动滚动`).toBe(0)
    }
  }
})

test("Launch 静态 SEO 页面与 404 存在", async ({ page, request }) => {
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

  const bundles = await (await request.get("/bundles")).text()
  expect(bundles).not.toContain("mock price")
  await page.goto("/bundles")
  await expect(page.getByText(/\$29/u)).toHaveCount(0)
})
