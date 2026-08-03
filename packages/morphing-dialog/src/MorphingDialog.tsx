"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type MorphingDialogRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export type MorphingDialogProps = {
  children: ReactNode;
  className?: string;
  description: string;
  eyebrow?: string;
  maxHeight?: number;
  maxWidth?: number;
  title: string;
  visual?: ReactNode;
};

type MorphingDialogPhase = "closed" | "opening" | "open" | "closing";
const transitionDurationMs = 520;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function getCenteredDialogRect(
  viewportWidth: number,
  viewportHeight: number,
  maxWidth = 760,
  maxHeight = 620,
  inset = 20,
): MorphingDialogRect {
  const width = Math.max(0, Math.min(maxWidth, viewportWidth - inset * 2));
  const height = Math.max(0, Math.min(maxHeight, viewportHeight - inset * 2));
  return {
    height,
    left: Math.max(inset, (viewportWidth - width) / 2),
    top: Math.max(inset, (viewportHeight - height) / 2),
    width,
  };
}

function toRect(rect: DOMRect): MorphingDialogRect {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

export function MorphingDialog({
  children,
  className = "",
  description,
  eyebrow = "DETAIL",
  maxHeight = 620,
  maxWidth = 760,
  title,
  visual,
}: MorphingDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<MorphingDialogPhase>("closed");
  const [sourceRect, setSourceRect] = useState<MorphingDialogRect | null>(null);
  const [targetRect, setTargetRect] = useState<MorphingDialogRect | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const completeClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setPhase("closed");
    restoreFocusRef.current?.focus();
  }, []);

  const closeDialog = useCallback(() => {
    if (phase === "closed" || phase === "closing") return;
    if (reducedMotion) {
      completeClose();
      return;
    }
    setPhase("closing");
    closeTimerRef.current = window.setTimeout(
      completeClose,
      transitionDurationMs,
    );
  }, [completeClose, phase, reducedMotion]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openDialog = () => {
    const trigger = triggerRef.current;
    if (!trigger || phase !== "closed") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setReducedMotion(prefersReducedMotion);
    setSourceRect(toRect(trigger.getBoundingClientRect()));
    setTargetRect(
      getCenteredDialogRect(
        window.innerWidth,
        window.innerHeight,
        maxWidth,
        maxHeight,
      ),
    );
    setPhase(prefersReducedMotion ? "open" : "opening");
  };

  useEffect(() => {
    if (phase !== "opening") return;
    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = window.requestAnimationFrame(() => {
        setPhase("open");
      });
    });
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "closed") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const updateTarget = () => {
      setTargetRect(
        getCenteredDialogRect(
          window.innerWidth,
          window.innerHeight,
          maxWidth,
          maxHeight,
        ),
      );
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updateTarget);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updateTarget);
    };
  }, [closeDialog, maxHeight, maxWidth, phase]);

  useEffect(() => {
    if (phase === "open") {
      dialogRef.current
        ?.querySelector<HTMLButtonElement>(".morphing-dialog-close")
        ?.focus();
    }
  }, [phase]);

  const expanded = phase === "open";
  const activeRect = expanded ? targetRect : sourceRect;

  return (
    <div
      className={`morphing-dialog ${phase !== "closed" ? "is-active" : ""} ${className}`.trim()}
      data-state={phase}
    >
      <button
        aria-expanded={phase !== "closed"}
        aria-haspopup="dialog"
        aria-label={`打开“${title}”详情`}
        className="morphing-dialog-trigger"
        onClick={openDialog}
        ref={triggerRef}
        type="button"
      >
        <span className="morphing-dialog-trigger-visual">{visual}</span>
        <span className="morphing-dialog-trigger-copy">
          <small>{eyebrow}</small>
          <strong>{title}</strong>
          <span>{description}</span>
        </span>
        <span aria-hidden="true" className="morphing-dialog-trigger-arrow">↗</span>
      </button>

      {phase !== "closed" && activeRect && typeof document !== "undefined"
        ? createPortal(
            <div
              className={`morphing-dialog-backdrop ${expanded ? "is-open" : ""}`}
              data-state={phase}
              onMouseDown={(event) => {
                if (event.currentTarget === event.target) closeDialog();
              }}
            >
              <div
                aria-describedby={descriptionId}
                aria-labelledby={titleId}
                aria-modal="true"
                className={`morphing-dialog-surface ${expanded ? "is-open" : ""}`}
                ref={dialogRef}
                role="dialog"
                style={{
                  height: activeRect.height,
                  left: activeRect.left,
                  top: activeRect.top,
                  width: activeRect.width,
                }}
              >
                <div className="morphing-dialog-visual">{visual}</div>
                <div className="morphing-dialog-content">
                  <div className="morphing-dialog-heading">
                    <div>
                      <small>{eyebrow}</small>
                      <h2 id={titleId}>{title}</h2>
                      <p id={descriptionId}>{description}</p>
                    </div>
                    <button
                      aria-label="关闭详情弹窗"
                      className="morphing-dialog-close"
                      onClick={closeDialog}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                  <div className="morphing-dialog-body">{children}</div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
