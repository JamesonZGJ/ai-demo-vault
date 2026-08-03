"use client";

import type { ReactNode } from "react";

export type SkeletonLoaderProps = {
  children: ReactNode;
  label?: string;
  loading: boolean;
  rows?: number;
  showAvatar?: boolean;
};

const WIDTH_PATTERN = [92, 76, 84, 58, 70];

export function buildSkeletonWidths(rows: number) {
  const safeRows = Math.max(1, Math.min(8, Math.floor(rows)));
  return Array.from(
    { length: safeRows },
    (_, index) => WIDTH_PATTERN[index % WIDTH_PATTERN.length],
  );
}

export function SkeletonLoader({
  children,
  label = "内容正在加载",
  loading,
  rows = 3,
  showAvatar = true,
}: SkeletonLoaderProps) {
  return (
    <section
      aria-busy={loading}
      aria-label={label}
      className="skeleton-loader-module"
    >
      {loading ? (
        <>
          <span className="sr-only" role="status">
            {label}
          </span>
          <div aria-hidden="true" className="skeleton-loader-card">
            <div className="skeleton-loader-head">
              {showAvatar ? <span className="skeleton-loader-avatar" /> : null}
              <span className="skeleton-loader-heading-lines">
                <span style={{ width: "44%" }} />
                <span style={{ width: "28%" }} />
              </span>
            </div>
            <div className="skeleton-loader-lines">
              {buildSkeletonWidths(rows).map((width, index) => (
                <span
                  key={`${width}-${index}`}
                  style={{ width: `${width}%` }}
                />
              ))}
            </div>
            <div className="skeleton-loader-actions">
              <span />
              <span />
            </div>
          </div>
        </>
      ) : (
        <div className="skeleton-loader-content">{children}</div>
      )}
    </section>
  );
}
