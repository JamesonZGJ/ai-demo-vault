"use client";

import { useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: number;
  opacity?: number;
  borderOpacity?: number;
  shadowOpacity?: number;
  glowOpacity?: number;
  onClick?: () => void;
}

/**
 * 自研玻璃拟态卡片。
 * 视觉参数是显式输入，方便在不同项目中保持一致并逐步调参。
 */
export function GlassCard({
  children,
  className = "",
  blur = 18,
  opacity = 0.16,
  borderOpacity = 0.3,
  shadowOpacity = 0.28,
  glowOpacity = 0.26,
  onClick,
}: GlassCardProps) {
  const [pointer, setPointer] = useState({ x: 50, y: 45 });
  const [isHovering, setIsHovering] = useState(false);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
    });
  }

  const tiltX = (pointer.y - 50) * -0.045;
  const tiltY = (pointer.x - 50) * 0.045;
  const style = {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgb(255 255 255 / ${glowOpacity}), transparent 42%), rgb(255 255 255 / ${opacity})`,
    border: `1px solid rgb(255 255 255 / ${borderOpacity})`,
    boxShadow: `0 24px 80px rgb(0 0 0 / ${shadowOpacity}), inset 0 1px 0 rgb(255 255 255 / ${Math.min(borderOpacity + 0.1, 1)})`,
    transform: `perspective(1000px) rotateX(${isHovering ? tiltX : 0}deg) rotateY(${isHovering ? tiltY : 0}deg) translateY(${isHovering ? -2 : 0}px)`,
  } satisfies CSSProperties;

  return (
    <div
      aria-label="玻璃拟态卡片"
      className={`glass-card${className ? ` ${className}` : ""}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        onClick();
      }}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => {
        setIsHovering(false);
        setPointer({ x: 50, y: 45 });
      }}
      onPointerMove={handlePointerMove}
      role={onClick ? "button" : undefined}
      style={style}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
