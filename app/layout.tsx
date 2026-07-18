import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { SiteFooter } from "../components/layout/site-footer";
import { SiteHeader } from "../components/layout/site-header";
import { getSiteUrl } from "../lib/catalog/site-url";

const description =
  "AI Build Blocks Marketplace：搜索、预览并复用 AI 产品的 UI、Prompt、代码和交互模块。";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description,
  metadataBase: getSiteUrl(),
  icons: { icon: "/icon.svg" },
  openGraph: {
    description,
    locale: "zh_CN",
    images: [{ alt: "AI Build Blocks Marketplace", height: 630, url: "/og-image.svg", width: 1200 }],
    siteName: "AI Build Blocks Marketplace",
    title: "AI Build Blocks Marketplace｜Build AI products faster",
    type: "website",
    url: "/",
  },
  title: {
    default: "AI Build Blocks Marketplace｜Build AI products faster",
    template: "%s｜AI Build Blocks Marketplace",
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
