import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlueprintScore } from "../../../../components/blueprint/blueprint-score";
import { BuildTimeline } from "../../../../components/blueprint/build-timeline";
import { ColorSnapProductPreview } from "../../../../components/blueprint/colorsnap-product-preview";
import { getBlueprintBySlug } from "../../../../lib/blueprints/catalog";
import type { BlueprintProduct } from "../../../../lib/blueprints/types";
import { isLocalBlueprintPilot } from "../../../../lib/env";

interface BlueprintPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlueprintPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getBlueprintBySlug(slug);
  return {
    description: product?.summary ?? "Blueprint 不存在或尚未开放。",
    robots: { follow: false, index: false },
    title: product?.name ?? "没有找到这个 Blueprint",
  };
}

function BoundaryList({ items, title }: { items: string[]; title: string }) {
  return <article><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

const userProfiles = [
  { label: "The visual builder", title: "设计师与创作者", body: "想把灵感、色彩和作品整理成一个可复用的产品体验。" },
  { label: "The product explorer", title: "独立开发者", body: "需要一个范围清晰、能在几天内验证的第一版方向。" },
  { label: "The signal seeker", title: "创业与产品团队", body: "想判断一个小众工具是否值得投入更多 AI、社区或商业化。" },
];

const launchModules = [
  { icon: "✓", title: "PRD", detail: "反向 PRD v0.1 · sample ready", status: "Sample ready", tone: "ready" },
  { icon: "✓", title: "Prompt", detail: "视觉理解、命名与配色 Prompt", status: "Sample ready", tone: "ready" },
  { icon: "✓", title: "UI", detail: "卡包、取色、色卡与分享状态", status: "Sample ready", tone: "ready" },
  { icon: "→", title: "Code", detail: "组件拆分与实现顺序，非源码下载", status: "Build plan", tone: "plan" },
  { icon: "→", title: "Database", detail: "数据表、权限与隐私改造路线", status: "Tech sample", tone: "plan" },
  { icon: "→", title: "Deploy Guide", detail: "从单页原型到预览环境的步骤", status: "Tech sample", tone: "plan" },
  { icon: "✓", title: "Marketing Kit", detail: "一句话、受众、内容与验证指标", status: "Sample ready", tone: "ready" },
  { icon: "→", title: "Launch Checklist", detail: "首批用户验证、指标与止损线", status: "Launch plan", tone: "plan" },
];

export default async function BlueprintDetailPage({ params }: BlueprintPageProps) {
  if (!isLocalBlueprintPilot()) notFound();
  const { slug } = await params;
  const product = await getBlueprintBySlug(slug);
  if (!product) notFound();
  const actionHref = "#whats-included";
  const deliverable = (kind: BlueprintProduct["deliverables"][number]["kind"]) => product.deliverables.find((item) => item.kind === kind);
  const decisionSections = [
    { label: "Product Overview", title: "产品概览", body: product.productSections.productOverview },
    { label: "Target Users", title: "目标用户", body: product.productSections.targetUsers },
    { label: "Problem", title: "用户问题", body: product.productSections.problem },
    { label: "Solution", title: "解决方案", body: product.productSections.solution },
    { label: "Feature Map", title: "功能地图", body: product.productSections.featureMap },
    { label: "User Flow", title: "用户流程", body: product.productSections.userFlow },
    { label: "UI Screens", title: "UI 页面", body: product.productSections.uiScreens },
    { label: "PRD", title: "产品需求文档", body: deliverable("prd")?.summary ?? "当前未提供" },
    { label: "Tech Stack", title: "技术栈与技术方案", body: deliverable("technical_plan")?.summary ?? "当前未提供" },
    { label: "Prompt Templates", title: "Prompt 模板", body: deliverable("prompts")?.summary ?? "当前未提供" },
    { label: "Monetization Model", title: "商业模式", body: deliverable("business_model")?.summary ?? "当前未提供" },
    { label: "Marketing Strategy", title: "营销策略", body: deliverable("marketing_plan")?.summary ?? "当前未提供" },
  ];

  return (
    <main className="blueprint-detail-page blueprint-detail-page-v2" id="main-content" tabIndex={-1}>
      <div className="site-shell">
        <nav aria-label="面包屑" className="breadcrumbs">
          <Link href="/">首页</Link><span aria-hidden="true">/</span><Link href="/blueprints">Blueprints</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span>
        </nav>

        <header className="blueprint-v2-hero">
          <div className="blueprint-v2-hero-copy">
            <div className="tag-row"><span className="tag">Blueprint #{String(product.number).padStart(3, "0")}</span><span className="tag">Preview edition</span><span className="tag">Product prototype</span></div>
            <h1>{product.name}</h1>
            <p className="blueprint-v2-tagline">{product.tagline}</p>
            <div className="blueprint-v2-opportunity-lead"><span>Market Opportunity · hypothesis</span><p>Turn a one-off color capture into a repeatable collectible workflow for people who think visually.</p></div>
            <div className="hero-actions">
              <Link className="button button-primary button-large" href={actionHref}>查看免费蓝图内容 <span aria-hidden="true">↘</span></Link>
              <Link className="button button-secondary button-large" href="/demos/colorsnap">Preview Demo</Link>
            </div>
            <div className="blueprint-v2-hero-meta"><span>Blueprint Score <strong>{product.blueprintScore.overall}/100</strong></span><span>7 launch assets</span><span>Build estimate · 3–7 days</span></div>
          </div>

          <div className="blueprint-v2-preview-wrap">
            <div className="blueprint-v2-browser-bar"><span /><span /><span /><small>colorsnap / product-preview</small></div>
            <ColorSnapProductPreview />
            <Link className="blueprint-v2-preview-link" href="/demos/colorsnap"><span className="blueprint-v2-play-icon">▶</span> Preview the interactive Demo <span aria-hidden="true">↗</span></Link>
          </div>
        </header>

        <div className="blueprint-v2-layout">
          <article className="blueprint-v2-content">
            <section className="blueprint-v2-section blueprint-v2-market-section" id="market-opportunity">
              <div className="blueprint-v2-section-heading"><span>01</span><div><p>Why this is worth building</p><h2>Market Opportunity</h2></div></div>
              <div className="blueprint-v2-opportunity-grid">
                <div className="blueprint-v2-opportunity-copy"><p>{product.summary}</p><p className="truth-note">这是编辑假设，不是市场规模、收入、留存或付费意愿数据。先验证用户是否愿意持续记录并分享现实颜色，再决定是否扩大 AI 与商业化。</p></div>
                <div className="blueprint-v2-signal-list"><div><strong>01</strong><span>Existing habit</span><p>设计师、摄影师和视觉创作者本来就在收集色板与参考。</p></div><div><strong>02</strong><span>Open wedge</span><p>把取色工具变成有故事、可回看、可分享的收藏体验。</p></div><div><strong>03</strong><span>Validation question</span><p>用户会不会在第一次体验后，主动回来记录第二张色卡？</p></div></div>
              </div>
            </section>

            <section className="blueprint-v2-section" id="target-users">
              <div className="blueprint-v2-section-heading"><span>02</span><div><p>Who it is for</p><h2>Target Users</h2></div></div>
              <div className="blueprint-v2-profile-grid">{userProfiles.map((profile) => <article key={profile.title}><span>{profile.label}</span><h3>{profile.title}</h3><p>{profile.body}</p></article>)}</div>
            </section>

            <section className="blueprint-v2-section" id="business-model">
              <div className="blueprint-v2-section-heading"><span>03</span><div><p>How it could become a business</p><h2>Business Model</h2></div></div>
              <div className="blueprint-v2-two-column"><article className="blueprint-v2-dark-card"><span className="marketplace-kicker">Editorial hypothesis</span><h3>Free capture. Paid expression.</h3><p>先用免费取色和收藏建立使用习惯，再验证主题色包、专业导出、创作者工具或团队工作区是否有付费意愿。</p></article><article className="blueprint-v2-light-card"><h3>Validation before monetization</h3><ul><li>15 名目标用户完成一次颜色收藏任务</li><li>记录第二次使用与分享行为</li><li>在行为成立后再测试主题包或专业导出</li></ul></article></div>
            </section>

            <section className="blueprint-v2-section" id="tech-stack">
              <div className="blueprint-v2-section-heading"><span>04</span><div><p>What powers the first version</p><h2>Tech Stack</h2></div></div>
              <div className="blueprint-v2-tech-grid"><div><span>Current prototype</span><strong>HTML · CSS · JavaScript</strong><p>Canvas、FileReader、MediaDevices、localStorage 与 CIEDE2000。</p></div><div><span>Upgrade path</span><strong>Supabase · Object Storage · AI</strong><p>账号、私有照片、云同步和视觉模型都是后续候选，不属于当前 Demo 能力。</p></div></div>
            </section>

            <BlueprintScore score={product.blueprintScore} />
            <BuildTimeline steps={product.buildTimeline} />

            <section className="blueprint-v2-section" id="whats-included">
              <div className="blueprint-v2-section-heading"><span>07</span><div><p>What you get after access</p><h2>What&apos;s Included</h2></div></div>
              <p className="blueprint-v2-section-intro">一份启动包应该让你知道下一步做什么，也要明确哪些内容尚未交付。当前是本地预发布样品，不把路线图写成源码包。</p>
              <div className="blueprint-launch-modules">{launchModules.map((module) => <article className={`blueprint-launch-module blueprint-launch-module-${module.tone}`} key={module.title}><span className="blueprint-launch-module-icon">{module.icon}</span><div><h3>{module.title}</h3><p>{module.detail}</p></div><small>{module.status}</small></article>)}</div>
            </section>

            <section className="blueprint-v2-section blueprint-v2-decision-section" id="product-breakdown">
              <div className="blueprint-v2-section-heading"><span>08</span><div><p>Full product thinking</p><h2>The 12 decision layers</h2></div></div>
              <div className="blueprint-v2-decision-grid">{decisionSections.map((section, index) => <article key={section.label}><span>{String(index + 1).padStart(2, "0")} · {section.label}</span><h3>{section.title}</h3><p>{section.body}</p></article>)}</div>
            </section>

            <section className="blueprint-v2-section blueprint-v2-evidence-section" id="evidence">
              <details><summary>Evidence & limits · 查看真实性边界</summary><div className="blueprint-boundary-grid"><BoundaryList items={product.demoFacts.implemented} title="已运行或代码实现" /><BoundaryList items={product.demoFacts.simulated} title="明确模拟" /><BoundaryList items={product.demoFacts.missing} title="明确缺失" /></div><div className="blueprint-v2-target-plan"><h3>AI upgrade candidate</h3><p>{product.targetPlan.positioning}。{product.targetPlan.validationGoal}。</p><ul>{product.targetPlan.notIncluded.map((item) => <li key={item}>{item}</li>)}</ul></div><p className="truth-note">{product.relationship?.disclosure ?? "当前没有可展示的 Demo 关系。"} {product.originStatement}</p></details>
            </section>
          </article>

          <aside className="blueprint-v2-purchase-card">
            <div className="blueprint-v2-purchase-top"><span className="marketplace-kicker marketplace-kicker-dark">Preview edition</span><span className="blueprint-v2-purchase-status">Local preview</span></div>
            <h2>Start with ColorSnap</h2>
            <p className="blueprint-v2-purchase-copy">A focused product blueprint for founders who want a sharper first build.</p>
            <div className="blueprint-v2-purchase-score"><strong>{product.blueprintScore.overall}</strong><span>Blueprint Score<br /><small>editorial estimate</small></span></div>
            <ul><li>12 product decision layers</li><li>7 launch asset samples</li><li>Build timeline with estimates</li><li>Launch Dashboard after access</li></ul>
            <Link className="button button-primary button-large" href={actionHref}>查看免费蓝图内容 <span aria-hidden="true">↘</span></Link>
            <p className="blueprint-v2-purchase-note">当前内容免费公开浏览，不设置价格，也不创建订单或支付交易。</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
