export interface ExtractedColor {
  hex: string;
  rgb: { b: number; g: number; r: number };
  sampleCount: number;
}

export interface ColorExtractionOptions {
  alphaThreshold?: number;
}

function toHex(value: number) {
  return value.toString(16).padStart(2, "0");
}

export function extractAverageColor(
  imageData: ImageData,
  options: ColorExtractionOptions = {},
): ExtractedColor {
  const alphaThreshold = Math.max(0, Math.min(255, options.alphaThreshold ?? 24));
  let red = 0;
  let green = 0;
  let blue = 0;
  let sampleCount = 0;

  for (let index = 0; index < imageData.data.length; index += 4) {
    const alpha = imageData.data[index + 3] ?? 0;
    if (alpha < alphaThreshold) continue;
    red += imageData.data[index] ?? 0;
    green += imageData.data[index + 1] ?? 0;
    blue += imageData.data[index + 2] ?? 0;
    sampleCount += 1;
  }

  if (sampleCount === 0) {
    return { hex: "#000000", rgb: { b: 0, g: 0, r: 0 }, sampleCount: 0 };
  }

  const rgb = {
    b: Math.round(blue / sampleCount),
    g: Math.round(green / sampleCount),
    r: Math.round(red / sampleCount),
  };
  return { hex: `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`, rgb, sampleCount };
}
