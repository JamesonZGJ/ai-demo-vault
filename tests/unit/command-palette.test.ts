import { describe, expect, it } from "vitest";

import {
  filterCommandItems,
  moveCommandIndex,
  type CommandPaletteItem,
} from "../../packages/command-palette/src/CommandPalette";

const commands: CommandPaletteItem[] = [
  {
    group: "项目",
    id: "new-project",
    keywords: ["create", "workspace"],
    label: "新建项目",
  },
  {
    group: "界面",
    id: "dark-theme",
    keywords: ["theme", "外观"],
    label: "切换深色主题",
  },
  {
    description: "进入偏好设置",
    group: "系统",
    id: "settings",
    keywords: ["settings"],
    label: "打开设置",
  },
];

describe("命令面板过滤", () => {
  it("空查询保留原始顺序", () => {
    expect(filterCommandItems(commands, "")).toEqual(commands);
  });

  it("支持中文名称和英文别名", () => {
    expect(filterCommandItems(commands, "主题").map(({ id }) => id)).toEqual([
      "dark-theme",
    ]);
    expect(filterCommandItems(commands, "settings").map(({ id }) => id)).toEqual([
      "settings",
    ]);
  });

  it("名称前缀优先于描述匹配", () => {
    expect(filterCommandItems(commands, "打开").map(({ id }) => id)).toEqual([
      "settings",
    ]);
  });

  it("无匹配时返回空列表", () => {
    expect(filterCommandItems(commands, "不存在")).toEqual([]);
  });
});

describe("命令面板键盘选择", () => {
  it("向下和向上都可以循环", () => {
    expect(moveCommandIndex(2, 3, 1)).toBe(0);
    expect(moveCommandIndex(0, 3, -1)).toBe(2);
  });

  it("空列表不生成选中项", () => {
    expect(moveCommandIndex(0, 0, 1)).toBe(-1);
  });
});
