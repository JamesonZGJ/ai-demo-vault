import { describe, expect, it } from "vitest";

import {
  getAgentTaskStatusMeta,
  sortAgentTasks,
  type AgentTaskItem,
} from "../../packages/agent-task-inbox/src/AgentTaskInbox";

const tasks: AgentTaskItem[] = [
  {
    id: "complete",
    title: "整理发布说明",
    status: "completed",
    updatedAt: "2 分钟前",
    summary: "发布说明已经整理完成。",
  },
  {
    id: "running",
    title: "生成交互测试",
    status: "in_progress",
    updatedAt: "刚刚",
    summary: "正在执行组件测试。",
    progress: 64,
  },
  {
    attentionReason: "需要确认是否覆盖现有文件",
    id: "attention",
    title: "同步设计资源",
    status: "needs_attention",
    updatedAt: "1 分钟前",
    summary: "检测到同名资源。",
  },
  {
    id: "review",
    title: "检查界面改动",
    status: "in_review",
    updatedAt: "3 分钟前",
    summary: "改动已准备好，可以开始审查。",
  },
];

describe("AI Agent 任务收件箱", () => {
  it("用文字说明需要用户处理的状态", () => {
    expect(getAgentTaskStatusMeta("needs_attention")).toEqual({
      label: "需要你处理",
      tone: "warning",
    });
  });

  it("把需要处理和等待审查的任务排在运行中任务之前", () => {
    expect(sortAgentTasks(tasks).map(({ id }) => id)).toEqual([
      "attention",
      "review",
      "running",
      "complete",
    ]);
  });

  it("排序不会改动传入的任务数组", () => {
    sortAgentTasks(tasks);
    expect(tasks.map(({ id }) => id)).toEqual([
      "complete",
      "running",
      "attention",
      "review",
    ]);
  });
});
