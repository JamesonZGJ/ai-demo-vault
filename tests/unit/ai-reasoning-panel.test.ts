import { describe, expect, it } from "vitest";

import { getReasoningStateMeta } from "../../packages/ai-reasoning-panel/src/AIReasoningPanel";

describe("AI 思考过程面板", () => {
  it("为生成状态提供可读文字", () => {
    expect(getReasoningStateMeta("streaming")).toEqual({
      label: "正在生成摘要",
      tone: "active",
    });
  });

  it("完成和错误状态不只依赖颜色", () => {
    expect(getReasoningStateMeta("complete").label).toBe("处理完成");
    expect(getReasoningStateMeta("error").label).toBe("处理失败");
  });
});
