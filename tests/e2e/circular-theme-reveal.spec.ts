import { expect, test } from "@playwright/test";

test("圆形主题切换支持双向切换与移动端", async ({ page }) => {
  await page.goto("/explore/circular-theme-reveal");

  await expect(
    page.getByRole("heading", { level: 1, name: /圆形主题切换/u }),
  ).toBeVisible();

  const preview = page.locator(".circular-theme-reveal");
  const darkButton = page.getByRole("button", { name: "切换到深色主题" });
  await expect(darkButton).toBeVisible();
  await darkButton.click();
  await expect(preview).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "切换到浅色主题" }).click();
  await expect(preview).toHaveAttribute("data-theme", "light");

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
