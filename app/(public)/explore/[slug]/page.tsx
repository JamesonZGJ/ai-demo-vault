import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CapabilityCard } from "../../../../components/capabilities/capability-card";
import { CapabilityPreview } from "../../../../components/capabilities/capability-preview";
import { difficultyLabels, getCapabilities, getCapabilityBySlug, getCategoryLabel, modeLabels } from "../../../../lib/capabilities/catalog";

export async function generateStaticParams() {
  return getCapabilities().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const capability = getCapabilityBySlug((await params).slug);
  if (!capability) return { title: "没有找到这个能力模块" };
  const displayName = capability.displayNameZh ?? capability.name;
  return {
    alternates: { canonical: `/explore/${capability.slug}` },
    description: capability.description,
    openGraph: { description: capability.description, title: `${displayName} · AI 能力模块库`, type: "article" },
    title: displayName,
  };
}

export default async function CapabilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const capability = getCapabilityBySlug((await params).slug);
  if (!capability) notFound();
  const packageReady = capability.packageStatus === "ready_for_checkout";
  const related = getCapabilities().filter((item) => item.slug !== capability.slug && (item.category === capability.category || item.tags.some((tag) => capability.tags.includes(tag)))).slice(0, 3);
  const previewPrice = capability.priceDisplay?.split(" · ")[0] ?? "展示价格";

  return (
    <main className="capability-detail-page marketplace-detail-page" id="main-content" tabIndex={-1}>
      <div className="site-shell">
        <nav aria-label="面包屑导航" className="capability-breadcrumb"><Link href="/">能力模块库</Link><span>/</span><Link href="/explore">可复用模块</Link><span>/</span><span aria-current="page">{capability.displayNameZh ?? capability.name}</span></nav>

        <section className="marketplace-product-hero" aria-labelledby="product-title">
          <div className="marketplace-product-preview-column"><div className="marketplace-live-label"><span className={capability.previewStatus === "preview_ready" ? "is-ready" : ""} />{capability.previewStatus === "preview_ready" ? "在线预览" : "预览准备中"}<span>·</span>{capability.categoryZh ?? getCategoryLabel(capability.category)}</div><CapabilityPreview slug={capability.slug} /></div>
          <aside className="marketplace-purchase-panel"><div className="capability-detail-kicker"><span>可复用模块</span><span>{difficultyLabels[capability.difficulty]}</span><span>{modeLabels[capability.mode]}</span></div>{capability.series ? <p className="eyebrow">{capability.series.nameZh} · 第{String(capability.series.episode).padStart(3, "0")}期</p> : null}<h1 id="product-title">{capability.displayNameZh ?? capability.name}</h1><p className="capability-detail-summary">{capability.summary}</p><p className="marketplace-product-description">{capability.description}</p><div className="marketplace-price-row"><strong>{previewPrice}</strong><span>展示价格 · 暂未开放购买</span></div><div className="marketplace-included"><strong>包含内容</strong><ul>{capability.packageAssets.map((asset) => <li className={`is-${asset.status}`} key={asset.label}><span aria-hidden="true">{asset.status === "ready" ? "✓" : "○"}</span><span>{asset.label}</span><small>{asset.status === "ready" ? "已准备" : "准备中"}</small></li>)}</ul></div><button className="button button-primary marketplace-get-block" disabled title="购买功能将在后续版本开放" type="button">暂未开放购买</button><p className="marketplace-truth-note">{packageReady ? "自研模块已在本地预览中验证。当前未创建订单、支付或下载。" : "当前仅提供在线预览，计划中的内容不会被标记为已交付。"}</p></aside>
        </section>

        <section className="marketplace-detail-overview" aria-label="能力模块概览"><article><span className="eyebrow">适用场景</span><h2>可以放在哪里？</h2><div className="capability-use-cases">{capability.useCases.map((useCase) => <span key={useCase}>{useCase}</span>)}</div></article><article><span className="eyebrow">解决的问题</span><h2>为什么需要它？</h2><p>{capability.problem}</p></article><article><span className="eyebrow">技术栈</span><h2>使用什么构建？</h2><div className="capability-use-cases">{capability.stack.map((item) => <span key={item}>{item}</span>)}</div></article></section>

        <section className="capability-package-section marketplace-package-section" id="package"><div className="capability-package-heading"><div><span className="eyebrow">接入指南</span><h2>从预览到接入项目。</h2><p>先确认效果，再查看参数、提示词、许可证和当前资产状态。</p></div><div className={`capability-package-state ${packageReady ? "is-ready" : ""}`}><strong>{packageReady ? "自研资料已准备" : "仅提供预览"}</strong><span>{packageReady ? "购买和下载仍未开放" : "当前没有购买或下载"}</span></div></div><div className="marketplace-integration-steps"><article><span>01</span><strong>预览</strong><p>在在线预览中确认效果和交互。</p></article><article><span>02</span><strong>查看</strong><p>了解参数、技术栈、许可证和资产状态。</p></article><article><span>03</span><strong>复用</strong><p>后续开放购买后，再接入自己的项目。</p></article></div><div className="capability-assets-grid">{capability.packageAssets.map((asset) => <article key={asset.label}><span className={`asset-status asset-status-${asset.status}`}>{asset.status === "ready" ? "已准备" : asset.status === "planned" ? "准备中" : "暂不可用"}</span><h3>{asset.label}</h3><p>{asset.note}</p></article>)}</div></section>

        {related.length ? <section className="marketplace-related-section" aria-labelledby="related-title"><div className="marketplace-section-heading"><div><span className="eyebrow">你可能还需要</span><h2 id="related-title">同方向的其他能力模块。</h2></div><Link className="marketplace-text-link" href="/explore">查看全部 ↗</Link></div><div className="capability-grid">{related.map((item) => <CapabilityCard capability={item} key={item.id} />)}</div></section> : null}
      </div>
    </main>
  );
}
