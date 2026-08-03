import { expect, test } from "@playwright/test";

test("智能文件上传区支持选择、进度、完成和移动端浏览", async ({ page }) => {
  await page.goto("/explore/file-upload-dropzone");

  await expect(
    page.getByRole("heading", { level: 1, name: /智能文件上传区/u }),
  ).toBeVisible();
  await expect(page.getByText(/文件不会离开浏览器/u)).toBeVisible();

  await page.locator('.capability-preview-file-upload input[type="file"]').setInputFiles({
    buffer: Buffer.from("preview"),
    mimeType: "image/png",
    name: "preview.png",
  });

  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.getByText("文件已经准备好")).toBeVisible();
  await expect(page.getByText(/preview\.png/u)).toBeVisible();

  await page.getByRole("button", { name: "重新选择" }).click();
  await expect(page.getByRole("button", { name: "选择文件" })).toBeVisible();

  await page.setViewportSize({ width: 360, height: 800 });
  await page.reload();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
