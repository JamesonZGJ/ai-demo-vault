import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import "./marketplace-system.css";
import "../packages/ai-reasoning-panel/src/ai-reasoning-panel.css";
import "../packages/morphing-dialog/src/morphing-dialog.css";

import { SiteFooter } from "../components/layout/site-footer";
import { SiteHeader } from "../components/layout/site-header";
import { getSiteUrl } from "../lib/catalog/site-url";

const description =
  "AI Demo Vault：搜索、预览并复用 AI 产品交互、工作流、提示词和代码模块。";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description,
  metadataBase: getSiteUrl(),
  icons: { icon: "/icon.svg" },
  openGraph: {
    description,
    locale: "zh_CN",
    images: [{ alt: "AI Demo Vault", height: 630, url: "/og-image.svg", width: 1200 }],
    siteName: "AI Demo Vault",
    title: "AI Demo Vault｜AI 产品交互模块库",
    type: "website",
    url: "/",
  },
  title: {
    default: "AI Demo Vault｜AI 产品交互模块库",
    template: "%s｜AI Demo Vault",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#101114",
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
