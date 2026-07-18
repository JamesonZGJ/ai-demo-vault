import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { SiteFooter } from "../components/layout/site-footer";
import { SiteHeader } from "../components/layout/site-header";
import { getSiteUrl } from "../lib/catalog/site-url";

const description =
  "AI Demo Marketplace：搜索、预览并复用 AI 前端能力、交互效果、动画和 AI Workflow。";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description,
  metadataBase: getSiteUrl(),
  icons: { icon: "/icon.svg" },
  openGraph: {
    description,
    locale: "zh_CN",
    images: [{ alt: "AI Demo Marketplace", height: 630, url: "/og-image.svg", width: 1200 }],
    siteName: "AI Demo Marketplace",
    title: "AI Demo Marketplace｜Find the capability your next build needs",
    type: "website",
    url: "/",
  },
  title: {
    default: "AI Demo Marketplace｜Find the capability your next build needs",
    template: "%s｜AI Demo Marketplace",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7f7f4",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html data-scroll-behavior="smooth" lang="zh-CN">
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
