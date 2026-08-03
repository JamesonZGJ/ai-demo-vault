"use client";

export type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "executing"
  | "complete"
  | "error";

export type ApprovalStateMeta = {
  label: string;
  tone: "warning" | "active" | "success" | "error" | "neutral";
};

export type AIActionApprovalCardProps = {
  action: string;
  className?: string;
  description?: string;
  onApprove?: () => void;
  onReject?: () => void;
  result?: string;
  risk: string;
  status: ApprovalStatus;
  target: string;
  title?: string;
};

export function getApprovalStateMeta(
  status: ApprovalStatus,
): ApprovalStateMeta {
  const states: Record<ApprovalStatus, ApprovalStateMeta> = {
    approved: { label: "已允许一次", tone: "active" },
    complete: { label: "操作已完成", tone: "success" },
    error: { label: "执行失败", tone: "error" },
    executing: { label: "正在执行", tone: "active" },
    pending: { label: "等待你的确认", tone: "warning" },
    rejected: { label: "已拒绝，操作未执行", tone: "neutral" },
  };
  return states[status];
}

export function AIActionApprovalCard({
  action,
  className = "",
  description = "确认以后才会执行这项操作。",
  onApprove,
  onReject,
  result,
  risk,
  status,
  target,
  title = "需要你的确认",
}: AIActionApprovalCardProps) {
  const state = getApprovalStateMeta(status);
  const isPending = status === "pending";

  return (
    <section
      aria-label={title}
      className={`ai-action-approval-card ${className}`.trim()}
      data-status={status}
      data-tone={state.tone}
    >
      <div className="ai-action-approval-card-header">
        <span aria-hidden="true" className="ai-action-approval-card-shield">
          !
        </span>
        <div>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
      </div>

      <dl className="ai-action-approval-card-summary">
        <div>
          <dt>准备执行</dt>
          <dd>{action}</dd>
        </div>
        <div>
          <dt>影响对象</dt>
          <dd>{target}</dd>
        </div>
        <div>
          <dt>风险说明</dt>
          <dd>{risk}</dd>
        </div>
      </dl>

      <div
        aria-live="polite"
        className="ai-action-approval-card-status"
        data-tone={state.tone}
      >
        <span aria-hidden="true" />
        <strong>{state.label}</strong>
        {result ? <small>{result}</small> : null}
      </div>

      {isPending ? (
        <div className="ai-action-approval-card-actions">
          <button onClick={onReject} type="button">
            拒绝
          </button>
          <button className="is-primary" onClick={onApprove} type="button">
            允许一次
          </button>
        </div>
      ) : null}
    </section>
  );
}
