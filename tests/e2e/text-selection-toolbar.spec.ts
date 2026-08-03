import { expect, test } from "@playwright/test";

test("文本选区工具栏会出现、执行操作并适配移动端", async ({ page }) => {
  await page.goto("/explore/text-selection-toolbar");

  await expect(
    page.getByRole("heading", { level: 1, name: /文本选区工具栏/u }),
  ).toBeVisible();

  const editor = page.getByRole("textbox", { name: "可编辑示例文稿" });
  await expect(editor).toBeVisible();
  await editor.evaluate((element) => {
    const textNode = element.querySelector("p")?.firstChild;
    if (!textNode) throw new Error("缺少可选择文本");
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, Math.min(10, textNode.textContent?.length ?? 0));
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    document.dispatchEvent(new Event("selectionchange"));
  });

  const toolbar = page.getByRole("toolbar", { name: "文本操作" });
  await expect(toolbar).toBeVisible();
  await page.getByRole("button", { name: "精简" }).click();
  await expect(page.getByText(/已模拟“精简”/u)).toBeVisible();

  await page.evaluate(() => {
    window.getSelection()?.removeAllRanges();
    document.dispatchEvent(new Event("selectionchange"));
  });
  await expect(toolbar).toBeHidden();

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
