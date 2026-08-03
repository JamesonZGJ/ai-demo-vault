"use client";

import type { CSSProperties } from "react";

export type ToastVariant = "default" | "success" | "warning" | "error";

export type ToastStackItem = {
  actionLabel?: string;
  description?: string;
  id: string;
  progress?: number;
  title: string;
  variant?: ToastVariant;
};

export type ToastStackLayoutItem = {
  hidden: boolean;
  index: number;
  offset: number;
  scale: number;
};

export type ToastStackProps = {
  expanded?: boolean;
  items: ToastStackItem[];
  label?: string;
  maxVisible?: number;
  onAction?: (id: string) => void;
  onDismiss: (id: string) => void;
};

const EXPANDED_GAP = 112;
const COLLAPSED_GAP = 13;

export function clampToastProgress(progress = 1) {
  return Math.max(0, Math.min(1, progress));
}

export function getToastStackLayout(
  itemCount: number,
  maxVisible = 4,
  expanded = false,
): ToastStackLayoutItem[] {
  const safeCount = Number.isFinite(itemCount)
    ? Math.max(0, Math.floor(itemCount))
    : 0;
  const safeMax = Number.isFinite(maxVisible)
    ? Math.max(1, Math.min(6, Math.floor(maxVisible)))
    : 4;

  return Array.from({ length: safeCount }, (_, index) => ({
    hidden: index >= safeMax,
    index,
    offset: index * (expanded ? EXPANDED_GAP : COLLAPSED_GAP),
    scale: expanded
      ? 1
      : Math.max(0.88, Math.round((1 - index * 0.035) * 1000) / 1000),
  }));
}

function getVariantLabel(variant: ToastVariant) {
  if (variant === "success") return "成功";
  if (variant === "warning") return "提醒";
  if (variant === "error") return "失败";
  return "通知";
}

export function ToastStack({
  expanded = false,
  items,
  label = "通知中心",
  maxVisible = 4,
  onAction,
  onDismiss,
}: ToastStackProps) {
  const layout = getToastStackLayout(items.length, maxVisible, expanded);
  const visibleCount = layout.filter(({ hidden }) => !hidden).length;

  return (
    <section
      aria-label={label}
      aria-live="polite"
      className={`toast-stack-module${expanded ? " is-expanded" : ""}`}
      style={{ "--toast-visible-count": visibleCount } as CSSProperties}
    >
      {items.length === 0 ? (
        <div className="toast-stack-empty" role="status">
          暂无通知
        </div>
      ) : (
        items.map((item, index) => {
          const position = layout[index];
          if (!position || position.hidden) return null;

          const variant = item.variant ?? "default";
          const progress = clampToastProgress(item.progress);
          return (
            <article
              className={`toast-stack-item toast-stack-${variant}`}
              key={item.id}
              role="status"
              style={
                {
                  "--toast-offset": `${position.offset}px`,
                  "--toast-scale": position.scale,
                  "--toast-progress": progress,
                  zIndex: items.length - index,
                } as CSSProperties
              }
            >
              <div className="toast-stack-icon" aria-hidden="true">
                {variant === "success"
                  ? "✓"
                  : variant === "warning"
                    ? "!"
                    : variant === "error"
                      ? "×"
                      : "i"}
              </div>
              <div className="toast-stack-copy">
                <span>{getVariantLabel(variant)}</span>
                <strong>{item.title}</strong>
                {item.description ? <p>{item.description}</p> : null}
                {item.actionLabel && onAction ? (
                  <button onClick={() => onAction(item.id)} type="button">
                    {item.actionLabel}
                  </button>
                ) : null}
              </div>
              <button
                aria-label={`关闭通知：${item.title}`}
                className="toast-stack-dismiss"
                onClick={() => onDismiss(item.id)}
                type="button"
              >
                ×
              </button>
              <span aria-hidden="true" className="toast-stack-progress" />
            </article>
          );
        })
      )}
    </section>
  );
}
