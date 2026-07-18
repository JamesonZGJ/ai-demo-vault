import type { Metadata } from "next";
import Link from "next/link";

import { CapabilityCard } from "../../components/capabilities/capability-card";
import { getCapabilities, getCapabilityCategories } from "../../lib/capabilities/catalog";
import { isLocalBlueprintPilot } from "../../lib/env";

export function generateMetadata(): Metadata {
  return {
    description: "搜索、预览并复用 AI 前端能力、交互效果、动画和 AI 工作流。",
    ...(isLocalBlueprintPilot() ? { robots: { follow: false, index: false } } : {}),
  };
}

const searchTerms = ["Glass", "Hover", "Loading", "Card", "Game UI", "Chat UI", "Color Picker", "Agent"];

export default function HomePage() {
  const allCapabilities = getCapabilities();
  const featured = allCapabilities.filter(({ previewStatus }) => previewStatus === "preview_ready");
  const latest = allCapabilities.slice(0, 6);
  const categories = getCapabilityCategories();

  return (
    <main className="capability-home" id="main-content" tabIndex={-1}>
      <section className="capability-home-hero">
        <div className="site-shell capability-home-hero-inner">
          <div className="capability-home-copy"><span className="capability-brand-line"><span className="brand-mark" aria-hidden="true">AD</span> AI Demo Marketplace</span><h1>Find the capability your next build needs.</h1><p>搜索一个效果，在线预览，了解实现，再把 Capability Package 复制到自己的项目。</p><form action="/explore" className="capability-home-search" method="get"><label className="sr-only" htmlFor="home-capability-search">Search capabilities</label><input id="home-capability-search" name="q" placeholder="Search Glass, Hover, Loading, Card…" type="search" /><button aria-label="Search capabilities" className="button button-primary" type="submit">Search <span aria-hidden="true">⌕</span></button></form><div className="capability-home-hot-searches"><span>Try searching</span>{searchTerms.map((term) => <Link href={`/explore?q=${encodeURIComponent(term)}`} key={term}>{term}</Link>)}</div></div>
          <div className="capability-home-visual" aria-label="Capability preview mosaic"><div className="home-orbit home-orbit-one" /><div className="home-orbit home-orbit-two" /><div className="home-preview-stack"><div className="home-preview-chip">PREVIEW / 001</div><div className="home-preview-card home-preview-card-main"><span>COLOR EXTRACTION</span><strong>#506F88</strong><small>image → palette → reuse</small><div className="home-palette"><i /><i /><i /></div></div><div className="home-preview-card home-preview-card-small"><span>GLASS SURFACE</span><strong>blur / opacity / radius</strong></div></div></div>
        </div>
      </section>

      <section className="capability-home-category-strip"><div className="site-shell"><div className="capability-home-section-label"><span className="eyebrow">Browse by need</span><h2>Start with what you need to build.</h2></div><div className="capability-home-category-grid">{categories.map((category, index) => <Link href={`/explore?category=${encodeURIComponent(category)}`} key={category}><span>0{index + 1}</span><strong>{category}</strong><small>Explore capabilities ↗</small></Link>)}</div></div></section>

      <section className="site-shell capability-home-section"><div className="capability-home-section-heading"><div><span className="eyebrow">Featured capabilities</span><h2>Ready to preview.</h2><p>可直接体验的自研前端能力原型。</p></div><Link className="text-link" href="/explore">View all capabilities ↗</Link></div><div className="capability-grid capability-grid-featured">{featured.map((capability) => <CapabilityCard capability={capability} key={capability.id} />)}</div></section>

      <section className="capability-home-section capability-home-muted"><div className="site-shell"><div className="capability-home-section-heading"><div><span className="eyebrow">Latest capabilities</span><h2>New in the workshop.</h2><p>先记录能力，再逐个完成 Preview 和 Package 交付。</p></div><span className="capability-truth-note">{allCapabilities.length} 个能力记录 · 状态透明</span></div><div className="capability-grid">{latest.map((capability) => <CapabilityCard capability={capability} key={capability.id} />)}</div></div></section>

      <section className="site-shell capability-home-section capability-popular-section"><div className="capability-empty capability-empty-inline"><span className="eyebrow">Popular</span><h2>真实热度尚未开放。</h2><p>没有真实浏览、收藏或购买数据之前，这里不会伪造排行榜。</p><Link className="text-link" href="/explore">Browse the shelf instead ↗</Link></div></section>

      <section className="site-shell capability-home-section capability-bundle-section"><div><span className="eyebrow">Coming next</span><h2>Build Packs</h2><p>当单个 Package 完成验证后，再把它们组合成 Apple UI、Game UI、AI Agent 和 Animation Packs。</p></div><div className="capability-bundle-list"><span>Apple UI Pack</span><span>Game UI Pack</span><span>AI Agent Pack</span><span>Animation Pack</span></div></section>

      <section className="site-shell capability-home-section capability-blueprint-footer"><div><span className="eyebrow">Advanced layer</span><h2>完整 App Blueprint，放在最后。</h2><p>ColorSnap Blueprint 保留为高级组合商品，用来展示一个 App 如何拆成多个可复用 Capability。</p></div>{isLocalBlueprintPilot() ? <Link className="button button-secondary" href="/blueprints">View App Blueprints ↗</Link> : <span className="capability-planned-label">Advanced products are being prepared</span>}</section>
    </main>
  );
}
