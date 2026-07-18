import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CapabilityPreview } from "../../../../components/capabilities/capability-preview";
import { getCapabilities, getCapabilityBySlug } from "../../../../lib/capabilities/catalog";

export async function generateStaticParams() {
  return getCapabilities().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const capability = getCapabilityBySlug((await params).slug);
  if (!capability) return { title: "Capability not found" };
  return { alternates: { canonical: `/explore/${capability.slug}` }, description: capability.description, openGraph: { description: capability.description, title: `${capability.name} · AI Demo Marketplace`, type: "article" }, title: capability.name };
}

export default async function CapabilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const capability = getCapabilityBySlug((await params).slug);
  if (!capability) notFound();
  const packageReady = capability.packageStatus === "ready_for_checkout";
  return (
    <main className="capability-detail-page" id="main-content" tabIndex={-1}>
      <div className="site-shell">
        <nav aria-label="Breadcrumb" className="capability-breadcrumb"><Link href="/">Marketplace</Link><span>/</span><Link href="/explore">Explore</Link><span>/</span><span aria-current="page">{capability.name}</span></nav>
        <header className="capability-detail-hero"><div className="capability-detail-copy"><div className="capability-detail-kicker"><span>{capability.category}</span><span>{capability.mode}</span><span>{capability.difficulty}</span></div><h1>{capability.name}</h1><p className="capability-detail-summary">{capability.summary}</p><p>{capability.description}</p><div className="capability-detail-actions"><a className="button button-primary" href="#package">{packageReady ? "View Package Assets" : "Preview capability"}</a><Link className="button button-ghost" href="/explore">Back to capabilities</Link></div></div><CapabilityPreview slug={capability.slug} /></header>

        <section className="capability-detail-grid" aria-label="Capability overview">
          <article><span className="eyebrow">The problem</span><h2>Why this exists</h2><p>{capability.problem}</p></article>
          <article><span className="eyebrow">Reuse</span><h2>Where it fits</h2><div className="capability-use-cases">{capability.useCases.map((useCase) => <span key={useCase}>{useCase}</span>)}</div></article>
          <article><span className="eyebrow">Stack</span><h2>Built with</h2><div className="capability-use-cases">{capability.stack.map((item) => <span key={item}>{item}</span>)}</div></article>
        </section>

        <section className="capability-package-section" id="package"><div className="capability-package-heading"><div><span className="eyebrow">Capability Package</span><h2>Everything needed to reuse the capability.</h2><p>Package 状态和资产状态只显示已验证事实。{capability.priceDisplay ? ` ${capability.priceDisplay}` : "价格策略待定。"}</p></div><div className={`capability-package-state ${packageReady ? "is-ready" : ""}`}><strong>{packageReady ? "Assets ready" : "Preview only"}</strong><span>{packageReady ? "Payment and download are not connected" : "No purchase or download yet"}</span></div></div><div className="capability-assets-grid">{capability.packageAssets.map((asset) => <article key={asset.label}><span className={`asset-status asset-status-${asset.status}`}>{asset.status === "ready" ? "Ready" : asset.status === "planned" ? "Planned" : "Not available"}</span><h3>{asset.label}</h3><p>{asset.note}</p></article>)}</div><div className="capability-package-notice" role="note"><strong>{packageReady ? "Launch edition" : "Preview edition"}</strong><span>{packageReady ? "这组自研资产已在仓库中验证，但当前没有支付、订单或下载入口。" : "这个 Package 还没有公开支付、下载或购买成功状态。"}</span></div></section>

        <section className="capability-integration-section"><div><span className="eyebrow">Integration Guide</span><h2>从 Preview 到自己的项目</h2></div><ol><li><strong>Confirm the output</strong><span>先在上方 Demo Preview 中确认结果和交互。</span></li><li><strong>Check the contract</strong><span>确认输入、输出、依赖、参数和浏览器边界。</span></li><li><strong>Copy the capability</strong><span>Package 发布后，通过源码、Prompt 和 README 接入。</span></li></ol></section>
      </div>
    </main>
  );
}
