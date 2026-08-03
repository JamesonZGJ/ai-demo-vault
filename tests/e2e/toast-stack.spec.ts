import { expect, test } from "@playwright/test";

test("堆叠通知支持新增、展开、关闭和移动端适配", async ({ page }) => {
  await page.goto("/explore/toast-stack");

  await expect(
    page.getByRole("heading", { level: 1, name: /堆叠通知/u }),
  ).toBeVisible();

  const notifications = page.locator(".toast-stack-item");
  await expect(notifications).toHaveCount(3);

  await page.getByRole("button", { name: "添加通知" }).click();
  await expect(notifications).toHaveCount(4);
  await expect(page.getByText("任务 #4 已完成")).toBeVisible();

  await page.getByRole("button", { name: "展开通知" }).click();
  await expect(page.locator(".toast-stack-module")).toHaveClass(/is-expanded/u);

  await page
    .getByRole("button", { name: "关闭通知：任务 #4 已完成" })
    .click();
  await expect(notifications).toHaveCount(3);
  await expect(page.getByText(/后续项目自动补位/u)).toBeVisible();

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
