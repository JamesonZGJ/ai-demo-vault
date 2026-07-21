import type { Metadata } from "next";
import Link from "next/link";

import { CapabilityCard } from "../../components/capabilities/capability-card";
import { getCapabilities } from "../../lib/capabilities/catalog";
import { isLocalBlueprintPilot } from "../../lib/env";

export function generateMetadata(): Metadata {
  return {
    description: "Browse reusable AI product building blocks with live demos, source status, prompts and integration guides.",
    ...(isLocalBlueprintPilot() ? { robots: { follow: false, index: false } } : {}),
  };
}

const searchTerms = [["玻璃", "Glass"], ["首页首屏", "Hero"], ["聊天", "Chat"], ["提示词", "Prompt"], ["动画", "Animation"], ["图片上传", "Image Upload"], ["票根", "Ticket"], ["图片取色", "Color Picker"]] as const;
const categories = [
  ["界面", "UI Interaction"],
  ["动画", "Motion & Animation"],
  ["AI 工作流", "AI Workflow"],
  ["图片", "Image & Vision"],
  ["游戏界面", "Game UI"],
  ["提示词", "Prompt"],
] as const;

function BlockShelf({
  label,
  title,
  description,
  capabilities,
}: {
  label: string;
  title: string;
  description: string;
  capabilities: ReturnType<typeof getCapabilities>;
}) {
  return (
    <section className="site-shell marketplace-section" aria-labelledby={`${label.toLowerCase()}-blocks-title`}>
      <div className="marketplace-section-heading">
        <div>
          <span className="eyebrow">{label}</span>
          <h2 id={`${label.toLowerCase()}-blocks-title`}>{title}</h2>
          <p>{description}</p>
        </div>
        <Link className="marketplace-text-link" href="/explore">查看全部能力模块 ↗</Link>
      </div>
      <div className="capability-grid marketplace-block-grid">
        {capabilities.map((capability) => <CapabilityCard capability={capability} key={capability.id} />)}
      </div>
    </section>
  );
}

export default function HomePage() {
  const allCapabilities = getCapabilities();
  const featured = allCapabilities.filter(({ previewStatus }) => previewStatus === "preview_ready").slice(0, 3);
  const featuredIds = new Set(featured.map(({ id }) => id));
  const newest = allCapabilities.filter(({ id }) => !featuredIds.has(id)).slice(0, 3);

  return (
    <main className="marketplace-home" id="main-content" tabIndex={-1}>
      <section className="marketplace-hero-v2">
        <div className="site-shell marketplace-hero-v2-grid">
          <div className="marketplace-hero-v2-copy">
            <span className="capability-brand-line"><span className="brand-mark" aria-hidden="true">BB</span> AI 能力模块库</span>
            <h1>用可复用的界面、提示词和代码，更快做出 AI 产品。</h1>
            <p className="marketplace-hero-lead">先在线预览一个真实效果，再查看它的实现思路、提示词、源码状态和接入说明。</p>
            <form action="/explore" className="marketplace-search-form marketplace-hero-search" method="get">
              <label className="sr-only" htmlFor="home-capability-search">搜索能力模块</label>
              <input id="home-capability-search" name="q" placeholder="搜索玻璃、悬停、聊天、提示词…" type="search" />
              <button className="button button-primary" type="submit">搜索模块 <span aria-hidden="true">↗</span></button>
            </form>
            <div className="marketplace-popular-searches" aria-label="热门搜索"><span>热门搜索</span>{searchTerms.map(([label, term]) => <Link href={`/explore?q=${encodeURIComponent(term)}`} key={term}>{label}</Link>)}</div>
          </div>
          <div aria-label="Build Block preview" className="marketplace-hero-v2-visual">
            <div className="marketplace-hero-orbit marketplace-hero-orbit-one" />
            <div className="marketplace-hero-orbit marketplace-hero-orbit-two" />
            <div className="marketplace-hero-product-card">
            <div className="marketplace-hero-product-card-bar"><span>在线预览</span><span>能力模块 / 001</span></div>
              <div className="marketplace-hero-product-preview marketplace-hero-product-preview-glass"><span>玻璃拟态卡片</span><strong>可复用的界面表面。</strong><small>模糊 · 透明度 · 圆角</small><div className="hero-glass-sample"><i /><i /><i /></div></div>
              <div className="marketplace-hero-product-meta"><div><span className="marketplace-small-label">包含内容</span><strong>源码 · 提示词 · 接入说明</strong></div><span className="marketplace-score-pill">展示价 <b>¥4</b></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell marketplace-section marketplace-category-band" aria-labelledby="category-title">
        <div className="marketplace-section-heading"><div><span className="eyebrow">按需求查找</span><h2 id="category-title">你现在想做什么？</h2></div></div>
        <div className="marketplace-category-grid">{categories.map(([label, query], index) => <Link className="marketplace-category-card" href={`/explore?q=${encodeURIComponent(query)}`} key={label}><span className="marketplace-category-number">0{index + 1}</span><strong>{label}</strong><span>查看模块 ↗</span></Link>)}</div>
      </section>

      <BlockShelf description="先看效果，再决定是否复用。" label="精选" title="精选能力模块" capabilities={featured} />
      <BlockShelf description="持续补充的新模块，状态和完成度都会明确标注。" label="最新" title="最新能力模块" capabilities={newest} />

      <section className="site-shell marketplace-next-layer" aria-labelledby="next-layer-title"><div><span className="eyebrow">需要更完整的方案？</span><h2 id="next-layer-title">按你的目标选择入口。</h2><p>能力模块适合单独复用，组合包把相关模块放在一起，产品蓝图则梳理完整产品结构。</p></div><div className="marketplace-next-layer-links"><Link href="/bundles"><strong>组合包</strong><span>组合一组相关模块 ↗</span></Link><Link href="/blueprints"><strong>产品蓝图</strong><span>查看完整产品拆解 ↗</span></Link></div></section>
    </main>
  );
}
