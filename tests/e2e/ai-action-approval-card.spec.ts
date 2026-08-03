import { expect, test } from "@playwright/test";

test("AI 操作授权确认卡支持允许、拒绝和移动端", async ({ page }) => {
  await page.goto("/explore/ai-action-approval-card");

  await expect(
    page.getByRole("heading", { level: 1, name: /AI 操作授权确认卡/u }),
  ).toBeVisible();
  await expect(page.getByText("删除临时导出文件", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("等待你的确认", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "允许一次" }).click();
  await expect(page.getByText("已允许一次", { exact: true })).toBeVisible();
  await expect(page.getByText("正在执行", { exact: true })).toBeVisible({ timeout: 2_000 });
  await expect(page.getByText("操作已完成", { exact: true })).toBeVisible({ timeout: 3_000 });

  await page.getByRole("button", { name: "重新演示" }).click();
  await page.getByRole("button", { name: "拒绝" }).click();
  await expect(page.getByText("已拒绝，操作未执行", { exact: true })).toBeVisible();

  await page.setViewportSize({ width: 360, height: 800 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
