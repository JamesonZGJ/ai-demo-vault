import type { Metadata } from "next";

import { CapabilityBrowser } from "../../../components/capabilities/capability-browser";
import { getCapabilities } from "../../../lib/capabilities/catalog";

export const metadata: Metadata = {
  alternates: { canonical: "/explore" },
  description: "即时搜索和筛选可复用的 AI 产品交互、上传、工作流、内容工具与视觉模块。",
  title: "浏览 AI 构建模块",
};

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; stack?: string }> }) {
  const params = await searchParams;
  return (
    <main className="vault-catalog-page" id="main-content" tabIndex={-1}>
      <header className="vault-catalog-header">
        <div className="vault-wide-shell">
          <span>AI PRODUCT BLOCKS</span>
          <h1>浏览所有构建模块</h1>
          <p>输入关键词后即时筛选，也可以按 AI 能力、技术栈、难度和真实资料状态浏览。</p>
        </div>
      </header>
      <div className="vault-wide-shell"><CapabilityBrowser capabilities={getCapabilities()} initialCategory={params.category?.trim() ?? ""} initialQuery={params.q?.trim() ?? ""} initialStack={params.stack?.trim() ?? ""} /></div>
    </main>
  );
}
