import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/bundles" },
  description: "Build Block 组合包，按开发者需要整理的能力集合。",
  title: "Bundles",
};

const packs = [
  ["Apple UI Pack", "Glass, hover, card and surface Build Blocks.", "$29 · mock price"],
  ["Game UI Pack", "Draw, reward, reveal and map interactions.", "$29 · mock price"],
  ["AI Agent Pack", "Loading, streaming, prompt and tool states.", "$29 · mock price"],
  ["Landing Pack", "Hero, CTA, card and visual system building blocks.", "$29 · mock price"],
] as const;

export default function BundlesPage() {
  return <main className="bundle-page site-shell" id="main-content" tabIndex={-1}><header className="bundle-page-header"><span className="eyebrow">Bundles</span><h1>Compose a bigger interface from smaller Build Blocks.</h1><p>Bundle 把多个可复用模块整理成一组。价格只是展示策略，当前不接支付、不创建订单。</p></header><div className="bundle-grid">{packs.map(([name, summary, price]) => <article className="bundle-card" key={name}><span className="asset-status asset-status-planned">Planned · {price}</span><h2>{name}</h2><p>{summary}</p><Link className="text-link" href="/explore">Explore Build Blocks ↗</Link></article>)}</div></main>;
}
