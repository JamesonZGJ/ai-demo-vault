import { expect, test } from "@playwright/test";

test("流式聊天回复完成本地生成并在移动端保持可用", async ({ page }) => {
  await page.goto("/explore/streaming-chat");

  await expect(
    page.getByRole("heading", { level: 1, name: /流式聊天回复/u }),
  ).toBeVisible();
  await expect(page.getByText("免费开放", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: "开始演示" }).click();
  await expect(page.getByText("等待回复", { exact: true })).toBeVisible();
  await expect(page.getByText("正在生成", { exact: true })).toBeVisible();
  await expect(page.getByText("生成完成", { exact: true })).toBeVisible({
    timeout: 6_000,
  });
  await expect(page.getByText(/用户不用等完整结果/u)).toBeVisible();

  await page.setViewportSize({ width: 360, height: 800 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
