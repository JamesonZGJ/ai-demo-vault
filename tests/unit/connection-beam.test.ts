import { describe, expect, it } from "vitest";

import { createConnectionPath } from "../../packages/connection-beam/src/ConnectionBeam";

describe("连接光束路径", () => {
  it("横向节点使用横向控制点", () => {
    expect(createConnectionPath({ x: 10, y: 20 }, { x: 210, y: 80 }, 0.5)).toBe(
      "M 10 20 C 110 20, 110 80, 210 80",
    );
  });

  it("纵向节点使用纵向控制点", () => {
    expect(createConnectionPath({ x: 20, y: 10 }, { x: 70, y: 210 }, 0.25)).toBe(
      "M 20 10 C 20 60, 70 160, 70 210",
    );
  });
});
