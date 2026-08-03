import { expect, test } from "@playwright/test";

test("卡片变形弹窗支持打开、关闭与移动端", async ({ page }) => {
  await page.goto("/explore/morphing-dialog");

  await expect(
    page.getByRole("heading", { level: 1, name: /卡片变形弹窗/u }),
  ).toBeVisible();

  const trigger = page.getByRole("button", { name: "打开“AI 回复结构”详情" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "AI 回复结构" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "AI 回复结构" })).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
