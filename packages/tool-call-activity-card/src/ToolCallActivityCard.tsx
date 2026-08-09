"use client";

export type ToolCallStatus = "preparing" | "running" | "succeeded" | "failed";

export type ToolCallStatusMeta = {
  label: string;
  tone: "neutral" | "active" | "success" | "danger";
};

export type ToolCallActivity = {
  durationMs?: number;
  error?: string;
  id: string;
  inputSummary?: string;
  name: string;
  outputSummary?: string;
  purpose: string;
  status: ToolCallStatus;
};

export type ToolCallActivityCardProps = {
  call: ToolCallActivity;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onRetry?: () => void;
};

export function getToolCallStatusMeta(status: ToolCallStatus): ToolCallStatusMeta {
  const meta: Record<ToolCallStatus, ToolCallStatusMeta> = {
    failed: { label: "执行失败", tone: "danger" },
    preparing: { label: "正在准备", tone: "neutral" },
    running: { label: "执行中", tone: "active" },
    succeeded: { label: "执行完成", tone: "success" },
  };
  return meta[status];
}

export function ToolCallActivityCard({
  call,
  expanded = false,
  onExpandedChange,
  onRetry,
}: ToolCallActivityCardProps) {
  const meta = getToolCallStatusMeta(call.status);
  return (
    <article className="tool-call-block" data-tone={meta.tone}>
      <header>
        <div><span>工具调用</span><strong>{call.name}</strong></div>
        <span>{meta.label}</span>
      </header>
      <p>{call.purpose}</p>
      {call.status === "running" ? <progress aria-label="工具执行进度" max={100} value={62} /> : null}
      <button
        aria-expanded={expanded}
        onClick={() => onExpandedChange?.(!expanded)}
        type="button"
      >
        {expanded ? "收起细节" : "查看细节"}
      </button>
      {expanded ? (
        <dl>
          <div><dt>输入</dt><dd>{call.inputSummary ?? "无额外输入"}</dd></div>
          <div><dt>结果</dt><dd>{call.error ?? call.outputSummary ?? "等待结果"}</dd></div>
          {call.durationMs ? <div><dt>耗时</dt><dd>{call.durationMs} ms</dd></div> : null}
        </dl>
      ) : null}
      {call.status === "failed" ? <button onClick={onRetry} type="button">重新执行</button> : null}
    </article>
  );
}
