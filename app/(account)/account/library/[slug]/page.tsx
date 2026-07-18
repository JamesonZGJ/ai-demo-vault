import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BuildTimeline } from "../../../../../components/blueprint/build-timeline";
import { getBlueprintBySlug, getBlueprintLibraryEntry } from "../../../../../lib/blueprints/catalog";
import { isLocalBlueprintPilot } from "../../../../../lib/env";
import { createClient } from "../../../../../lib/supabase/server";

export const metadata: Metadata = { title: "Launch Dashboard" };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeZone: "Asia/Hong_Kong" }).format(new Date(value));
}

const dashboardModules = [
  { kind: "prd", title: "PRD", label: "Product brief", resourceKind: "prd", tone: "ready" },
  { kind: "prompts", title: "Prompt", label: "AI workflow starters", resourceKind: "prompts", tone: "ready" },
  { kind: "ui_resources", title: "UI", label: "Screen & state map", resourceKind: "ui_resources", tone: "ready" },
  { kind: "code", title: "Code", label: "Build sequence", resourceKind: "technical_plan", tone: "plan" },
  { kind: "database", title: "Database", label: "Data & permissions", resourceKind: "technical_plan", tone: "plan" },
  { kind: "deploy", title: "Deploy Guide", label: "From local to preview", resourceKind: "technical_plan", tone: "plan" },
  { kind: "marketing_plan", title: "Marketing Kit", label: "Positioning & tests", resourceKind: "marketing_plan", tone: "ready" },
  { kind: "launch_checklist", title: "Launch Checklist", label: "First-user validation", resourceKind: "marketing_plan", tone: "plan" },
] as const;

export default async function BlueprintLibraryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ acquired?: string }>;
}) {
  if (!isLocalBlueprintPilot()) notFound();
  const { slug } = await params;
  const query = await searchParams;
  const product = await getBlueprintBySlug(slug);
  if (!product) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?${new URLSearchParams({ returnTo: `/account/library/${product.slug}` })}`);

  const entry = await getBlueprintLibraryEntry(product.slug);
  if (!entry) redirect(`/checkout/${product.slug}`);
  const resourceMap = new Map(entry.resources.map((resource) => [resource.kind, resource]));

  return (
    <main className="library-detail-page launch-dashboard-page" id="main-content" tabIndex={-1}>
      <div className="site-shell">
        <nav aria-label="面包屑" className="breadcrumbs"><Link href="/account/library">Launch Dashboard</Link><span aria-hidden="true">/</span><span aria-current="page">{entry.product.name}</span></nav>
        {query.acquired === "1" ? <section className="pilot-success-banner launch-dashboard-success" aria-live="polite" role="status"><strong>Preview access activated</strong><p>本地预览访问权已保存到当前账号；这不是支付成功，也没有创建订单。</p></section> : null}

        <header className="launch-dashboard-hero">
          <div><span className="marketplace-kicker marketplace-kicker-dark">Launch Dashboard · Preview access</span><h1>{entry.product.name}<br /><span>Launch Dashboard</span></h1><p>从产品判断到第一批用户，把这份 Blueprint 变成一条可以执行的启动路径。</p><div className="launch-dashboard-hero-meta"><span>Accessed {formatDate(entry.accessGrantedAt)}</span><span>Version {entry.product.version}</span><span>Local preview</span></div></div>
          <div className="launch-dashboard-score-card"><span>Blueprint Score</span><strong>{entry.product.blueprintScore.overall}</strong><small>/100 · editorial estimate</small><div className="launch-dashboard-progress"><span style={{ width: `${entry.product.blueprintScore.overall}%` }} /></div></div>
        </header>

        <section className="launch-dashboard-next-step" aria-labelledby="next-step-title"><div><span className="launch-dashboard-step-label">NEXT STEP · 01</span><h2 id="next-step-title">Import your Prompt</h2><p>先把颜色命名、视觉理解和配色建议 Prompt 放进你的 AI 开发工具，确定 AI 升级的边界。</p></div><a className="button button-primary" href="#launch-assets">Open Prompt <span aria-hidden="true">↘</span></a></section>

        <section className="launch-dashboard-section" id="launch-assets"><div className="launch-dashboard-heading"><div><span className="marketplace-kicker marketplace-kicker-dark">Your startup kit</span><h2>Build assets</h2></div><span>8 launch modules</span></div><div className="launch-dashboard-assets">{dashboardModules.map((module) => { const resource = resourceMap.get(module.resourceKind as typeof entry.resources[number]["kind"]); return <article className={`launch-dashboard-asset launch-dashboard-asset-${module.tone}`} key={module.kind}><div className="launch-dashboard-asset-icon">{module.tone === "ready" ? "✓" : "→"}</div><div><span>{module.label}</span><h3>{module.title}</h3><p>{resource?.summary ?? "当前预览提供实施路线，不包含可直接下载的成品文件。"}</p></div><div className="launch-dashboard-asset-action">{resource ? <a href={`#${resource.kind}`}>Open sample</a> : <span>Roadmap</span>}</div></article>; })}</div></section>

        <section className="launch-dashboard-section launch-dashboard-timeline-section"><BuildTimeline steps={entry.product.buildTimeline} /></section>

        <section className="launch-dashboard-section" id="launch-checklist"><div className="launch-dashboard-heading"><div><span className="marketplace-kicker marketplace-kicker-dark">Before you ship</span><h2>Launch Checklist</h2></div><span>5 decisions</span></div><div className="launch-checklist-grid"><label><input type="checkbox" /> <span><strong>Define your first user</strong><small>Choose one visual niche before adding features.</small></span></label><label><input type="checkbox" /> <span><strong>Run the core color task</strong><small>Measure completion, not compliments.</small></span></label><label><input type="checkbox" /> <span><strong>Invite 15 testers</strong><small>Watch for a second use within seven days.</small></span></label><label><input type="checkbox" /> <span><strong>Write down the stop line</strong><small>Know what would make you stop building.</small></span></label><label><input type="checkbox" /> <span><strong>Decide whether AI earns its place</strong><small>Add a model only after the deterministic loop works.</small></span></label></div></section>

        <section className="launch-dashboard-section launch-dashboard-notes-section"><div className="launch-dashboard-heading"><div><span className="marketplace-kicker marketplace-kicker-dark">Working notes</span><h2>Open the samples</h2></div><span>Private to your preview access</span></div><div className="library-resource-list">{entry.resources.map((resource, index) => <section id={resource.kind} key={resource.kind}><div className="library-resource-heading"><span>{String(index + 1).padStart(2, "0")}</span><div><p>{resource.summary}</p><h3>{resource.title}</h3></div></div><ul>{resource.content.map((item) => <li key={item}>{item}</li>)}</ul></section>)}</div></section>

        <footer className="detail-footer-actions launch-dashboard-footer"><a className="button button-primary" download href={`/account/library/${entry.product.slug}/download`}>Download sample pack</a><Link className="button button-secondary" href={`/blueprints/${entry.product.slug}`}>Back to Blueprint</Link><Link className="button button-secondary" href="/account/library">All dashboards</Link><p>当前下载的是编辑资料样品，不是源码包、Figma 文件或真实生产交付物。</p></footer>
      </div>
    </main>
  );
}
