import { randomUUID } from "node:crypto"

import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Locator, type Page } from "@playwright/test"

import {
  assertLocalAuthServices,
  findConfirmationUrl,
} from "./support/local-auth"

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
siteUrl.pathname = "/"
siteUrl.search = ""
siteUrl.hash = ""

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
]

async function expectNoSeriousAccessibilityIssues(page: Page) {
  const result = await new AxeBuilder({ page }).analyze()
  const blocking = result.violations.filter(
    ({ impact }) => impact === "serious" || impact === "critical",
  )
  expect(blocking).toEqual([])
}

async function expectCardsUseProductMedia(cards: Locator) {
  const media = cards.locator(".demo-card-media img, .demo-card-media video")
  await expect(media).toHaveCount(await cards.count())
  const descriptions = await media.evaluateAll((elements) =>
    elements.map((element) =>
      element instanceof HTMLImageElement
        ? element.alt
        : (element.getAttribute("aria-label") ?? ""),
    ),
  )
  expect(descriptions.every((description) => description.length > 0)).toBe(true)
  expect(descriptions.every((description) => !description.includes("本站原创抽象封面"))).toBe(true)
}

async function readCatalogTotal(page: Page) {
  const resultStatus = page
    .getByRole("status")
    .filter({ hasText: /^共 \d+ 个公开案例/u })
  await expect(resultStatus).toHaveCount(1)

  const text = await resultStatus.innerText()
  const match = /^共 (\d+) 个公开案例/u.exec(text)
  if (!match) throw new Error(`目录结果数量格式无效：${text}`)

  return Number(match[1])
}

test("公开首页、目录和隐私说明只展示真实数据库状态", async ({ page }) => {
  await page.goto("/demos")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("购买复刻资料")
  const catalogTotal = await readCatalogTotal(page)
  const catalogCards = page.locator(".catalog-results article.demo-card")
  expect(catalogTotal).toBe(12)
  await expect(catalogCards).toHaveCount(12)
  await expect(page.getByRole("heading", { level: 3, name: "ColorSnap" })).toBeVisible()
  await expect(page.getByText("另有 1 个 Blueprint 预发布 Demo")).toBeVisible()
  await expect(
    page.getByRole("heading", { level: 2, name: "没有符合当前条件的案例" }),
  ).toHaveCount(0)
  await expect(catalogCards.first()).toBeVisible()
  await expectCardsUseProductMedia(catalogCards)
  await expect(catalogCards.locator(".demo-card-media img").nth(0)).toHaveAttribute(
    "loading",
    "eager",
  )
  await expect(catalogCards.locator(".demo-card-media img").nth(1)).toHaveAttribute(
    "loading",
    "eager",
  )
  await expect(catalogCards.locator(".demo-card-media img").nth(2)).toHaveAttribute(
    "loading",
    "eager",
  )
  await expect(catalogCards.locator(".demo-card-media img").nth(3)).toHaveAttribute(
    "loading",
    "lazy",
  )
  await expectNoSeriousAccessibilityIssues(page)

  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Build your next AI product in days, not months.")
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/u)
  await expect(page.getByRole("heading", { level: 3, name: "ColorSnap Blueprint" }).first()).toBeVisible()
  const homeCards = page.locator("article.blueprint-card")
  await expect(page.getByRole("heading", { level: 2, name: "Featured Blueprint" })).toBeVisible()
  await expect(page.getByText("Blueprint Score", { exact: false }).first()).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: "Categories" })).toBeVisible()
  await expect(page.getByRole("searchbox", { name: "Search Blueprints" })).toBeVisible()
  expect(await homeCards.count()).toBeGreaterThan(0)
  await expect(homeCards.first()).toBeVisible()
  await expectNoSeriousAccessibilityIssues(page)

  await page.goto("/privacy")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("最少数据")
  await expect(page.getByText("登录、注册、邮件确认、个人收藏和本隐私页面不发送页面分析事件。"))
    .toBeVisible()
})

test("游客能从首页搜索、组合筛选并读完一个真实案例", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "Preview a free Demo" }).click()
  await expect(page).toHaveURL(new URL("/demos", siteUrl).toString())
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/u)

  await page.locator("#desktop-filter-q").fill("RoomGPT")
  await page.locator("#desktop-filter-category").selectOption("interior-design")
  await page.locator("#desktop-filter-tool").selectOption("controlnet")
  await page.locator("#desktop-filter-difficulty").selectOption("intermediate")
  await page.locator("#desktop-filter-region").selectOption("international")
  await page
    .locator(".catalog-filters-desktop")
    .getByRole("button", { name: "应用筛选" })
    .click()

  await expect(page).toHaveURL(
    new URL(
      "/demos?q=RoomGPT&category=interior-design&tool=controlnet&difficulty=intermediate&region=international",
      siteUrl,
    ).toString(),
  )
  expect(await readCatalogTotal(page)).toBe(1)
  await page.getByRole("link", { exact: true, name: "RoomGPT" }).click()

  await expect(page).toHaveURL(new URL("/demos/roomgpt", siteUrl).toString())
  for (const heading of [
    "真实产品画面",
    "真实性与公开证据",
    "这个产品为什么成立",
    "从现有产品推导一个新机会",
    "来源与内容标签",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name: heading })).toBeVisible()
  }
  const productImage = page.getByRole("img", {
    name: /RoomGPT 官方开源仓库中的界面截图/u,
  })
  await expect(productImage).toBeVisible()
  expect(
    await productImage.evaluate((image) => getComputedStyle(image).objectFit),
  ).toBe("contain")

  await expect(page.getByText("源码已公开", { exact: true })).toBeVisible()
  await expect(page.getByText(/可用范围以已核验仓库中的许可证和素材权利说明为准/u))
    .toBeVisible()
  await expect(page.getByRole("link", { name: /查看仓库/u })).toHaveAttribute(
    "href",
    /^https:\/\/github\.com\//u,
  )

  const breakdownClaims = [
    ["产品是什么", "有来源事实", true],
    ["为什么成立", "编辑推断", false],
    ["用户痛点", "编辑推断", false],
    ["解决方案", "有来源事实", true],
    ["目标用户", "编辑推断", false],
    ["核心功能", "有来源事实", true],
    ["AI 实现", "有来源事实", true],
    ["技术实现", "编辑推断", false],
    ["盈利方式", "编辑推断", false],
  ] as const

  for (const [heading, claimLabel, hasSource] of breakdownClaims) {
    const item = page.locator("#breakdown .breakdown-list > article", {
      has: page.getByRole("heading", { level: 3, name: heading }),
    })
    await expect(item).toHaveCount(1)
    await expect(item.locator(".claim-badge")).toHaveText(claimLabel)
    const sourceLink = item.getByRole("link", { name: /查看依据/u })
    await expect(sourceLink).toHaveCount(hasSource ? 1 : 0)
    if (hasSource) {
      await expect(sourceLink).toHaveAttribute("href", /^https:\/\//u)
      await expect(sourceLink).toHaveText(/^查看依据 · \d{4}/u)
    }
  }

  const productOverview = page.locator("#breakdown .breakdown-list > article", {
    has: page.getByRole("heading", { level: 3, name: "产品是什么" }),
  })
  await expect(
    productOverview.getByText(/官方仓库说明用户可上传房间照片并生成不同主题的改造结果/u),
  ).toBeVisible()
  await expect(productOverview.getByRole("link", { name: /查看依据/u })).toHaveAttribute(
    "href",
    "https://github.com/Nutlope/roomGPT",
  )

  const boundaryClaim = page.locator("#boundary > .claim-context")
  await expect(boundaryClaim.locator(".claim-badge")).toHaveText("编辑推断")
  await expect(boundaryClaim.getByRole("link", { name: /查看依据/u })).toHaveCount(0)
  await expect(
    page.locator("#boundary").getByText(/实现边界由官方资料与编辑复核共同整理/u),
  ).toBeVisible()
  await expect(page.locator("#boundary").getByRole("heading", { level: 3 })).toHaveText([
    "已实现",
    "模拟",
    "未实现",
  ])

  const adaptationClaim = page.locator("#adaptation > .claim-context")
  await expect(adaptationClaim.locator(".claim-badge")).toHaveText("产品假设")
  await expect(adaptationClaim.getByRole("link", { name: /查看依据/u })).toHaveCount(0)
  await expectNoSeriousAccessibilityIssues(page)
})

test("ColorSnap 免费 Demo 明确导向十二个商品区块和七类资料", async ({ page }) => {
  await page.goto("/demos")
  const pilotCard = page.locator(".pilot-demo-card")
  await pilotCard.getByRole("link", { name: "浏览免费 Demo" }).click()
  await expect(page).toHaveURL(new URL("/demos/colorsnap", siteUrl).toString())
  await expect(page.getByText(/不是 AI、真实社区或商业结果/u)).toBeVisible()
  await page.getByRole("link", { name: "查看 ColorSnap Blueprint" }).first().click()

  await expect(page).toHaveURL(
    new URL("/blueprints/colorsnap-blueprint", siteUrl).toString(),
  )
  await expect(page.getByRole("heading", { level: 1, name: "ColorSnap Blueprint" })).toBeVisible()
  for (const label of [
    "Product Overview",
    "Target Users",
    "Problem",
    "Solution",
    "Feature Map",
    "User Flow",
    "UI Screens",
    "PRD",
    "Tech Stack",
    "Prompt Templates",
    "Monetization Model",
    "Marketing Strategy",
  ]) {
    await expect(page.getByText(label, { exact: false }).first()).toBeVisible()
  }
  for (const heading of [
    "Market Opportunity",
    "Target Users",
    "Business Model",
    "Tech Stack",
    "Blueprint Score",
    "Build Timeline",
    "What's Included",
  ]) {
    await expect(page.getByRole("heading", { name: heading }).first()).toBeVisible()
  }
  await expect(page.getByText("Preview edition").first()).toBeVisible()
  await expect(page.getByText(/本地无扣款预览/u).first()).toBeVisible()
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/u)
  await expectNoSeriousAccessibilityIssues(page)

  await page.getByRole("link", { name: "Buy Blueprint" }).first().click()
  await expect(page).toHaveURL(
    new URL("/checkout/colorsnap-blueprint", siteUrl).toString(),
  )
  await expect(page.getByRole("heading", { level: 1, name: "确认模拟购买" })).toBeVisible()
  await expect(page.getByText("不适用（本次无扣款）", { exact: true })).toBeVisible()
  await expect(page.getByRole("link", { name: "登录后继续" })).toBeVisible()
})

test("四种排序、越界页和确定性空结果保持真实 URL 语义", async ({ page }) => {
  const sorts = [
    ["newest", "/demos"],
    ["commercial-potential", "/demos?sort=commercial-potential"],
    ["most-favorited", "/demos?sort=most-favorited"],
    ["editor-pick", "/demos?sort=editor-pick"],
  ] as const

  for (const [sort, expectedPath] of sorts) {
    await page.goto(`/demos?sort=${sort}`)
    await expect(page).toHaveURL(new URL(expectedPath, siteUrl).toString())
    await expect(page.locator("#desktop-filter-sort")).toHaveValue(sort)
    expect(await readCatalogTotal(page)).toBe(12)
  }

  await page.goto("/demos?sort=commercial-potential")
  const scores = (await page.locator(".catalog-results .potential-score strong").allTextContents())
    .map((value) => Number.parseInt(value, 10))
  expect(scores).toEqual([...scores].sort((left, right) => right - left))

  await page.goto("/demos?page=2")
  await expect(page).toHaveURL(new URL("/demos", siteUrl).toString())

  await page.goto("/demos?q=definitely-no-such-ai-demo")
  expect(await readCatalogTotal(page)).toBe(0)
  await expect(page.locator(".catalog-results article.demo-card")).toHaveCount(0)
  await expect(
    page.getByRole("heading", { level: 2, name: "没有符合当前条件的案例" }),
  ).toBeVisible()
})

test("非法筛选参数以 307 语义清理为 canonical URL", async ({ request }) => {
  const response = await request.get("/demos?difficulty=impossible&page=-2", {
    maxRedirects: 0,
  })
  expect(response.status()).toBe(307)
  expect(response.headers().location).toBe("/demos")

  const dynamicInvalid = await request.get("/demos?category=not-a-real-category", {
    maxRedirects: 0,
  })
  expect(dynamicInvalid.status()).toBe(307)
  expect(dynamicInvalid.headers().location).toBe("/demos")

  const duplicate = await request.get(
    "/demos?difficulty=beginner&difficulty=advanced",
    { maxRedirects: 0 },
  )
  expect(duplicate.status()).toBe(307)
  expect(duplicate.headers().location).toBe("/demos?difficulty=beginner")
})

test("SEO 只公开公共路由，账号路由 noindex", async ({ page, request }) => {
  await page.goto("/demos")
  const canonical = page.locator('link[rel="canonical"]')
  await expect(canonical).toHaveCount(1)
  await expect(canonical).toHaveAttribute("href", new URL("/demos", siteUrl).toString())

  await page.goto("/demos/roomgpt")
  await expect(page).toHaveTitle(/RoomGPT/u)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /RoomGPT 把房间照片/u,
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    new URL("/demos/roomgpt", siteUrl).toString(),
  )
  await expectNoSeriousAccessibilityIssues(page)

  const draftResponse = await page.goto("/demos/colorsnap")
  expect(draftResponse?.status()).toBe(200)
  await expect(page.getByRole("heading", { level: 1, name: "ColorSnap" })).toBeVisible()
  await expect(page.getByText(/当前不含 AI、后端/u)).toBeVisible()
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/u)
  await expect(page.locator('script[src*="/_vercel/insights/script.js"]')).toHaveCount(0)

  await page.goto("/login")
  const accountRobots = page.locator('meta[name="robots"]')
  await expect(accountRobots).toHaveCount(1)
  await expect(accountRobots).toHaveAttribute("content", /noindex/u)
  await expect(page.locator('script[src*="/_vercel/insights/script.js"]')).toHaveCount(0)
  await expectNoSeriousAccessibilityIssues(page)

  const robotsResponse = await request.get("/robots.txt")
  expect(robotsResponse.ok()).toBe(true)
  expect(robotsResponse.headers()["content-type"]).toContain("text/plain")
  const robots = await robotsResponse.text()
  expect(robots).toContain("User-Agent: *")
  for (const path of ["/", "/demos", "/privacy"]) {
    expect(robots).toContain(`Allow: ${path}`)
  }
  for (const path of [
    "/account/",
    "/auth/",
    "/blueprints",
    "/checkout/",
    "/favorites",
    "/login",
    "/register",
  ]) {
    expect(robots).toContain(`Disallow: ${path}`)
  }
  expect(robots).toContain(`Sitemap: ${new URL("/sitemap.xml", siteUrl).toString()}`)

  const sitemapResponse = await request.get("/sitemap.xml")
  expect(sitemapResponse.ok()).toBe(true)
  expect(sitemapResponse.headers()["content-type"]).toContain("xml")
  const sitemap = await sitemapResponse.text()
  for (const path of ["/", "/demos", "/privacy"]) {
    expect(sitemap).toContain(`<loc>${new URL(path, siteUrl).toString()}</loc>`)
  }
  for (const slug of launchSlugs) {
    expect(sitemap).toContain(
      `<loc>${new URL(`/demos/${slug}`, siteUrl).toString()}</loc>`,
    )
  }
  expect(sitemap).not.toContain("/demos/colorsnap")
  for (const path of [
    "/account/library",
    "/auth/check-email",
    "/blueprints",
    "/checkout/colorsnap-blueprint",
    "/favorites",
    "/login",
    "/register",
  ]) {
    expect(sitemap).not.toContain(`<loc>${new URL(path, siteUrl).toString()}</loc>`)
  }
})

test("核心页面三档宽度无溢出，移动筛选与减少动态效果可用", async ({ page, request }) => {
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of [
      "/",
      "/demos",
      "/demos/colorsnap",
      "/demos/roomgpt",
      "/blueprints",
      "/blueprints/colorsnap-blueprint",
      "/checkout/colorsnap-blueprint",
      "/login",
    ]) {
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, `${path} 在 ${width}px 出现横向溢出`).toBeLessThanOrEqual(0)
    }
  }

  await page.setViewportSize({ width: 360, height: 800 })
  await assertLocalAuthServices(request)
  const email = `vault-mobile-${randomUUID()}@example.test`
  const password = "Vault-mobile-password-2026!"

  await page.goto("/register?returnTo=%2Fdemos")
  await page.getByLabel("邮箱").fill(email)
  await page.locator("#register-password").fill(password)
  await page.locator("#register-password-confirmation").fill(password)
  await page.getByRole("button", { name: "创建账号" }).click()
  await expect(page).toHaveURL(/\/auth\/check-email/u)

  let confirmationUrl = ""
  await expect
    .poll(
      async () => {
        confirmationUrl = (await findConfirmationUrl(request, email)) ?? ""
        return confirmationUrl
      },
      { intervals: [250, 500, 1_000], timeout: 30_000 },
    )
    .not.toBe("")

  await page.goto(confirmationUrl)
  await expect(page).toHaveURL(new URL("/demos", siteUrl).toString())
  await page.keyboard.press("Tab")
  await expect(page.locator(":focus")).toHaveAttribute("href", "#main-content")

  const filterTrigger = page.getByRole("button", { name: /搜索与筛选/u })
  await filterTrigger.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("dialog", { name: "搜索与筛选" })).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(filterTrigger).toBeFocused()

  await page.keyboard.press("Enter")
  const filterDialog = page.getByRole("dialog", { name: "搜索与筛选" })
  await filterDialog.locator("#mobile-filter-q").fill("AnythingLLM")
  await filterDialog.locator("#mobile-filter-category").selectOption("knowledge-base")
  await filterDialog.locator("#mobile-filter-tool").selectOption("docker")
  await filterDialog.locator("#mobile-filter-difficulty").selectOption("advanced")
  await filterDialog.locator("#mobile-filter-region").selectOption("international")
  await filterDialog.getByRole("button", { name: "应用筛选" }).click()
  await expect(filterDialog).not.toBeVisible()
  await expect(page).toHaveURL(
    new URL(
      "/demos?q=AnythingLLM&category=knowledge-base&tool=docker&difficulty=advanced&region=international",
      siteUrl,
    ).toString(),
  )
  expect(await readCatalogTotal(page)).toBe(1)

  const anythingLlmCard = page.locator(".catalog-results article.demo-card").filter({
    has: page.getByRole("link", { exact: true, name: "AnythingLLM" }),
  })
  await expect(anythingLlmCard).toHaveCount(1)
  await anythingLlmCard.getByRole("button", { name: "收藏《AnythingLLM》" }).click()
  await expect(
    anythingLlmCard.getByRole("button", { name: "取消收藏《AnythingLLM》" }),
  ).toBeVisible()
  await page.reload()
  await expect(
    anythingLlmCard.getByRole("button", { name: "取消收藏《AnythingLLM》" }),
  ).toBeVisible()
  await anythingLlmCard.getByRole("button", { name: "取消收藏《AnythingLLM》" }).click()
  await expect(
    anythingLlmCard.getByRole("button", { name: "收藏《AnythingLLM》" }),
  ).toBeVisible()

  const navigationTrigger = page.getByRole("button", { name: "打开导航" })
  await navigationTrigger.click()
  const navigationDialog = page.getByRole("dialog", { name: "导航" })
  await navigationDialog.getByRole("link", { name: "免费 Demo" }).click()
  await expect(navigationDialog).not.toBeVisible()
  await expect(navigationTrigger).toBeFocused()

  await page.goto("/login")
  await page.keyboard.press("Tab")
  const skipLink = page.getByRole("link", { name: "跳到主要内容" })
  await expect(skipLink).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator("#main-content")).toBeFocused()

  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/demos")
  const reducedMotion = await page.evaluate(() => {
    const button = document.querySelector<HTMLElement>(".button")
    if (!button) throw new Error("页面缺少可验证的按钮")
    const buttonStyle = getComputedStyle(button)
    return {
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      transitionDuration: Number.parseFloat(buttonStyle.transitionDuration),
    }
  })
  expect(reducedMotion.scrollBehavior).toBe("auto")
  expect(reducedMotion.transitionDuration).toBeLessThanOrEqual(0.00001)
})

test("大 GIF 在真实详情页只在用户请求后播放", async ({ page }) => {
  await page.goto("/demos/anythingllm")
  const media = page.getByRole("img", { name: /AnythingLLM 官方 release 演示/u })
  await expect(media).toHaveAttribute("src", /anythingllm-preview\.png/u)
  await expect(page.getByRole("button", { name: "播放动态演示" })).toBeVisible()
})

test("危险登录回跳不会进入隐藏表单", async ({ page }) => {
  await page.goto("/login?returnTo=https%3A%2F%2Fevil.example%2Fsteal")
  await expect(page.locator('input[name="returnTo"]')).toHaveValue("/")
})
