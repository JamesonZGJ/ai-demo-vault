import type { Metadata } from "next";
import Link from "next/link";

import { CapabilityGrid } from "../../../components/capabilities/capability-grid";
import { getCapabilities, getCapabilityCategories, getCapabilityStacks, getCategoryLabel } from "../../../lib/capabilities/catalog";

const popularSearches = [["玻璃", "Glass"], ["首页首屏", "Hero"], ["聊天", "Chat"], ["提示词", "Prompt"], ["动画", "Animation"], ["图片上传", "Image Upload"], ["票根", "Ticket"], ["图片取色", "Color Picker"]] as const;

export const metadata: Metadata = {
  alternates: { canonical: "/explore" },
  description: "搜索可复用的 AI 产品能力模块，在线预览效果，查看提示词、源码状态和接入说明。",
  title: "浏览能力模块",
};

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; stack?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const stack = params.stack?.trim() ?? "";
  const filtered = getCapabilities(query).filter((capability) => (!category || capability.category === category) && (!stack || capability.stack.includes(stack)));
  const categories = getCapabilityCategories();
  const stacks = getCapabilityStacks();
  return (
    <main className="capability-explore-page" id="main-content" tabIndex={-1}>
      <section className="capability-explore-hero site-shell">
        <span className="eyebrow">AI 能力模块库</span>
        <h1>找到你现在需要的那个模块。</h1>
        <p>搜索一个可复用的界面、动效或 AI 工作流，先看效果，再了解提示词、源码状态和接入方式。</p>
        <form action="/explore" className="capability-search-form" method="get">
          <label className="sr-only" htmlFor="capability-search">搜索能力模块</label>
          <input defaultValue={query} id="capability-search" name="q" placeholder="试试：玻璃、悬停、聊天、提示词、动画…" type="search" />
          <button className="button button-primary" type="submit">搜索模块</button>
        </form>
        <div className="capability-hot-searches" aria-label="热门搜索">{popularSearches.map(([label, term]) => <Link href={`/explore?q=${encodeURIComponent(term)}`} key={term}>{label}</Link>)}</div>
      </section>

      <section className="capability-filter-strip" aria-label="能力模块分类">
        <div className="site-shell capability-filter-inner">
          <div><span className="eyebrow">按需求查找</span><strong>能力模块分类</strong></div>
          <div className="capability-filter-links"><Link className={!category ? "is-active" : ""} href={query ? `/explore?q=${encodeURIComponent(query)}` : "/explore"}>全部</Link>{categories.map((item) => <Link className={category === item ? "is-active" : ""} href={`/explore?category=${encodeURIComponent(item)}`} key={item}>{getCategoryLabel(item)}</Link>)}</div>
        </div>
      </section>

      <section className="site-shell capability-results-section" aria-labelledby="capability-results-title">
        <div className="capability-results-heading"><div><span className="eyebrow">{query ? `“${query}”的搜索结果` : "模块目录"}</span><h2 id="capability-results-title">{filtered.length} 个能力模块</h2></div><div className="capability-stack-filter">{stacks.slice(0, 6).map((item) => <Link className={stack === item ? "is-active" : ""} href={`/explore?stack=${encodeURIComponent(item)}`} key={item}>{item}</Link>)}</div></div>
        {filtered.length > 0 ? <CapabilityGrid capabilities={filtered} /> : <div className="capability-empty"><span className="state-kicker">暂时没有结果</span><h2>还没有匹配的能力模块。</h2><p>试试“玻璃”“首页首屏”“提示词”，或者清除当前筛选。</p><Link className="button button-secondary" href="/explore">清除筛选</Link></div>}
      </section>
    </main>
  );
}
