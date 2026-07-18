"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";

export function isMeasuredPublicPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/demos" ||
    (pathname.startsWith("/demos/") && pathname !== "/demos/colorsnap")
  );
}

export function sanitizePublicAnalyticsEvent<T extends { url: string }>(
  event: T,
  origin: string,
  expectedPath?: string,
): T | null {
  const url = new URL(event.url, origin);
  if (
    !isMeasuredPublicPath(url.pathname) ||
    (expectedPath !== undefined && url.pathname !== expectedPath)
  ) {
    return null;
  }

  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
}

export function PublicAnalytics({ path }: { path: string }) {
  const pathname = usePathname();

  if (pathname !== path || !isMeasuredPublicPath(pathname)) return null;

  return (
    <Analytics
      beforeSend={(event) =>
        sanitizePublicAnalyticsEvent(event, window.location.origin, path)
      }
    />
  );
}
