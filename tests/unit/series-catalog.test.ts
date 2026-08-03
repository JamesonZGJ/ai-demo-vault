import { describe, expect, it } from "vitest";

import { capabilities } from "../../lib/capabilities/catalog";

describe("每天拆一个 AI 产品内容目录", () => {
  it("第001至017期都已经同步为网站 Build Block", () => {
    const episodes = capabilities
      .flatMap((capability) => capability.series?.episode ?? [])
      .sort((a, b) => a - b);

    expect(episodes).toEqual(Array.from({ length: 17 }, (_, index) => index + 1));
  });
});
