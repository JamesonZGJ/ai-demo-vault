"use client";

import { useMemo, useState } from "react";

export type AgentTaskStatus =
  | "needs_attention"
  | "in_review"
  | "in_progress"
  | "completed";

export type AgentTaskFilter = "all" | Exclude<AgentTaskStatus, "completed">;

export type AgentTaskItem = {
  actionLabel?: string;
  attentionReason?: string;
  context?: string;
  id: string;
  progress?: number;
  status: AgentTaskStatus;
  summary: string;
  title: string;
  updatedAt: string;
};

export type AgentTaskStatusMeta = {
  label: string;
  tone: "warning" | "review" | "active" | "success";
};

export type AgentTaskInboxProps = {
  className?: string;
  defaultFilter?: AgentTaskFilter;
  onSelectTask?: (task: AgentTaskItem) => void;
  selectedTaskId?: string;
  tasks: AgentTaskItem[];
  title?: string;
};

const statusOrder: Record<AgentTaskStatus, number> = {
  needs_attention: 0,
  in_review: 1,
  in_progress: 2,
  completed: 3,
};

export function getAgentTaskStatusMeta(
  status: AgentTaskStatus,
): AgentTaskStatusMeta {
  const states: Record<AgentTaskStatus, AgentTaskStatusMeta> = {
    completed: { label: "已完成", tone: "success" },
    in_progress: { label: "运行中", tone: "active" },
    in_review: { label: "等待审查", tone: "review" },
    needs_attention: { label: "需要你处理", tone: "warning" },
  };
  return states[status];
}

export function sortAgentTasks(tasks: AgentTaskItem[]) {
  return [...tasks].sort(
    (left, right) => statusOrder[left.status] - statusOrder[right.status],
  );
}

const filters: Array<{ id: AgentTaskFilter; label: string }> = [
  { id: "all", label: "全部" },
  { id: "needs_attention", label: "需要处理" },
  { id: "in_progress", label: "运行中" },
  { id: "in_review", label: "等待审查" },
];

export function AgentTaskInbox({
  className = "",
  defaultFilter = "all",
  onSelectTask,
  selectedTaskId,
  tasks,
  title = "任务收件箱",
}: AgentTaskInboxProps) {
  const [filter, setFilter] = useState<AgentTaskFilter>(defaultFilter);
  const sortedTasks = useMemo(() => sortAgentTasks(tasks), [tasks]);
  const visibleTasks =
    filter === "all"
      ? sortedTasks
      : sortedTasks.filter((task) => task.status === filter);
  const attentionCount = tasks.filter(
    ({ status }) => status === "needs_attention",
  ).length;

  return (
    <section
      aria-label={title}
      className={`agent-task-inbox ${className}`.trim()}
    >
      <header className="agent-task-inbox-header">
        <div>
          <span>AI 工作台</span>
          <strong>{title}</strong>
        </div>
        {attentionCount > 0 ? (
          <span className="agent-task-inbox-attention">
            {attentionCount} 项需要处理
          </span>
        ) : null}
      </header>

      <div aria-label="筛选任务" className="agent-task-inbox-filters" role="group">
        {filters.map((item) => (
          <button
            aria-pressed={filter === item.id}
            data-active={filter === item.id}
            key={item.id}
            onClick={() => setFilter(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="agent-task-inbox-list">
        {visibleTasks.length > 0 ? (
          visibleTasks.map((task) => {
            const meta = getAgentTaskStatusMeta(task.status);
            const selected = task.id === selectedTaskId;
            const progress = Math.min(100, Math.max(0, task.progress ?? 0));

            return (
              <button
                aria-pressed={selected}
                className="agent-task-inbox-item"
                data-selected={selected}
                data-status={task.status}
                key={task.id}
                onClick={() => onSelectTask?.(task)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="agent-task-inbox-status-dot"
                  data-tone={meta.tone}
                />
                <span className="agent-task-inbox-copy">
                  <span className="agent-task-inbox-item-topline">
                    <strong>{task.title}</strong>
                    <small>{task.updatedAt}</small>
                  </span>
                  {task.context ? <small>{task.context}</small> : null}
                  <span>{task.summary}</span>
                  {task.attentionReason ? (
                    <em>{task.attentionReason}</em>
                  ) : null}
                  {task.status === "in_progress" ? (
                    <span
                      aria-label={`当前进度 ${progress}%`}
                      className="agent-task-inbox-progress"
                    >
                      <span style={{ width: `${progress}%` }} />
                    </span>
                  ) : null}
                </span>
                <span className="agent-task-inbox-next">
                  <span data-tone={meta.tone}>{meta.label}</span>
                  <strong>{task.actionLabel ?? "打开任务"}</strong>
                </span>
              </button>
            );
          })
        ) : (
          <p className="agent-task-inbox-empty">当前筛选下没有任务。</p>
        )}
      </div>
    </section>
  );
}
