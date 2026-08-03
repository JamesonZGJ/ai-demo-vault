import type { Metadata } from "next";
import Link from "next/link";

import { CapabilityCard } from "../../components/capabilities/capability-card";
import { getCapabilities } from "../../lib/capabilities/catalog";
import { getMarketplaceCategoryCount, marketplaceCategories } from "../../lib/capabilities/marketplace-taxonomy";
import { isLocalBlueprintPilot } from "../../lib/env";

export function generateMetadata(): Metadata {
  return {
    description: "浏览、预览并复用 AI 产品交互、上传、工作流、内容工具和视觉模块。",
    ...(isLocalBlueprintPilot() ? { robots: { follow: false, index: false } } : {}),
  };
}

const popularSearches = [
  ["智能输入框", "Prompt Composer"],
  ["文件上传", "File Upload"],
  ["Agent 连线", "Connection Beam"],
  ["加载状态", "Skeleton"],
  ["命令面板", "Command Palette"],
  ["文本工具", "Selection Toolbar"],
] as const;

const featuredSlugs = [
  "prompt-composer",
  "file-upload-dropzone",
  "connection-beam",
  "text-selection-toolbar",
  "command-palette",
  "skeleton-loader",
  "color-extraction",
  "toast-stack",
] as const;

export default function HomePage() {
  const allCapabilities = getCapabilities();
  const capabilityBySlug = new Map(allCapabilities.map((capability) => [capability.slug, capability]));
  const featured = featuredSlugs.map((slug) => capabilityBySlug.get(slug)).filter((capability): capability is NonNullable<typeof capability> => Boolean(capability));
  const featuredIds = new Set(featured.map(({ id }) => id));
  const newest = allCapabilities
    .filter(({ id, previewStatus }) => previewStatus === "preview_ready" && !featuredIds.has(id))
    .sort((a, b) => (b.series?.episode ?? 0) - (a.series?.episode ?? 0))
    .slice(0, 4);

  return (
    <main className="vault-home" id="main-content" tabIndex={-1}>
      <section className="vault-home-hero">
        <div className="vault-wide-shell">
          <p className="vault-hero-kicker"><span /> AI Product Interaction Library</p>
          <h1>找到 AI 产品里真正可复用的交互模块</h1>
          <p>浏览、预览并复用智能输入、多模态上传、Agent 工作流等 AI 产品能力。</p>
          <form action="/explore" className="vault-hero-search" method="get">
            <span aria-hidden="true">⌕</span>
            <label className="sr-only" htmlFor="vault-home-search">搜索 AI 产品模块</label>
            <input id="vault-home-search" name="q" placeholder="搜索智能输入、Agent 节点、多模态上传……" type="search" />
            <button type="submit">搜索模块</button>
          </form>
          <div className="vault-popular-tags" aria-label="热门搜索"><span>热门搜索</span>{popularSearches.map(([label, query]) => <Link href={`/explore?q=${encodeURIComponent(query)}`} key={query}>{label}</Link>)}</div>
        </div>
      </section>

      <nav aria-label="模块分类" className="vault-home-categories">
        <div className="vault-wide-shell">
          <Link className="is-active" href="/explore"><span>全部模块</span><small>{allCapabilities.length}</small></Link>
          {marketplaceCategories.map((category) => <Link href={`/explore?category=${category.id}`} key={category.id}><span>{category.label}</span><small>{getMarketplaceCategoryCount(allCapabilities, category.id)}</small></Link>)}
        </div>
      </nav>

      <section className="vault-gallery-section vault-wide-shell" aria-labelledby="featured-heading">
        <div className="vault-gallery-heading"><div><span>CURATED BLOCKS</span><h2 id="featured-heading">精选 AI 构建模块</h2></div><div className="vault-gallery-tabs"><span className="is-active">精选</span><a href="#newest">最新</a><Link href="/explore">浏览全部</Link></div></div>
        <div className="vault-block-grid">{featured.map((capability) => <CapabilityCard capability={capability} key={capability.id} />)}</div>
      </section>

      <section className="vault-gallery-section vault-wide-shell" id="newest" aria-labelledby="newest-heading">
        <div className="vault-gallery-heading"><div><span>JUST ADDED</span><h2 id="newest-heading">最近完成</h2></div><Link className="vault-heading-link" href="/explore">查看完整目录 →</Link></div>
        <div className="vault-block-grid vault-block-grid-compact">{newest.map((capability) => <CapabilityCard capability={capability} key={capability.id} />)}</div>
      </section>

      <section className="vault-collection-strip vault-wide-shell" aria-label="高级内容类型">
        <div><span>COLLECTIONS</span><strong>多个模块组合成完整产品结构</strong></div>
        <Link href="/bundles"><span>Bundles</span><strong>相关模块组合包</strong><i aria-hidden="true">→</i></Link>
        <Link href="/blueprints"><span>Blueprints</span><strong>完整 AI 产品拆解</strong><i aria-hidden="true">→</i></Link>
      </section>
    </main>
  );
}
