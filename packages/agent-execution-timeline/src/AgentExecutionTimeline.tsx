"use client";

export type TimelineStepStatus = "pending" | "current" | "waiting" | "completed" | "failed";

export type TimelineStep = {
  detail?: string;
  id: string;
  label: string;
  status: TimelineStepStatus;
};

export type AgentExecutionTimelineProps = {
  onContinue?: () => void;
  onStop?: () => void;
  steps: TimelineStep[];
};

export function getCurrentTimelineStep(steps: TimelineStep[]) {
  return steps.find(({ status }) => status === "current" || status === "waiting");
}

const timelineStatusLabels: Record<TimelineStepStatus, string> = {
  completed: "已完成",
  current: "执行中",
  failed: "执行失败",
  pending: "等待开始",
  waiting: "等待你的输入",
};

export function AgentExecutionTimeline({ onContinue, onStop, steps }: AgentExecutionTimelineProps) {
  const current = getCurrentTimelineStep(steps);
  return (
    <section aria-label="AI 执行时间线" className="execution-timeline-block">
      <header><div><span>长任务</span><strong>执行时间线</strong></div><span>{current ? timelineStatusLabels[current.status] : "任务完成"}</span></header>
      <ol>
        {steps.map((step) => (
          <li data-status={step.status} key={step.id}>
            <span aria-hidden="true" />
            <div><strong>{step.label}</strong><p>{step.detail}</p></div>
            <small>{timelineStatusLabels[step.status]}</small>
          </li>
        ))}
      </ol>
      {current?.status === "waiting" ? <button onClick={onContinue} type="button">继续执行</button> : null}
      {current?.status === "current" ? <button onClick={onStop} type="button">停止任务</button> : null}
    </section>
  );
}
