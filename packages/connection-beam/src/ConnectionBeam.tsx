"use client";

import {
  useEffect,
  useId,
  useState,
  type RefObject,
} from "react";

export interface BeamPoint {
  x: number;
  y: number;
}

export interface ConnectionBeamProps {
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  duration?: number;
  reverse?: boolean;
  color?: string;
  pathColor?: string;
  pathWidth?: number;
  beamWidth?: number;
  className?: string;
}

interface BeamGeometry {
  start: BeamPoint;
  end: BeamPoint;
  width: number;
  height: number;
}

/** 根据两个中心点生成稳定的三次贝塞尔曲线路径。 */
export function createConnectionPath(
  start: BeamPoint,
  end: BeamPoint,
  curvature = 0.45,
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const horizontal = Math.abs(dx) >= Math.abs(dy);
  const distance = Math.max(Math.abs(dx), Math.abs(dy));
  const bend = Math.max(24, distance * Math.max(0, curvature));

  if (horizontal) {
    const direction = Math.sign(dx) || 1;
    return `M ${start.x} ${start.y} C ${start.x + bend * direction} ${start.y}, ${end.x - bend * direction} ${end.y}, ${end.x} ${end.y}`;
  }

  const direction = Math.sign(dy) || 1;
  return `M ${start.x} ${start.y} C ${start.x} ${start.y + bend * direction}, ${end.x} ${end.y - bend * direction}, ${end.x} ${end.y}`;
}

/** 自研 SVG 连接光束；节点移动或容器缩放时自动重算路径。 */
export function ConnectionBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0.45,
  duration = 2.4,
  reverse = false,
  color = "#a7f3d0",
  pathColor = "rgba(148, 163, 184, 0.28)",
  pathWidth = 1.5,
  beamWidth = 3,
  className = "",
}: ConnectionBeamProps) {
  const [geometry, setGeometry] = useState<BeamGeometry | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    if (!container || !from || !to) return;

    const update = () => {
      const containerRect = container.getBoundingClientRect();
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();
      setGeometry({
        width: containerRect.width,
        height: containerRect.height,
        start: {
          x: fromRect.left - containerRect.left + fromRect.width / 2,
          y: fromRect.top - containerRect.top + fromRect.height / 2,
        },
        end: {
          x: toRect.left - containerRect.left + toRect.width / 2,
          y: toRect.top - containerRect.top + toRect.height / 2,
        },
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(from);
    observer.observe(to);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [containerRef, fromRef, toRef]);

  if (!geometry) return null;

  const path = createConnectionPath(
    reverse ? geometry.end : geometry.start,
    reverse ? geometry.start : geometry.end,
    curvature,
  );
  const safeDuration = Math.max(0.4, duration);

  return (
    <svg
      aria-hidden="true"
      className={`connection-beam${className ? ` ${className}` : ""}`}
      height="100%"
      style={{ inset: 0, overflow: "visible", pointerEvents: "none", position: "absolute" }}
      viewBox={`0 0 ${Math.max(1, geometry.width)} ${Math.max(1, geometry.height)}`}
      width="100%"
    >
      <defs>
        <filter id={`beam-glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur result="blur" stdDeviation="3.5" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={path} fill="none" stroke={pathColor} strokeWidth={pathWidth} />
      {reducedMotion ? null : (
        <path
          d={path}
          fill="none"
          filter={`url(#beam-glow-${id})`}
          pathLength="100"
          stroke={color}
          strokeDasharray="13 87"
          strokeLinecap="round"
          strokeWidth={beamWidth}
        >
          <animate
            attributeName="stroke-dashoffset"
            dur={`${safeDuration}s`}
            from="100"
            repeatCount="indefinite"
            to="0"
          />
        </path>
      )}
    </svg>
  );
}
