import { describe, expect, it } from "vitest";

import {
  getStreamingChatStateMeta,
  getVisibleStreamingText,
} from "../../packages/streaming-chat/src/StreamingChat";

describe("流式聊天回复", () => {
  it("为请求、生成和完成状态提供文字反馈", () => {
    expect(getStreamingChatStateMeta("waiting").label).toBe("等待回复");
    expect(getStreamingChatStateMeta("streaming").label).toBe("正在生成");
    expect(getStreamingChatStateMeta("complete").label).toBe("生成完成");
  });

  it("只返回已经到达的文本前缀", () => {
    expect(getVisibleStreamingText("流式回复", 0)).toBe("");
    expect(getVisibleStreamingText("流式回复", 2)).toBe("流式");
    expect(getVisibleStreamingText("流式回复", 99)).toBe("流式回复");
  });
});
