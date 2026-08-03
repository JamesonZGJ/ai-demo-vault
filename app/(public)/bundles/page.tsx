import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/bundles" },
  description: "Build Block 组合包，按开发者需要整理的能力集合。",
  title: "Bundles",
};

const packs = [
  ["Apple UI Pack", "Glass, hover, card and surface Build Blocks."],
  ["Game UI Pack", "Draw, reward, reveal and map interactions."],
  ["AI Agent Pack", "Loading, streaming, prompt and tool states."],
  ["Landing Pack", "Hero, CTA, card and visual system building blocks."],
] as const;

export default function BundlesPage() {
  return <main className="bundle-page site-shell" id="main-content" tabIndex={-1}><header className="bundle-page-header"><span className="eyebrow">Bundles</span><h1>Compose a bigger interface from smaller Build Blocks.</h1><p>Bundle 会把多个免费模块整理成一组。当前组合内容仍在准备，不显示价格，也不接支付或订单。</p></header><div className="bundle-grid">{packs.map(([name, summary]) => <article className="bundle-card" key={name}><span className="asset-status asset-status-planned">准备中</span><h2>{name}</h2><p>{summary}</p><Link className="text-link" href="/explore">先浏览免费模块 ↗</Link></article>)}</div></main>;
}
