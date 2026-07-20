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

const searchTerms = ["Glass", "Hero", "Chat", "Prompt", "Animation", "Image Upload", "Ticket", "Color Picker"];
const categories = [
  ["UI", "UI Interaction"],
  ["Animation", "Motion & Animation"],
  ["AI", "AI"],
  ["Image", "Image & Vision"],
  ["Game", "Game UI"],
  ["Prompt", "Prompt"],
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
        <Link className="marketplace-text-link" href="/explore">View all Build Blocks ↗</Link>
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
            <span className="capability-brand-line"><span className="brand-mark" aria-hidden="true">BB</span> AI Build Blocks Marketplace</span>
            <h1>Build faster with reusable UI, prompts and code.</h1>
            <p className="marketplace-hero-lead">Preview a working interaction, then adapt the block to your own product with the source, prompts and integration notes.</p>
            <form action="/explore" className="marketplace-search-form marketplace-hero-search" method="get">
              <label className="sr-only" htmlFor="home-capability-search">Search Build Blocks</label>
              <input id="home-capability-search" name="q" placeholder="Search Glass, Hover, Chat…" type="search" />
              <button className="button button-primary" type="submit">Search Build Blocks <span aria-hidden="true">↗</span></button>
            </form>
            <div className="marketplace-popular-searches" aria-label="Popular searches"><span>Popular searches</span>{searchTerms.map((term) => <Link href={`/explore?q=${encodeURIComponent(term)}`} key={term}>{term}</Link>)}</div>
          </div>
          <div aria-label="Build Block preview" className="marketplace-hero-v2-visual">
            <div className="marketplace-hero-orbit marketplace-hero-orbit-one" />
            <div className="marketplace-hero-orbit marketplace-hero-orbit-two" />
            <div className="marketplace-hero-product-card">
              <div className="marketplace-hero-product-card-bar"><span>LIVE PREVIEW</span><span>BUILD BLOCK / 001</span></div>
              <div className="marketplace-hero-product-preview marketplace-hero-product-preview-glass"><span>玻璃拟态卡片</span><strong>可复用的界面表面。</strong><small>模糊 · 透明度 · 圆角</small><div className="hero-glass-sample"><i /><i /><i /></div></div>
              <div className="marketplace-hero-product-meta"><div><span className="marketplace-small-label">Package</span><strong>源码 · Prompt · 接入说明</strong></div><span className="marketplace-score-pill">PREVIEW <b>¥4</b></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell marketplace-section marketplace-category-band" aria-labelledby="category-title">
        <div className="marketplace-section-heading"><div><span className="eyebrow">Browse by need</span><h2 id="category-title">Search by the thing you need to build.</h2></div></div>
        <div className="marketplace-category-grid">{categories.map(([label, query], index) => <Link className="marketplace-category-card" href={`/explore?q=${encodeURIComponent(query)}`} key={label}><span className="marketplace-category-number">0{index + 1}</span><strong>{label}</strong><span>Explore ↗</span></Link>)}</div>
      </section>

      <BlockShelf description="Working modules you can preview before you reuse them." label="Featured" title="Featured Build Blocks" capabilities={featured} />
      <BlockShelf description="Newly documented modules, with their implementation status kept visible." label="New" title="New Build Blocks" capabilities={newest} />

      <section className="site-shell marketplace-next-layer" aria-labelledby="next-layer-title"><div><span className="eyebrow">When one block is not enough</span><h2 id="next-layer-title">Choose the right starting point.</h2><p>Build Blocks are individual modules. Bundles group related modules. Blueprints map a complete product.</p></div><div className="marketplace-next-layer-links"><Link href="/bundles"><strong>Bundles</strong><span>Group a useful set ↗</span></Link><Link href="/blueprints"><strong>Blueprints</strong><span>See the whole product ↗</span></Link></div></section>
    </main>
  );
}
