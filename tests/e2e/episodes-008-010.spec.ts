import { expect, test } from "@playwright/test";

test("骨架屏加载可以切换真实内容并适配移动端", async ({ page }) => {
  await page.goto("/explore/skeleton-loader");

  await expect(
    page.getByRole("heading", { level: 1, name: /骨架屏加载/u }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("项目摘要正在加载");

  await page.getByRole("button", { name: "显示真实内容" }).click();
  await expect(page.getByText("内容结构已经准备完成")).toBeVisible();
  await expect(page.locator('[aria-busy="false"]')).toBeVisible();

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("智能聊天输入框支持附件、换行、发送和停止状态", async ({ page }) => {
  await page.goto("/explore/prompt-composer");

  await expect(
    page.getByRole("heading", { level: 1, name: /智能聊天输入框/u }),
  ).toBeVisible();
  await expect(page.getByText("产品需求.pdf")).toBeVisible();

  const textarea = page.getByRole("textbox");
  await textarea.fill("生成三条发布文案");
  await textarea.press("Shift+Enter");
  await expect(page.getByText(/Enter 发送，Shift \+ Enter 换行/u)).toBeVisible();

  await textarea.press("Enter");
  await expect(page.getByText(/已进入生成中状态/u)).toBeVisible();
  await expect(page.getByRole("button", { name: "停止生成" })).toBeVisible();
  await page.getByRole("button", { name: "停止生成" }).click();
  await expect(page.getByText(/已在本地提交/u)).toBeVisible();

  await page.getByRole("button", { name: /移除附件/u }).click();
  await expect(page.getByText("产品需求.pdf")).toBeHidden();
});

test("可折叠侧边栏支持桌面收起、移动端抽屉和 Escape", async ({ page }) => {
  await page.goto("/explore/collapsible-sidebar");

  await expect(
    page.getByRole("heading", { level: 1, name: /可折叠侧边栏/u }),
  ).toBeVisible();
  const panel = page.locator("#collapsible-sidebar-panel");
  await page.getByRole("button", { name: "收起侧边栏" }).click();
  await expect(panel).toHaveClass(/is-collapsed/u);
  await expect(panel.locator(".sidebar-item-label").first()).toBeHidden();

  await page.getByRole("button", { name: "智能助手" }).click();
  await expect(page.locator(".sidebar-preview-main strong")).toHaveText("智能助手");

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  await page.locator(".sidebar-mobile-trigger").click();
  await expect(panel).toHaveClass(/is-mobile-open/u);
  await page.keyboard.press("Escape");
  await expect(panel).not.toHaveClass(/is-mobile-open/u);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
