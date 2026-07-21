"use client";

import { useEffect, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";

export interface MagicCardProps {
  children: ReactNode;
  className?: string;
  spotlightSize?: number;
  glowOpacity?: number;
  tiltDegrees?: number;
  onClick?: () => void;
}

/** 自研鼠标跟随光斑卡片，不依赖第三方动画库。 */
export function MagicCard({
  children,
  className = "",
  spotlightSize = 32,
  glowOpacity = 0.72,
  tiltDegrees = 1.8,
  onClick,
}: MagicCardProps) {
  const [pointer, setPointer] = useState({ x: 50, y: 45 });
  const [isHovering, setIsHovering] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
    });
  }

  const tiltX = reducedMotion ? 0 : (pointer.y - 50) * (-tiltDegrees / 50);
  const tiltY = reducedMotion ? 0 : (pointer.x - 50) * (tiltDegrees / 50);
  const style = {
    background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgb(183 255 232 / ${glowOpacity}), transparent ${spotlightSize}%), linear-gradient(145deg, rgb(255 255 255 / .2), rgb(255 255 255 / .04))`,
    borderColor: `rgb(191 255 235 / ${Math.min(glowOpacity + 0.08, 1)})`,
    boxShadow: `0 28px 70px rgb(4 12 28 / .34), 0 0 ${Math.round(spotlightSize * 0.55)}px rgb(125 255 219 / ${glowOpacity * 0.42})`,
    transform: `perspective(900px) rotateX(${isHovering ? tiltX : 0}deg) rotateY(${isHovering ? tiltY : 0}deg) translateY(${isHovering ? -3 : 0}px)`,
    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: 1,
    color: "#f8fafc",
    minHeight: 220,
    overflow: "hidden",
    padding: 28,
    position: "relative",
    transition: reducedMotion ? "none" : "border-color .2s ease, box-shadow .2s ease, transform .2s ease",
  } satisfies CSSProperties;

  return (
    <div
      aria-label="玻璃光斑卡片"
      className={`magic-card${className ? ` ${className}` : ""}`}
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
