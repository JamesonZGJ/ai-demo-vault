import { describe, expect, it } from "vitest";

import { getNextSidebarState } from "../../packages/collapsible-sidebar/src/CollapsibleSidebar";

describe("可折叠侧边栏状态", () => {
  it("在展开与收起之间切换", () => {
    expect(getNextSidebarState(false)).toBe(true);
    expect(getNextSidebarState(true)).toBe(false);
  });
});
