import { describe, expect, it } from "vitest";

import {
  clampPetPosition,
  getKeyboardPosition,
} from "../../packages/image-desktop-pet/src/ImageDesktopPet";

describe("图片桌宠位置", () => {
  it("把角色限制在父容器边界内", () => {
    expect(
      clampPetPosition(
        { x: 390, y: -20 },
        { height: 420, width: 500 },
        140,
      ),
    ).toEqual({ x: 360, y: 0 });
  });

  it("方向键按固定步长移动", () => {
    expect(
      getKeyboardPosition(
        { x: 24, y: 30 },
        "ArrowRight",
        { height: 400, width: 500 },
        150,
      ),
    ).toEqual({ x: 36, y: 30 });
  });

  it("未知按键不改变位置", () => {
    const current = { x: 24, y: 30 };
    expect(
      getKeyboardPosition(
        current,
        "Enter",
        { height: 400, width: 500 },
        150,
      ),
    ).toBe(current);
  });
});
