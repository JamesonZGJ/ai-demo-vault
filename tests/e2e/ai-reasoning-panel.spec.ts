import { expect, test } from "@playwright/test";

test("AI 思考过程面板支持自动展开、手动控制与移动端", async ({ page }) => {
  await page.goto("/explore/ai-reasoning-panel");

  await expect(
    page.getByRole("heading", { level: 1, name: /AI 思考过程面板/u }),
  ).toBeVisible();

  const disclosure = page.getByRole("button", { name: /处理过程摘要/u });
  await page.getByRole("button", { name: "开始演示" }).click();
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");

  await disclosure.click();
  await expect(disclosure).toHaveAttribute("aria-expanded", "false");
  await disclosure.click();
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");

  await page.setViewportSize({ width: 360, height: 800 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
