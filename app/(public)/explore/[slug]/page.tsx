import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CapabilityCard } from "../../../../components/capabilities/capability-card";
import { CapabilityPreview } from "../../../../components/capabilities/capability-preview";
import { SourceMaterialPanel } from "../../../../components/capabilities/source-material-panel";
import { difficultyLabels, getCapabilities, getCapabilityAccessLabel, getCapabilityBySlug, modeLabels } from "../../../../lib/capabilities/catalog";
import { getMarketplaceCategoryId, getMarketplaceCategoryLabel } from "../../../../lib/capabilities/marketplace-taxonomy";
import { getCapabilityMaterials } from "../../../../lib/capabilities/package-materials";

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
    openGraph: { description: capability.description, title: `${displayName} · AI Demo Vault`, type: "article" },
    title: displayName,
  };
}

export default async function CapabilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const capability = getCapabilityBySlug((await params).slug);
  if (!capability) notFound();

  const materials = await getCapabilityMaterials(capability.slug);
  const packageReady = capability.packageStatus === "ready_for_checkout";
  const displayName = capability.displayNameZh ?? capability.name;
  const accessLabel = getCapabilityAccessLabel(capability);
  const categoryLabel = getMarketplaceCategoryLabel(capability);
  const related = getCapabilities()
    .filter((item) => item.slug !== capability.slug && (getMarketplaceCategoryLabel(item) === categoryLabel || item.tags.some((tag) => capability.tags.includes(tag))))
    .slice(0, 4);

  return (
    <main className="vault-detail-page" id="main-content" tabIndex={-1}>
      <div className="vault-wide-shell">
        <nav aria-label="面包屑导航" className="vault-breadcrumb"><Link href="/explore">所有模块</Link><span>/</span><Link href={`/explore?category=${getMarketplaceCategoryId(capability)}`}>{categoryLabel}</Link><span>/</span><span aria-current="page">{displayName}</span></nav>

        <header className="vault-detail-header">
          <div>
            <div className="vault-detail-tags"><span>{categoryLabel}</span><span>{difficultyLabels[capability.difficulty]}</span><span>{modeLabels[capability.mode]}</span>{capability.series ? <span>第 {String(capability.series.episode).padStart(3, "0")} 期</span> : null}</div>
            <h1>{displayName}</h1>
            <p><strong>{capability.name}</strong>{capability.summary}</p>
            <div className="vault-detail-byline"><span aria-hidden="true">DV</span><strong>AI 拆解局</strong><small>自研实现</small></div>
          </div>
          <div className="vault-detail-actions"><button disabled title="收藏功能暂未开放" type="button">♡ 收藏</button><a href="#preview">在线预览</a>{materials.length ? <a className="is-primary" href="#materials">查看源码与接入说明</a> : <a className="is-primary" href="#preview">查看在线预览</a>}</div>
        </header>

        <section className="vault-detail-workbench" id="preview" aria-label="模块预览与真实资料">
          <div className="vault-preview-workspace">
            <div className="vault-workbench-bar"><div><i /><i /><i /></div><span><b className={capability.previewStatus === "preview_ready" ? "is-ready" : ""} />{capability.previewStatus === "preview_ready" ? "Live Preview" : "Preview Planned"}</span><small>{capability.slug}</small></div>
            <div className="vault-workbench-preview"><CapabilityPreview slug={capability.slug} /></div>
          </div>
          <SourceMaterialPanel materials={materials} />
        </section>

        <section className="vault-detail-facts" aria-label="模块状态">
          <div><span>技术栈</span><strong>{capability.stack.join(" · ")}</strong></div>
          <div><span>源码</span><strong>{materials.some(({ id }) => id === "source") ? "自研源码已验证" : "当前未提供"}</strong></div>
          <div><span>Prompt</span><strong>{materials.some(({ id }) => id === "cursor" || id === "claude") ? "真实文件已准备" : "当前未提供"}</strong></div>
          <div><span>开放状态</span><strong>{packageReady ? `${accessLabel} · 无需支付` : accessLabel}</strong></div>
        </section>

        <section className="vault-detail-information">
          <div className="vault-detail-main-copy">
            <article><span>用途</span><h2>这个模块解决什么问题？</h2><p>{capability.problem}</p></article>
            <article><span>使用场景</span><h2>适合放进哪些产品？</h2><div className="vault-detail-chip-list">{capability.useCases.map((item) => <span key={item}>{item}</span>)}</div></article>
            <article><span>Integration</span><h2>接入顺序</h2><ol><li><b>01</b><div><strong>先在工作台确认效果</strong><p>操作上方真实 Demo，确认状态和交互符合产品需要。</p></div></li><li><b>02</b><div><strong>检查源码与依赖</strong><p>只有真实存在的源码、Prompt 和参数文件才会出现在代码面板。</p></div></li><li><b>03</b><div><strong>按接入指南迁移</strong><p>保留许可证，并根据自己的设计系统调整参数和样式。</p></div></li></ol></article>
          </div>
          <aside className="vault-package-sidebar">
            <div><span>PACKAGE STATUS</span><strong>{packageReady ? "资料已准备" : "仅提供在线预览"}</strong><p>{packageReady ? "当前资料免费公开，无需支付。" : "计划内容不会被标记为已交付。"}</p></div>
            <ul>{capability.packageAssets.map((asset) => <li key={asset.label}><span>{asset.status === "ready" ? "✓" : "○"}</span><div><strong>{asset.label}</strong><small>{asset.status === "ready" ? "已准备" : asset.status === "planned" ? "准备中" : "暂不可用"}</small></div></li>)}</ul>
            <div className="vault-license-note"><span>LICENSE & SOURCE</span><p>本站只交付自研实现。参考第三方产品时保留来源和许可证记录，不销售未经授权的代码。</p></div>
          </aside>
        </section>

        {related.length ? <section className="vault-related-blocks" aria-labelledby="related-title"><div className="vault-gallery-heading"><div><span>KEEP BROWSING</span><h2 id="related-title">你可能还需要</h2></div><Link href="/explore">浏览全部 →</Link></div><div className="vault-block-grid">{related.map((item) => <CapabilityCard capability={item} key={item.id} />)}</div></section> : null}
      </div>
    </main>
  );
}
