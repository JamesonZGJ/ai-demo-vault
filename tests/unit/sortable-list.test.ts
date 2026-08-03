import { describe, expect, it } from "vitest";

import {
  moveSortableIndex,
  moveSortableItem,
} from "../../packages/sortable-list/src/SortableList";

const items = [
  { id: "a", title: "A" },
  { id: "b", title: "B" },
  { id: "c", title: "C" },
];

describe("拖拽排序列表", () => {
  it("可以把第一项移动到最后", () => {
    expect(moveSortableIndex(items, 0, 2).map(({ id }) => id)).toEqual([
      "b",
      "c",
      "a",
    ]);
  });

  it("可以根据项目 id 调整顺序", () => {
    expect(moveSortableItem(items, "c", "a").map(({ id }) => id)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("无效位置或相同位置保持原引用", () => {
    expect(moveSortableIndex(items, -1, 1)).toBe(items);
    expect(moveSortableIndex(items, 1, 1)).toBe(items);
    expect(moveSortableItem(items, "missing", "a")).toBe(items);
  });

  it("不会修改输入数组", () => {
    const original = [...items];
    moveSortableIndex(items, 0, 2);
    expect(items).toEqual(original);
  });
});
