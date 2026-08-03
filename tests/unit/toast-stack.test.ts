import { describe, expect, it } from "vitest";

import {
  clampToastProgress,
  getToastStackLayout,
} from "../../packages/toast-stack/src/ToastStack";

describe("堆叠通知布局", () => {
  it("折叠状态让后续通知逐层后退", () => {
    expect(getToastStackLayout(3, 4, false)).toEqual([
      { hidden: false, index: 0, offset: 0, scale: 1 },
      { hidden: false, index: 1, offset: 13, scale: 0.965 },
      { hidden: false, index: 2, offset: 26, scale: 0.93 },
    ]);
  });

  it("展开状态使用固定间距并限制可见数量", () => {
    expect(getToastStackLayout(4, 2, true)).toEqual([
      { hidden: false, index: 0, offset: 0, scale: 1 },
      { hidden: false, index: 1, offset: 112, scale: 1 },
      { hidden: true, index: 2, offset: 224, scale: 1 },
      { hidden: true, index: 3, offset: 336, scale: 1 },
    ]);
  });

  it("把进度限制在 0 到 1", () => {
    expect(clampToastProgress(-1)).toBe(0);
    expect(clampToastProgress(0.4)).toBe(0.4);
    expect(clampToastProgress(2)).toBe(1);
  });
});
