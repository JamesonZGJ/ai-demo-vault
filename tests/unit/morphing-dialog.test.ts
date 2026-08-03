import { describe, expect, it } from "vitest";

import { getCenteredDialogRect } from "../../packages/morphing-dialog/src/MorphingDialog";

describe("卡片变形弹窗", () => {
  it("在桌面视口中生成居中的目标矩形", () => {
    expect(getCenteredDialogRect(1440, 900)).toEqual({
      height: 620,
      left: 340,
      top: 140,
      width: 760,
    });
  });

  it("在小屏幕中保留安全边距", () => {
    expect(getCenteredDialogRect(360, 640)).toEqual({
      height: 600,
      left: 20,
      top: 20,
      width: 320,
    });
  });
});
