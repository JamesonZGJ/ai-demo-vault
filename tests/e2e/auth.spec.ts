import { randomUUID } from "node:crypto"

import { expect, test, type Page } from "@playwright/test"

import {
  assertLocalAuthServices,
  findConfirmationUrl,
} from "./support/local-auth"

async function signInWithPassword(
  page: Page,
  email: string,
  password: string,
) {
  await page.goto("/login?returnTo=%2Ffavorites")
  await page.locator("#login-email").fill(email)
  await page.locator("#login-password").fill(password)
  await page.getByRole("button", { exact: true, name: "登录" }).click()
  await expect(page).toHaveURL(/\/favorites$/u)
}

async function signOut(page: Page) {
  const primaryNavigation = page.getByRole("navigation", {
    exact: true,
    name: "主导航",
  })
  const signOutButton = primaryNavigation.getByRole("button", {
    exact: true,
    name: "退出",
  })
  await expect(signOutButton).toHaveCount(1)
  await signOutButton.click()
  await expect.poll(() => new URL(page.url()).pathname).toBe("/")
}

test("无效凭据和不一致密码显示准确错误", async ({ page }) => {
  await page.goto("/login?returnTo=%2Ffavorites")
  await page.locator("#login-email").fill("missing-user@example.test")
  await page.locator("#login-password").fill("wrong-password")
  await page.getByRole("button", { exact: true, name: "登录" }).click()

  await expect(page).toHaveURL(/\/login\?error=invalid-credentials/u)
  await expect(page.locator("#login-error")).toHaveText("邮箱或密码不正确。")

  await page.goto("/register")
  await page.getByLabel("邮箱").fill("mismatch@example.test")
  await page.locator("#register-password").fill("first-password")
  await page.locator("#register-password-confirmation").fill("second-password")
  await page.getByRole("button", { name: "创建账号" }).click()
  await expect(page).toHaveURL(/\/register\?error=password-mismatch/u)
  await expect(page.locator("#register-error")).toHaveText("两次输入的密码不一致。")
})

test("确认前不能登录，确认后密码登录且收藏跨会话保留", async ({ page, request }) => {
  await assertLocalAuthServices(request)

  const email = `vault-e2e-${randomUUID()}@example.test`
  const password = "Vault-e2e-password-2026!"

  await page.goto("/register?returnTo=%2Ffavorites")
  await page.getByLabel("邮箱").fill(email)
  await page.locator("#register-password").fill(password)
  await page.locator("#register-password-confirmation").fill(password)
  await page.getByRole("button", { name: "创建账号" }).click()
  await expect(page).toHaveURL(/\/auth\/check-email/u)
  await expect(page.getByRole("heading", { level: 1, name: "请检查确认邮件" })).toBeVisible()
  await expect(page.getByText("v***@example.test", { exact: false })).toBeVisible()
  await expect(page.getByText(email, { exact: false })).toHaveCount(0)

  await page.goto("/login?returnTo=%2Ffavorites")
  await page.locator("#login-email").fill(email)
  await page.locator("#login-password").fill(password)
  await page.getByRole("button", { exact: true, name: "登录" }).click()
  await expect(page).toHaveURL(
    /\/login\?error=invalid-credentials&returnTo=%2Ffavorites$/u,
  )
  await expect(page.locator("#login-error")).toHaveText("邮箱或密码不正确。")

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
  await expect(page).toHaveURL(/\/favorites$/u)
  await expect(page.getByRole("heading", { level: 1, name: "准备复刻的案例" })).toBeVisible()
  const authenticatedOrigin = new URL(page.url()).origin

  await signOut(page)
  await signInWithPassword(page, email, password)

  await page.goto(new URL("/demos/anythingllm", authenticatedOrigin).toString())
  const primaryActions = page.locator('section[aria-label="案例操作"]')
  await primaryActions.getByRole("button", { name: "收藏《AnythingLLM》" }).click()
  await expect(primaryActions.getByRole("button", { name: "取消收藏《AnythingLLM》" })).toBeVisible()

  await page.reload()
  await expect(primaryActions.getByRole("button", { name: "取消收藏《AnythingLLM》" })).toBeVisible()

  await page.goto(new URL("/demos?sort=most-favorited", authenticatedOrigin).toString())
  await expect(
    page.locator(".catalog-results article.demo-card").first().getByRole("link", {
      exact: true,
      name: "AnythingLLM",
    }),
  ).toBeVisible()

  await page.goto(new URL("/favorites", authenticatedOrigin).toString())
  await expect(page.getByRole("link", { exact: true, name: "AnythingLLM" })).toBeVisible()

  await signOut(page)

  await page.goto(new URL("/favorites", authenticatedOrigin).toString())
  await expect
    .poll(() => {
      const currentUrl = new URL(page.url())
      return [currentUrl.pathname, currentUrl.searchParams.get("returnTo")]
    })
    .toEqual(["/login", "/favorites"])

  await signInWithPassword(page, email, password)
  await expect(page.getByRole("link", { exact: true, name: "AnythingLLM" })).toBeVisible()
  await page.getByRole("button", { name: "取消收藏《AnythingLLM》" }).click()
  await expect(page.getByRole("heading", { level: 2, name: "还没有收藏" })).toBeVisible()
})

test("ColorSnap 模拟购买只创建本人的持久资料访问权", async ({ page, request }) => {
  await assertLocalAuthServices(request)
  const email = `blueprint-e2e-${randomUUID()}@example.test`
  const password = "Blueprint-e2e-password-2026!"
  const checkoutPath = "/checkout/colorsnap-blueprint"
  const libraryPath = "/account/library/colorsnap-blueprint"

  await page.goto(`/register?${new URLSearchParams({ returnTo: checkoutPath })}`)
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
  await expect(page).toHaveURL(new RegExp(`${checkoutPath}$`, "u"))
  await page.getByLabel(/我确认：本次操作不会扣款/u).check()
  await page.getByRole("button", { name: "确认模拟购买并获取资料" }).click()
  await expect(page).toHaveURL(new RegExp(`${libraryPath}\\?acquired=1$`, "u"))
  await expect(page.getByText("Preview access activated", { exact: true })).toBeVisible()
  await expect(page.getByText(/这不是支付成功，也没有创建订单/u)).toBeVisible()
  await expect(page.locator(".library-resource-list > section")).toHaveCount(7)
  for (const heading of [
    "产品拆解：从目标色到收藏卡",
    "商业模式：先验证付费对象",
    "UI 资源：页面与组件清单",
    "PRD v0.1：本地颜色收藏原型",
    "Prompt：AI 升级候选",
    "技术方案：从单页原型到可验证产品",
    "营销方案：卖故事前先验证行为",
  ]) {
    await expect(page.locator(".library-resource-list").getByText(heading, { exact: true })).toBeVisible()
  }

  const download = page.waitForEvent("download")
  await page.getByRole("link", { name: "Download sample pack" }).click()
  const downloadedFile = await download
  expect(downloadedFile.suggestedFilename()).toBe("colorsnap-blueprint-blueprint-sample.md")
  expect(await downloadedFile.createReadStream()).not.toBeNull()

  await page.goto("/account/library")
  await expect(page.getByRole("heading", { level: 3, name: "ColorSnap Blueprint" })).toBeVisible()
  await signOut(page)

  await page.goto(libraryPath)
  await expect
    .poll(() => {
      const currentUrl = new URL(page.url())
      return [currentUrl.pathname, currentUrl.searchParams.get("returnTo")]
    })
    .toEqual(["/login", libraryPath])

  await page.locator("#login-email").fill(email)
  await page.locator("#login-password").fill(password)
  await page.getByRole("button", { exact: true, name: "登录" }).click()
  await expect(page).toHaveURL(new RegExp(`${libraryPath}$`, "u"))
  await expect(page.locator(".library-resource-list > section")).toHaveCount(7)
})
