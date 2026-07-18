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
  ["Landing Page", "Landing Page"],
  ["Developer Tool", "React"],
] as const;

const stats = [
  ["120+", "Build Blocks"],
  ["35+", "Blueprints"],
  ["500+", "Developers"],
  ["200+", "Prompts"],
] as const;

function BlockShelf({
  label,
  title,
  description,
  capabilities,
  note,
}: {
  label: string;
  title: string;
  description: string;
  capabilities: ReturnType<typeof getCapabilities>;
  note?: string;
}) {
  return (
    <section className="site-shell marketplace-section" aria-labelledby={`${label.toLowerCase()}-blocks-title`}>
      <div className="marketplace-section-heading">
        <div>
          <span className="eyebrow">{label}</span>
          <h2 id={`${label.toLowerCase()}-blocks-title`}>{title}</h2>
          <p>{description}</p>
        </div>
        {note ? <span className="marketplace-section-note">{note}</span> : <Link className="marketplace-text-link" href="/explore">View all Build Blocks ↗</Link>}
      </div>
      <div className="capability-grid marketplace-block-grid">
        {capabilities.map((capability) => <CapabilityCard capability={capability} key={capability.id} />)}
      </div>
    </section>
  );
}

export default function HomePage() {
  const allCapabilities = getCapabilities();
  const featured = allCapabilities.filter(({ previewStatus }) => previewStatus === "preview_ready");
  const newest = allCapabilities.slice(0, 6);
  const free = allCapabilities.slice(2, 6);
  const popular = allCapabilities.filter((capability) => ["card-highlight", "glass-surface", "color-extraction", "image-cropper"].includes(capability.slug));

  return (
    <main className="marketplace-home" id="main-content" tabIndex={-1}>
      <section className="marketplace-hero-v2">
        <div className="site-shell marketplace-hero-v2-grid">
          <div className="marketplace-hero-v2-copy">
            <span className="capability-brand-line"><span className="brand-mark" aria-hidden="true">BB</span> AI Build Blocks Marketplace</span>
            <h1>Build AI products faster with reusable UI, prompts and code.</h1>
            <p className="marketplace-hero-lead">Browse practical building blocks with a live demo, source status, Cursor and Claude prompts, README, integration guide and license.</p>
            <form action="/explore" className="marketplace-search-form marketplace-hero-search" method="get">
              <label className="sr-only" htmlFor="home-capability-search">Search Build Blocks</label>
              <input id="home-capability-search" name="q" placeholder="Search Glass, Hover, Loading, Chat…" type="search" />
              <button className="button button-primary" type="submit">Browse Build Blocks <span aria-hidden="true">↗</span></button>
            </form>
            <div className="marketplace-popular-searches" aria-label="Popular searches"><span>Popular searches</span>{searchTerms.map((term) => <Link href={`/explore?q=${encodeURIComponent(term)}`} key={term}>{term}</Link>)}</div>
            <div className="hero-actions marketplace-hero-actions"><Link className="button button-secondary" href="/explore">Browse Build Blocks</Link><Link className="button button-ghost" href="/blueprints">Explore Blueprint</Link></div>
          </div>
          <div aria-label="Build Block preview" className="marketplace-hero-v2-visual">
            <div className="marketplace-hero-orbit marketplace-hero-orbit-one" />
            <div className="marketplace-hero-orbit marketplace-hero-orbit-two" />
            <div className="marketplace-hero-product-card">
              <div className="marketplace-hero-product-card-bar"><span>LIVE PREVIEW</span><span>BUILD BLOCK / 001</span></div>
              <div className="marketplace-hero-product-preview"><span>COLOR EXTRACTION</span><strong>#506F88</strong><small>image → palette → reuse</small><div className="home-palette"><i /><i /><i /></div></div>
              <div className="marketplace-hero-product-meta"><div><span className="marketplace-small-label">Includes</span><strong>Source · Prompt · Guide</strong></div><span className="marketplace-score-pill">MOCK <b>$9</b></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="marketplace-signal-strip" aria-label="Marketplace snapshot"><div className="site-shell marketplace-signal-grid">{stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><p className="site-shell marketplace-data-note">Editorial snapshot · mock figures for the launch preview, not live usage data.</p></section>

      <section className="site-shell marketplace-section marketplace-category-band" aria-labelledby="category-title">
        <div className="marketplace-section-heading"><div><span className="eyebrow">Browse by need</span><h2 id="category-title">Find the block your build needs.</h2><p>按开发者正在搜索的能力分类，而不是按行业浏览。</p></div></div>
        <div className="marketplace-category-grid">{categories.map(([label, query], index) => <Link className="marketplace-category-card" href={`/explore?q=${encodeURIComponent(query)}`} key={label}><span className="marketplace-category-number">0{index + 1}</span><strong>{label}</strong><span>Build Blocks ↗</span></Link>)}</div>
      </section>

      <BlockShelf description="Editor-selected modules with a live preview you can test before you reuse." label="Featured" title="Featured Build Blocks" capabilities={featured} note="Self-owned previews" />
      <BlockShelf description="The newest modules entering the catalog. Status stays visible while each package is verified." label="Newest" title="Newest Build Blocks" capabilities={newest} />
      <BlockShelf description="Start with free-to-preview modules, then decide whether the package fits your stack." label="Free" title="Free previews" capabilities={free} note="Preview is free · package checkout is not connected" />
      <BlockShelf description="A small editorial selection of useful primitives, not a fake popularity ranking." label="Popular" title="Popular picks" capabilities={popular} note="Editorial picks · no live ranking" />

      <section className="site-shell marketplace-section marketplace-why" aria-labelledby="why-build-blocks-title"><div className="marketplace-section-heading"><div><span className="eyebrow">Why Build Blocks?</span><h2 id="why-build-blocks-title">Ship the useful part sooner.</h2></div></div><div className="marketplace-why-grid"><article><span>01</span><h3>Build Faster</h3><p>Reuse battle-tested interactions instead of rebuilding the same surface from scratch.</p></article><article><span>02</span><h3>Learn by shipping</h3><p>See a real implementation, its parameters and its trade-offs before it reaches your codebase.</p></article><article><span>03</span><h3>AI Ready</h3><p>Prompt and code stay together so your AI coding tool can help you adapt the block.</p></article></div></section>

      <section className="site-shell marketplace-section marketplace-bundle-callout"><div><span className="eyebrow">Bundle</span><h2>Compose a complete interface from smaller blocks.</h2><p>Apple UI, Game UI, AI Agent and Animation bundles are planned at a mock $29 launch price. No checkout is connected yet.</p></div><Link className="button button-secondary" href="/bundles">Explore Bundles ↗</Link></section>

      <section className="site-shell marketplace-section marketplace-blueprint-callout"><div><span className="eyebrow">Advanced product</span><h2>Need the whole product plan?</h2><p>Blueprints remain the high-level layer: a complete product direction assembled from reusable Build Blocks. ColorSnap lives here, not at the center of the catalog.</p></div><Link className="button button-secondary" href="/blueprints">Explore Blueprints ↗</Link></section>
    </main>
  );
}
