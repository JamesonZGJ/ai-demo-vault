import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CapabilityCard } from "../../../../components/capabilities/capability-card";
import { CapabilityPreview } from "../../../../components/capabilities/capability-preview";
import { getCapabilities, getCapabilityBySlug } from "../../../../lib/capabilities/catalog";

export async function generateStaticParams() {
  return getCapabilities().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const capability = getCapabilityBySlug((await params).slug);
  if (!capability) return { title: "Build Block not found" };
  const displayName = capability.displayNameZh ?? capability.name;
  return {
    alternates: { canonical: `/explore/${capability.slug}` },
    description: capability.description,
    openGraph: { description: capability.description, title: `${displayName} · AI Build Blocks Marketplace`, type: "article" },
    title: displayName,
  };
}

export default async function CapabilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const capability = getCapabilityBySlug((await params).slug);
  if (!capability) notFound();
  const packageReady = capability.packageStatus === "ready_for_checkout";
  const related = getCapabilities().filter((item) => item.slug !== capability.slug && (item.category === capability.category || item.tags.some((tag) => capability.tags.includes(tag)))).slice(0, 3);
  const previewPrice = capability.priceDisplay?.split(" · ")[0] ?? "Preview price";

  return (
    <main className="capability-detail-page marketplace-detail-page" id="main-content" tabIndex={-1}>
      <div className="site-shell">
        <nav aria-label="Breadcrumb" className="capability-breadcrumb"><Link href="/">Marketplace</Link><span>/</span><Link href="/explore">Build Blocks</Link><span>/</span><span aria-current="page">{capability.displayNameZh ?? capability.name}</span></nav>

        <section className="marketplace-product-hero" aria-labelledby="product-title">
          <div className="marketplace-product-preview-column"><div className="marketplace-live-label"><span className={capability.previewStatus === "preview_ready" ? "is-ready" : ""} />{capability.previewStatus === "preview_ready" ? "Live Demo" : "Preview planned"}<span>·</span>{capability.category}</div><CapabilityPreview slug={capability.slug} /></div>
          <aside className="marketplace-purchase-panel"><div className="capability-detail-kicker"><span>BUILD BLOCK</span><span>{capability.difficulty}</span><span>{capability.mode}</span></div>{capability.series ? <p className="eyebrow">{capability.series.nameZh} · 第{String(capability.series.episode).padStart(3, "0")}期</p> : null}<h1 id="product-title">{capability.displayNameZh ?? capability.name}</h1><p className="capability-detail-summary">{capability.summary}</p><p className="marketplace-product-description">{capability.description}</p><div className="marketplace-price-row"><strong>{previewPrice}</strong><span>Preview price · checkout coming soon</span></div><div className="marketplace-included"><strong>Package includes</strong><ul>{capability.packageAssets.map((asset) => <li className={`is-${asset.status}`} key={asset.label}><span aria-hidden="true">{asset.status === "ready" ? "✓" : "○"}</span><span>{asset.label}</span><small>{asset.status === "ready" ? "Ready" : "Coming soon"}</small></li>)}</ul></div><button className="button button-primary marketplace-get-block" disabled title="Checkout will be connected in a later release" type="button">Get Block</button><p className="marketplace-truth-note">{packageReady ? "自研 Package 已在本地预览中验证。当前未创建订单、支付或下载。" : "当前仅提供在线 Preview，计划中的资产不会被标记为已交付。"}</p></aside>
        </section>

        <section className="marketplace-detail-overview" aria-label="Build Block overview"><article><span className="eyebrow">Use cases</span><h2>Where it fits</h2><div className="capability-use-cases">{capability.useCases.map((useCase) => <span key={useCase}>{useCase}</span>)}</div></article><article><span className="eyebrow">Problem solved</span><h2>Why this exists</h2><p>{capability.problem}</p></article><article><span className="eyebrow">Tech stack</span><h2>Built with</h2><div className="capability-use-cases">{capability.stack.map((item) => <span key={item}>{item}</span>)}</div></article></section>

        <section className="capability-package-section marketplace-package-section" id="package"><div className="capability-package-heading"><div><span className="eyebrow">Integration Guide</span><h2>From preview to your project.</h2><p>Review the contract, adapt the prompts, and integrate the source when the package is ready.</p></div><div className={`capability-package-state ${packageReady ? "is-ready" : ""}`}><strong>{packageReady ? "Source package ready" : "Preview only"}</strong><span>{packageReady ? "Checkout and download remain closed" : "No purchase or download yet"}</span></div></div><div className="marketplace-integration-steps"><article><span>01</span><strong>Preview</strong><p>Confirm the output and interaction in the live demo.</p></article><article><span>02</span><strong>Inspect</strong><p>Review parameters, stack, license notes and asset status.</p></article><article><span>03</span><strong>Reuse</strong><p>Copy the package into your own project after checkout opens.</p></article></div><div className="capability-assets-grid">{capability.packageAssets.map((asset) => <article key={asset.label}><span className={`asset-status asset-status-${asset.status}`}>{asset.status === "ready" ? "Ready" : asset.status === "planned" ? "Coming soon" : "Not available"}</span><h3>{asset.label}</h3><p>{asset.note}</p></article>)}</div></section>

        {related.length ? <section className="marketplace-related-section" aria-labelledby="related-title"><div className="marketplace-section-heading"><div><span className="eyebrow">You may also like</span><h2 id="related-title">More Build Blocks for this direction.</h2></div><Link className="marketplace-text-link" href="/explore">Browse all ↗</Link></div><div className="capability-grid">{related.map((item) => <CapabilityCard capability={item} key={item.id} />)}</div></section> : null}
      </div>
    </main>
  );
}
