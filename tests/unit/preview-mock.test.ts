import { describe, expect, it } from "vitest";

import {
  getMockCatalogFilterOptions,
  getMockDemoBySlug,
  getMockPublishedSlugs,
  searchMockCatalog,
} from "@/lib/demos/mock";

describe("Preview Mock Mode 本地目录", () => {
  it("为 Demo 详情提供完整静态数据", () => {
    const slugs = getMockPublishedSlugs();
    const detail = getMockDemoBySlug(slugs[0]?.slug ?? "");

    expect(slugs.length).toBeGreaterThan(0);
    expect(detail).not.toBeNull();
    expect(detail?.claims).toHaveLength(11);
    expect(detail?.media[0]?.url).toBe("/og-image.svg");
  });

  it("可以在没有数据库时完成搜索和筛选", () => {
    const options = getMockCatalogFilterOptions();
    const category = options.categories[0]?.value;
    const result = searchMockCatalog({
      ...(category ? { category } : {}),
      page: 1,
      sort: "newest",
    });

    expect(options.categories.length).toBeGreaterThan(0);
    expect(options.tools.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
    expect(result.items[0]?.productPreview.url).toBe("/og-image.svg");
  });
});
