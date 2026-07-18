import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DemoCard } from "@/components/demo/demo-card";
import { requirePrimaryProductPreviews } from "@/lib/demos/search";
import type { DemoCardData } from "@/lib/demos/types";

const previewRow = {
  alt_text: "RoomGPT 真实产品界面",
  authorization_status: "approved",
  captions_path: null,
  demo_id: "demo-roomgpt",
  id: "preview-roomgpt",
  media_type: "image",
  role: "product_preview",
  static_poster_path: null,
  storage_path: "/media/previews/roomgpt-preview.png",
  text_summary: null,
};

function demoWithProductPreview(
  productPreview: DemoCardData["productPreview"],
): DemoCardData {
  return {
    caseKind: "product",
    category: { name: "AI 装修设计", slug: "interior-design" },
    commercialPotential: { score: 4 },
    difficulty: "intermediate",
    favoriteCount: 0,
    id: previewRow.demo_id,
    maturity: "production_product",
    name: "RoomGPT",
    productPreview,
    publishedAt: "2026-07-16T12:00:00Z",
    publisherRegion: "international",
    slug: "roomgpt",
    sourcePlatform: "GitHub",
    summary: "真实案例摘要",
    tagline: "上传房间照片生成改造效果",
    tools: [],
  };
}

describe("公开卡片产品画面", () => {
  it("卡片渲染已批准的真实产品展示媒体", () => {
    const productPreview = requirePrimaryProductPreviews(
      [previewRow],
      [previewRow.demo_id],
    ).get(previewRow.demo_id)!;

    render(<DemoCard demo={demoWithProductPreview(productPreview)} />);

    expect(
      screen.getByRole("img", { name: previewRow.alt_text }).getAttribute("src"),
    ).toContain("roomgpt-preview.png");
  });

  it("GIF 播放控件不嵌套在案例跳转链接中", () => {
    const gifPreview = requirePrimaryProductPreviews(
      [
        {
          ...previewRow,
          media_type: "gif",
          static_poster_path: "/media/previews/roomgpt-poster.png",
          storage_path: "/media/previews/roomgpt-preview.gif",
        },
      ],
      [previewRow.demo_id],
    ).get(previewRow.demo_id)!;

    render(<DemoCard demo={demoWithProductPreview(gifPreview)} />);

    expect(screen.getByRole("button", { name: "播放动态演示" }).closest("a")).toBeNull();
  });

  it("任何公开案例缺少主产品展示媒体时明确失败", () => {
    expect(() =>
      requirePrimaryProductPreviews([previewRow], [previewRow.demo_id, "demo-missing"]),
    ).toThrow("公开卡片缺少已批准主产品展示媒体：demo-missing");
  });

  it("不接受未批准媒体作为卡片回退", () => {
    expect(() =>
      requirePrimaryProductPreviews(
        [{ ...previewRow, authorization_status: "pending" }],
        [previewRow.demo_id],
      ),
    ).toThrow("公开卡片产品展示媒体数据无效");
  });
});
