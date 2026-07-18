import { describe, expect, it } from "vitest";

import { extractAverageColor } from "../../packages/color-extraction/src";

describe("Color Extraction Capability Package", () => {
  it("returns a deterministic average color and ignores transparent pixels", () => {
    const data = new Uint8ClampedArray([
      80, 111, 136, 255,
      255, 0, 0, 0,
      120, 120, 120, 255,
    ]);
    const result = extractAverageColor({ data, width: 3, height: 1 } as ImageData);

    expect(result).toEqual({
      hex: "#647480",
      rgb: { b: 128, g: 116, r: 100 },
      sampleCount: 2,
    });
  });
});
