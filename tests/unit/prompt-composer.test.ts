import { describe, expect, it } from "vitest";

import { shouldSubmitPrompt } from "../../packages/prompt-composer/src/PromptComposer";

describe("智能聊天输入框提交规则", () => {
  it("只用 Enter 提交", () => {
    expect(
      shouldSubmitPrompt({
        isComposing: false,
        key: "Enter",
        shiftKey: false,
      }),
    ).toBe(true);
  });

  it("换行和输入法组合期间不提交", () => {
    expect(
      shouldSubmitPrompt({
        isComposing: false,
        key: "Enter",
        shiftKey: true,
      }),
    ).toBe(false);
    expect(
      shouldSubmitPrompt({
        isComposing: true,
        key: "Enter",
        shiftKey: false,
      }),
    ).toBe(false);
  });
});
