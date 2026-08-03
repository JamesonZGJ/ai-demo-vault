import { describe, expect, it } from "vitest";

import { getApprovalStateMeta } from "../../packages/ai-action-approval-card/src/AIActionApprovalCard";

describe("AI 操作授权确认卡", () => {
  it("为待确认状态提供明确行动提示", () => {
    expect(getApprovalStateMeta("pending")).toEqual({
      label: "等待你的确认",
      tone: "warning",
    });
  });

  it("拒绝以后明确说明操作没有执行", () => {
    expect(getApprovalStateMeta("rejected")).toEqual({
      label: "已拒绝，操作未执行",
      tone: "neutral",
    });
  });

  it("执行和完成状态不只依赖颜色", () => {
    expect(getApprovalStateMeta("executing").label).toBe("正在执行");
    expect(getApprovalStateMeta("complete").label).toBe("操作已完成");
  });
});
