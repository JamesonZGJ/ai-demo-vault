import { describe, expect, it } from "vitest";

import {
  getCapabilities,
  getCapabilityAccessLabel,
  getCapabilityBySlug,
} from "../../lib/capabilities/catalog";

describe("免费内容库开放状态", () => {
  it("已有真实资料的模块显示免费开放", () => {
    const capability = getCapabilityBySlug("glass-surface");

    expect(capability).not.toBeNull();
    expect(getCapabilityAccessLabel(capability!)).toBe("免费开放");
  });

  it("尚未完成的模块继续显示准备中", () => {
    const capability = getCapabilityBySlug("flip-card");

    expect(capability).not.toBeNull();
    expect(getCapabilityAccessLabel(capability!)).toBe("准备中");
  });

  it("公开目录不再保留展示价格", () => {
    expect(getCapabilities().every((capability) => !("priceDisplay" in capability))).toBe(true);
  });
});
