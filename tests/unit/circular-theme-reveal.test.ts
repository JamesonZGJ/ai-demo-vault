import { describe, expect, it } from "vitest";

import {
  getCircularRevealKeyframes,
  getRevealRadius,
} from "../../packages/circular-theme-reveal/src/CircularThemeReveal";

describe("圆形主题切换", () => {
  it("从中心点计算到最远角的半径", () => {
    expect(getRevealRadius({ x: 250, y: 150 }, 500, 300)).toBeCloseTo(
      Math.hypot(250, 150),
    );
  });

  it("从左上角计算到右下角的半径", () => {
    expect(getRevealRadius({ x: 0, y: 0 }, 500, 300)).toBeCloseTo(
      Math.hypot(500, 300),
    );
  });

  it("生成从零到完整半径的圆形关键帧", () => {
    expect(getCircularRevealKeyframes({ x: 20.4, y: 30.6 }, 99.2)).toEqual([
      { clipPath: "circle(0px at 20px 31px)" },
      { clipPath: "circle(100px at 20px 31px)" },
    ]);
  });
});
