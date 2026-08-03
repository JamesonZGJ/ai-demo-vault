import { describe, expect, it } from "vitest";

import { getSelectionToolbarPosition } from "../../packages/text-selection-toolbar/src/TextSelectionToolbar";

const container = {
  bottom: 500,
  height: 500,
  left: 100,
  right: 700,
  top: 0,
  width: 600,
};

describe("文本选区工具栏定位", () => {
  it("空间足够时放在选区上方", () => {
    expect(
      getSelectionToolbarPosition(
        { bottom: 240, height: 30, left: 260, right: 420, top: 210, width: 160 },
        container,
        { height: 48, width: 240 },
      ),
    ).toEqual({ left: 120, placement: "above", top: 150 });
  });

  it("顶部空间不足时放到选区下方", () => {
    expect(
      getSelectionToolbarPosition(
        { bottom: 42, height: 22, left: 220, right: 340, top: 20, width: 120 },
        container,
        { height: 48, width: 240 },
      ),
    ).toEqual({ left: 60, placement: "below", top: 54 });
  });

  it("靠近右侧时把工具栏限制在容器内", () => {
    expect(
      getSelectionToolbarPosition(
        { bottom: 240, height: 30, left: 650, right: 690, top: 210, width: 40 },
        container,
        { height: 48, width: 240 },
      ).left,
    ).toBe(350);
  });
});
