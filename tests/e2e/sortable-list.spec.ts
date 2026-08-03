import { expect, test } from "@playwright/test";

test("拖拽排序列表支持按钮、键盘和移动端浏览", async ({ page }) => {
  await page.goto("/explore/sortable-list");

  await expect(
    page.getByRole("heading", { level: 1, name: /拖拽排序列表/u }),
  ).toBeVisible();

  const list = page.getByRole("list", { name: "AI 工作流步骤" });
  const itemTitles = () => list.locator(".sortable-list-copy strong").allTextContents();

  await expect.poll(itemTitles).toEqual([
    "整理系统提示",
    "接入知识内容",
    "生成第一版结果",
    "校验最终结果",
  ]);

  const dragHandle = page.getByRole("button", {
    name: /拖动“生成第一版结果”/u,
  });
  const dragBox = await dragHandle.boundingBox();
  const targetBox = await list.getByRole("listitem").first().boundingBox();
  expect(dragBox).not.toBeNull();
  expect(targetBox).not.toBeNull();
  if (dragBox && targetBox) {
    await page.mouse.move(
      dragBox.x + dragBox.width / 2,
      dragBox.y + dragBox.height / 2,
    );
    await page.mouse.down();
    await expect(page.locator(".sortable-list-drag-overlay")).toBeVisible();
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 12 },
    );
    await page.mouse.up();
  }
  await expect.poll(itemTitles).toEqual([
    "生成第一版结果",
    "整理系统提示",
    "接入知识内容",
    "校验最终结果",
  ]);

  await page.reload();
  await page.getByRole("button", { name: "将“整理系统提示”下移" }).click();
  await expect.poll(itemTitles).toEqual([
    "接入知识内容",
    "整理系统提示",
    "生成第一版结果",
    "校验最终结果",
  ]);

  const handle = page.getByRole("button", {
    name: /拖动“整理系统提示”/u,
  });
  await handle.focus();
  await page.keyboard.press("ArrowDown");
  await expect.poll(itemTitles).toEqual([
    "接入知识内容",
    "生成第一版结果",
    "整理系统提示",
    "校验最终结果",
  ]);

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
