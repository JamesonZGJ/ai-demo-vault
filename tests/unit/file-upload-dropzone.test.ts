import { describe, expect, it } from "vitest";

import {
  fileMatchesAccept,
  formatBytes,
  validateUploadFiles,
} from "../../packages/file-upload-dropzone/src/FileUploadDropzone";

const makeFile = (name: string, type: string, size: number) =>
  new File([new Uint8Array(size)], name, { type });

describe("文件上传格式匹配", () => {
  it("支持扩展名、精确 MIME 和 MIME 通配符", () => {
    expect(fileMatchesAccept(makeFile("cover.png", "image/png", 1), "image/*")).toBe(true);
    expect(fileMatchesAccept(makeFile("brief.PDF", "", 1), ".pdf")).toBe(true);
    expect(fileMatchesAccept(makeFile("data.json", "application/json", 1), "application/json")).toBe(true);
  });

  it("拒绝不支持的格式", () => {
    expect(fileMatchesAccept(makeFile("audio.mp3", "audio/mpeg", 1), "image/*,.pdf")).toBe(false);
  });
});

describe("文件上传校验", () => {
  it("保留通过格式和大小校验的文件", () => {
    const file = makeFile("cover.png", "image/png", 512);
    expect(
      validateUploadFiles([file], {
        accept: "image/*",
        maxFiles: 1,
        maxSizeBytes: 1024,
      }),
    ).toEqual({ acceptedFiles: [file], errors: [] });
  });

  it("分别报告格式、大小和数量错误", () => {
    const result = validateUploadFiles(
      [
        makeFile("audio.mp3", "audio/mpeg", 1),
        makeFile("large.png", "image/png", 2048),
        makeFile("extra.png", "image/png", 1),
      ],
      { accept: "image/*", maxFiles: 2, maxSizeBytes: 1024 },
    );

    expect(result.acceptedFiles).toEqual([]);
    expect(result.errors.map(({ code }) => code)).toEqual([
      "too_many_files",
      "invalid_type",
      "file_too_large",
    ]);
  });
});

describe("文件大小显示", () => {
  it("生成便于阅读的单位", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1.0 KB");
    expect(formatBytes(10 * 1024 * 1024)).toBe("10 MB");
  });
});
