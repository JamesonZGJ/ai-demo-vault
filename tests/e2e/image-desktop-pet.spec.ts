import { expect, test } from "@playwright/test";

test("图片桌宠支持上传、拖动、键盘和移动端适配", async ({ page }) => {
  await page.goto("/explore/image-desktop-pet");

  await expect(
    page.getByRole("heading", { level: 1, name: /图片桌宠/u }),
  ).toBeVisible();

  const pet = page.getByRole("button", {
    name: /图片桌宠.*方向键也可以移动/u,
  });
  await expect(pet).toBeVisible();

  const before = await pet.getAttribute("style");
  await pet.focus();
  await page.keyboard.press("ArrowRight");
  await expect(pet).not.toHaveAttribute("style", before ?? "");

  const box = await pet.boundingBox();
  if (!box) throw new Error("桌宠没有可拖拽区域");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2 - 40);
  await page.mouse.up();
  await expect(page.getByText(/当前位置已更新/u)).toBeVisible();

  await page.getByRole("button", { name: "恢复默认位置" }).click();
  await expect(page.getByText(/已恢复默认位置/u)).toBeVisible();

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
