import { describe, expect, it } from "vitest";

import { calculateReviewProgress } from "../../packages/ai-diff-review/src/AIDiffReview";
import { getCurrentTimelineStep } from "../../packages/agent-execution-timeline/src/AgentExecutionTimeline";
import { selectArtifactVersion } from "../../packages/artifact-split-preview/src/ArtifactSplitPreview";
import { removeMemoryItem } from "../../packages/memory-update-control/src/MemoryUpdateControl";
import { reorderAttachments } from "../../packages/multimodal-attachment-queue/src/MultimodalAttachmentQueue";
import { findCitationSource } from "../../packages/source-citation-preview/src/SourceCitationPreview";
import { getToolCallStatusMeta } from "../../packages/tool-call-activity-card/src/ToolCallActivityCard";

describe("第019至025期 AI 原生交互状态", () => {
  it("按引用标识找到对应来源", () => {
    const sources = [
      { domain: "example.com", excerpt: "第一段", id: "s1", title: "产品公告" },
      { domain: "research.example", excerpt: "第二段", id: "s2", title: "研究报告" },
    ];

    expect(findCitationSource("s2", sources)?.title).toBe("研究报告");
    expect(findCitationSource("missing", sources)).toBeUndefined();
  });

  it("选择成果版本时保留原数组", () => {
    const versions = [
      { content: "初稿", id: "v1", label: "版本 1" },
      { content: "修改稿", id: "v2", label: "版本 2" },
    ];
    const snapshot = structuredClone(versions);

    expect(selectArtifactVersion("v1", versions)?.id).toBe("v1");
    expect(versions).toEqual(snapshot);
  });

  it("工具失败状态提供明确中文与危险语气", () => {
    expect(getToolCallStatusMeta("failed")).toEqual({
      label: "执行失败",
      tone: "danger",
    });
    expect(getToolCallStatusMeta("running").tone).toBe("active");
  });

  it("代码审查进度按已处理文件计算", () => {
    expect(calculateReviewProgress([{ reviewed: true }, { reviewed: false }])).toBe(50);
    expect(calculateReviewProgress([])).toBe(0);
  });

  it("删除单条记忆时不修改原数组", () => {
    const memories = [
      { id: "m1", value: "使用中文回答" },
      { id: "m2", value: "偏好简洁摘要" },
    ];
    const result = removeMemoryItem(memories, "m1");

    expect(result).toEqual([{ id: "m2", value: "偏好简洁摘要" }]);
    expect(memories).toHaveLength(2);
  });

  it("附件拖动排序返回新数组并保持缺失标识符不变", () => {
    const attachments = [
      { id: "a1", name: "需求.pdf", status: "complete" as const },
      { id: "a2", name: "界面.png", status: "parsing" as const },
      { id: "a3", name: "数据.csv", status: "queued" as const },
    ];
    const result = reorderAttachments(attachments, "a3", "a1");

    expect(result.map(({ id }) => id)).toEqual(["a3", "a1", "a2"]);
    expect(result).not.toBe(attachments);
    expect(reorderAttachments(attachments, "missing", "a1")).toEqual(attachments);
  });

  it("执行时间线只返回当前步骤", () => {
    const steps = [
      { id: "plan", label: "制定计划", status: "completed" as const },
      { id: "run-search", label: "检索资料", status: "current" as const },
      { id: "report", label: "生成报告", status: "pending" as const },
    ];

    expect(getCurrentTimelineStep(steps)?.id).toBe("run-search");
    expect(getCurrentTimelineStep(steps.map((step) => ({ ...step, status: "completed" as const })))).toBeUndefined();
  });
});
