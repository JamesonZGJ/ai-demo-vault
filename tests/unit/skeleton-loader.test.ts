import { describe, expect, it } from "vitest";

import { buildSkeletonWidths } from "../../packages/skeleton-loader/src/SkeletonLoader";

describe("骨架屏行宽", () => {
  it("生成稳定且有变化的宽度", () => {
    expect(buildSkeletonWidths(4)).toEqual([92, 76, 84, 58]);
  });

  it("把行数限制在 1 到 8 之间", () => {
    expect(buildSkeletonWidths(0)).toHaveLength(1);
    expect(buildSkeletonWidths(20)).toHaveLength(8);
  });
});
