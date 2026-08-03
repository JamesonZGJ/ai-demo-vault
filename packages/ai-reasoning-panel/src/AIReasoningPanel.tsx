"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type ReasoningStatus =
  | "idle"
  | "waiting"
  | "streaming"
  | "complete"
  | "error";

export type ReasoningStateMeta = {
  label: string;
  tone: "neutral" | "active" | "success" | "error";
};

export type AIReasoningPanelProps = {
  autoCloseDelay?: number;
  children: ReactNode;
  className?: string;
  durationLabel?: string;
  status: ReasoningStatus;
  summary: string;
  title?: string;
};

export function getReasoningStateMeta(
  status: ReasoningStatus,
): ReasoningStateMeta {
  const states: Record<ReasoningStatus, ReasoningStateMeta> = {
    complete: { label: "处理完成", tone: "success" },
    error: { label: "处理失败", tone: "error" },
    idle: { label: "等待开始", tone: "neutral" },
    streaming: { label: "正在生成摘要", tone: "active" },
    waiting: { label: "正在分析", tone: "active" },
  };
  return states[status];
}

export function AIReasoningPanel({
  autoCloseDelay = 1200,
  children,
  className = "",
  durationLabel,
  status,
  summary,
  title = "处理过程摘要",
}: AIReasoningPanelProps) {
  const contentId = useId();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expanded, setExpanded] = useState(
    status === "waiting" || status === "streaming",
  );
  const [manualOverride, setManualOverride] = useState(false);
  const [previousStatus, setPreviousStatus] = useState(status);
  const state = getReasoningStateMeta(status);

  if (previousStatus !== status) {
    setPreviousStatus(status);
    const startedNewRun =
      (status === "waiting" || status === "streaming") &&
      (previousStatus === "idle" ||
        previousStatus === "complete" ||
        previousStatus === "error");

    if (startedNewRun) {
      setManualOverride(false);
      setExpanded(true);
    } else if (status === "idle") {
      setManualOverride(false);
      setExpanded(false);
    }
  }

  useEffect(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

    if (
      (status === "complete" || status === "error") &&
      !manualOverride
    ) {
      closeTimerRef.current = setTimeout(
        () => setExpanded(false),
        autoCloseDelay,
      );
    }

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [autoCloseDelay, manualOverride, status]);

  function toggleExpanded() {
    setManualOverride(true);
    setExpanded((current) => !current);
  }

  return (
    <section
      className={`ai-reasoning-panel ${expanded ? "is-expanded" : ""} ${className}`.trim()}
      data-status={status}
    >
      <button
        aria-controls={contentId}
        aria-expanded={expanded}
        className="ai-reasoning-panel-trigger"
        onClick={toggleExpanded}
        type="button"
      >
        <span
          aria-hidden="true"
          className="ai-reasoning-panel-status-dot"
          data-tone={state.tone}
        />
        <span className="ai-reasoning-panel-heading">
          <strong>{title}</strong>
          <small aria-live="polite">{state.label}</small>
        </span>
        {durationLabel ? (
          <span className="ai-reasoning-panel-duration">{durationLabel}</span>
        ) : null}
        <span aria-hidden="true" className="ai-reasoning-panel-chevron">
          ↓
        </span>
      </button>

      <div
        aria-hidden={!expanded}
        className="ai-reasoning-panel-content"
        id={contentId}
        inert={!expanded}
      >
        <div className="ai-reasoning-panel-content-inner">
          <p>{summary}</p>
          <div className="ai-reasoning-panel-steps">{children}</div>
          <small className="ai-reasoning-panel-boundary">
            仅展示可公开的处理摘要，不展示模型私密思维链。
          </small>
        </div>
      </div>
    </section>
  );
}
