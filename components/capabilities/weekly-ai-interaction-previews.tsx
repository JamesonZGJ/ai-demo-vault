"use client";

import { useState } from "react";
import { SourceCitationPreview } from "../../packages/source-citation-preview/src/SourceCitationPreview";
import { ArtifactSplitPreview } from "../../packages/artifact-split-preview/src/ArtifactSplitPreview";
import {
  ToolCallActivityCard,
  type ToolCallActivity,
} from "../../packages/tool-call-activity-card/src/ToolCallActivityCard";
import {
  AIDiffReview,
  type DiffReviewFile,
} from "../../packages/ai-diff-review/src/AIDiffReview";
import {
  MemoryUpdateControl,
  type MemoryItem,
} from "../../packages/memory-update-control/src/MemoryUpdateControl";
import {
  MultimodalAttachmentQueue,
  type AttachmentItem,
} from "../../packages/multimodal-attachment-queue/src/MultimodalAttachmentQueue";
import {
  AgentExecutionTimeline,
  type TimelineStep,
} from "../../packages/agent-execution-timeline/src/AgentExecutionTimeline";
import styles from "./weekly-ai-interaction-previews.module.css";

export const WEEKLY_AI_INTERACTION_SLUGS = new Set([
  "source-citation-preview",
  "artifact-split-preview",
  "tool-call-activity-card",
  "ai-diff-review",
  "memory-update-control",
  "multimodal-attachment-queue",
  "agent-execution-timeline",
]);

function SourceCitationPreviewDemo() {
  const [activeCitationId, setActiveCitationId] = useState<string>();
  return (
    <SourceCitationPreview
      {...(activeCitationId ? { activeCitationId } : {})}
      citations={[
        { id: "citation-1", label: "1", sourceId: "source-1" },
        { id: "citation-2", label: "2", sourceId: "source-2" },
      ]}
      onCitationChange={setActiveCitationId}
      sources={[
        { domain: "product.example", excerpt: "状态反馈越清楚，用户越容易判断是否需要介入。", id: "source-1", title: "长任务中的状态反馈" },
        { domain: "research.example", excerpt: "来源应与具体结论绑定，并允许用户随时核查。", id: "source-2", title: "引用信息的可核查性" },
      ]}
    />
  );
}

function ArtifactSplitPreviewDemo() {
  const [activeVersionId, setActiveVersionId] = useState("v2");
  return (
    <ArtifactSplitPreview
      activeVersionId={activeVersionId}
      messages={[
        { author: "user", id: "m1", text: "把发布计划整理成一页执行稿。" },
        { author: "assistant", id: "m2", text: "已生成右侧成果，可直接继续修改。" },
      ]}
      onVersionChange={setActiveVersionId}
      versions={[
        { content: "目标、步骤和验收标准已经整理完成。", id: "v1", label: "初稿" },
        { content: "今天完成封面、口播、成片检查与发布准备。", id: "v2", label: "精简版" },
      ]}
    />
  );
}

function ToolCallActivityCardDemo() {
  const [expanded, setExpanded] = useState(false);
  const [call, setCall] = useState<ToolCallActivity>({
    id: "search",
    inputSummary: "关键词：AI 产品交互",
    name: "搜索资料",
    purpose: "查找与当前结论直接相关的公开资料。",
    status: "running",
  });
  return (
    <ToolCallActivityCard
      call={call}
      expanded={expanded}
      onExpandedChange={setExpanded}
      onRetry={() => {
        const next = { ...call };
        delete next.error;
        setCall({ ...next, status: "running" });
      }}
    />
  );
}

const initialDiffFiles: DiffReviewFile[] = [
  { added: 3, id: "composer", lines: [{ content: "const status = 'ready';", type: "remove" }, { content: "const status = task.status;", type: "add" }, { content: "return renderStatus(status);", type: "context" }], name: "TaskComposer.tsx", removed: 1, reviewed: false },
  { added: 2, id: "types", lines: [{ content: "export type TaskStatus = 'ready' | 'running';", type: "add" }], name: "types.ts", removed: 0, reviewed: true },
];

function AIDiffReviewDemo() {
  const [activeFileId, setActiveFileId] = useState("composer");
  const [files, setFiles] = useState(initialDiffFiles);
  return (
    <AIDiffReview
      activeFileId={activeFileId}
      files={files}
      onActiveFileChange={setActiveFileId}
      onDecision={(fileId, decision) => setFiles((current) => current.map((file) => file.id === fileId ? { ...file, decision, reviewed: true } : file))}
    />
  );
}

function MemoryUpdateControlDemo() {
  const [memories, setMemories] = useState<MemoryItem[]>([
    { id: "m1", source: "来自当前对话", value: "视频保持 30～45 秒" },
    { id: "m2", source: "来自你的偏好", value: "标题和指引优先使用中文" },
  ]);
  return <MemoryUpdateControl memories={memories} onMemoriesChange={setMemories} />;
}

function MultimodalAttachmentQueueDemo() {
  const [items, setItems] = useState<AttachmentItem[]>([
    { id: "image", name: "界面截图.png", status: "complete", type: "图片" },
    { id: "audio", name: "口播草稿.wav", progress: 64, status: "uploading", type: "音频" },
    { id: "document", name: "产品说明.pdf", status: "parsing", type: "文档" },
  ]);
  return <MultimodalAttachmentQueue items={items} onItemsChange={setItems} onRetry={(id) => setItems((current) => current.map((item) => item.id === id ? { ...item, status: "queued" } : item))} />;
}

const initialTimelineSteps: TimelineStep[] = [
  { detail: "确认目标和输出格式", id: "plan", label: "理解任务", status: "completed" },
  { detail: "查找并整理相关资料", id: "research", label: "收集信息", status: "completed" },
  { detail: "正在生成可检查的初稿", id: "draft", label: "制作初稿", status: "current" },
  { detail: "等待前一步完成", id: "review", label: "检查结果", status: "pending" },
];

function AgentExecutionTimelineDemo() {
  const [steps, setSteps] = useState(initialTimelineSteps);
  return (
    <AgentExecutionTimeline
      onContinue={() => setSteps((current) => current.map((step) => step.status === "waiting" ? { ...step, status: "current" } : step))}
      onStop={() => setSteps((current) => current.map((step) => step.status === "current" ? { ...step, detail: "任务已由用户停止", status: "failed" } : step))}
      steps={steps}
    />
  );
}

export function WeeklyAIInteractionPreview({ slug }: { slug: string }) {
  const content = {
    "agent-execution-timeline": <AgentExecutionTimelineDemo />,
    "ai-diff-review": <AIDiffReviewDemo />,
    "artifact-split-preview": <ArtifactSplitPreviewDemo />,
    "memory-update-control": <MemoryUpdateControlDemo />,
    "multimodal-attachment-queue": <MultimodalAttachmentQueueDemo />,
    "source-citation-preview": <SourceCitationPreviewDemo />,
    "tool-call-activity-card": <ToolCallActivityCardDemo />,
  }[slug];

  return <div className={`capability-preview ${styles.preview}`}>{content}</div>;
}
