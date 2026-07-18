import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/bundles" },
  description: "Capability Package 组合包，按开发者需要整理的能力集合。",
  title: "Build Packs",
};

const packs = [
  ["Apple UI Pack", "Glass, hover, card and surface capabilities.", "planned"],
  ["Game UI Pack", "Draw, reward, reveal and map interactions.", "planned"],
  ["AI Agent Pack", "Loading, streaming, prompt and tool states.", "planned"],
  ["Landing Pack", "Hero, CTA, card and visual system building blocks.", "planned"],
] as const;

export default function BundlesPage() {
  return <main className="bundle-page site-shell" id="main-content" tabIndex={-1}><header className="bundle-page-header"><span className="eyebrow">Build Packs</span><h1>Compose a bigger interface from smaller capabilities.</h1><p>Bundle 会在单个 Capability Package 完成自研实现、权利和接入验证后开放。当前只展示规划，不显示虚构价格或购买按钮。</p></header><div className="bundle-grid">{packs.map(([name, summary, status]) => <article className="bundle-card" key={name}><span className="asset-status asset-status-planned">{status}</span><h2>{name}</h2><p>{summary}</p><Link className="text-link" href="/explore">Explore capabilities ↗</Link></article>)}</div></main>;
}
