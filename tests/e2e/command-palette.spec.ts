import { expect, test } from "@playwright/test";

test("命令面板详情页支持搜索、键盘执行与移动端浏览", async ({ page }) => {
  await page.goto("/explore/command-palette");

  await expect(
    page.getByRole("heading", { level: 1, name: /命令面板/u }),
  ).toBeVisible();
  const dialog = page.getByRole("dialog", { name: "命令面板" });
  await expect(dialog).toBeVisible();

  const search = dialog.getByRole("combobox");
  await search.fill("设置");
  await expect(
    dialog.getByRole("option", { name: /打开设置/u }),
  ).toBeVisible();
  await search.press("ArrowDown");
  await search.press("Enter");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator(".command-palette-status")).toContainText("刚刚执行：");

  await page.keyboard.press("Control+K");
  await expect(dialog).toBeVisible();
  await expect(search).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  await expect(page.getByRole("dialog", { name: "命令面板" })).toBeVisible();
});
