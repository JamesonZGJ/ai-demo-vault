"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CircularTheme = "dark" | "light";

export type CircularRevealOrigin = {
  x: number;
  y: number;
};

export type CircularThemeRevealProps = {
  children: (theme: CircularTheme) => ReactNode;
  className?: string;
  duration?: number;
  initialTheme?: CircularTheme;
  onThemeChange?: (theme: CircularTheme) => void;
};

export function getRevealRadius(
  origin: CircularRevealOrigin,
  width: number,
  height: number,
) {
  const farthestX = Math.max(origin.x, width - origin.x);
  const farthestY = Math.max(origin.y, height - origin.y);
  return Math.hypot(farthestX, farthestY);
}

export function getCircularRevealKeyframes(
  origin: CircularRevealOrigin,
  radius: number,
) {
  const center = `${Math.round(origin.x)}px ${Math.round(origin.y)}px`;
  return [
    { clipPath: `circle(0px at ${center})` },
    { clipPath: `circle(${Math.ceil(radius)}px at ${center})` },
  ];
}

export function CircularThemeReveal({
  children,
  className = "",
  duration = 560,
  initialTheme = "light",
  onThemeChange,
}: CircularThemeRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<CircularTheme>(initialTheme);
  const [pendingTheme, setPendingTheme] = useState<CircularTheme | null>(null);
  const [origin, setOrigin] = useState<CircularRevealOrigin>({ x: 0, y: 0 });

  useEffect(() => {
    const root = rootRef.current;
    const overlay = overlayRef.current;
    if (!root || !overlay || !pendingTheme) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion || typeof overlay.animate !== "function") {
      setTheme(pendingTheme);
      setPendingTheme(null);
      onThemeChange?.(pendingTheme);
      return;
    }

    const radius = getRevealRadius(origin, root.clientWidth, root.clientHeight);
    const animation = overlay.animate(
      getCircularRevealKeyframes(origin, radius),
      {
        duration,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      },
    );

    animation.onfinish = () => {
      setTheme(pendingTheme);
      setPendingTheme(null);
      onThemeChange?.(pendingTheme);
    };

    return () => animation.cancel();
  }, [duration, onThemeChange, origin, pendingTheme]);

  function toggleTheme() {
    const root = rootRef.current;
    if (!root || pendingTheme) return;

    const button = root.querySelector<HTMLButtonElement>(
      ".circular-theme-reveal-trigger",
    );
    const rootRect = root.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();
    setOrigin({
      x: buttonRect
        ? buttonRect.left - rootRect.left + buttonRect.width / 2
        : rootRect.width / 2,
      y: buttonRect
        ? buttonRect.top - rootRect.top + buttonRect.height / 2
        : rootRect.height / 2,
    });
    setPendingTheme(theme === "light" ? "dark" : "light");
  }

  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <div
      className={`circular-theme-reveal ${className}`.trim()}
      data-theme={theme}
      ref={rootRef}
    >
      <div className="circular-theme-reveal-layer">{children(theme)}</div>
      {pendingTheme ? (
        <div
          aria-hidden="true"
          className="circular-theme-reveal-layer circular-theme-reveal-overlay"
          ref={overlayRef}
        >
          {children(pendingTheme)}
        </div>
      ) : null}
      <button
        aria-label={`切换到${nextTheme === "dark" ? "深色" : "浅色"}主题`}
        className="circular-theme-reveal-trigger"
        disabled={Boolean(pendingTheme)}
        onClick={toggleTheme}
        type="button"
      >
        <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
        <span>{theme === "light" ? "深色" : "浅色"}</span>
      </button>
    </div>
  );
}
