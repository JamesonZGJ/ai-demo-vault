import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/about" }, description: "AI Demo Marketplace 的定位、内容标准与 Launch Version 边界。", title: "About" };

export default function AboutPage() {
  return <main className="prose-page site-shell" id="main-content" tabIndex={-1}><header className="prose-page-header"><span className="eyebrow">About</span><h1>Find a capability. Preview it. Reuse it.</h1><p>AI Demo Marketplace 收集、拆解、重构并售卖可直接复用的前端能力、交互效果、动画和 AI Workflow。</p></header><div className="prose-content"><section><h2>What we sell</h2><p>Demo Preview 是免费的在线展示。Capability Package 才是商品，目标是让开发者把一个效果或工作流接入自己的项目，而不是购买一个完整 App。</p></section><section><h2>Launch Version</h2><p>当前版本优先保证搜索、在线预览、能力详情、状态透明、基础导航和移动端体验。支付、会员、评论、排行榜和复杂后台进入 Roadmap。</p></section><section><h2>ColorSnap</h2><p>ColorSnap 作为一个示例 App，被拆成 Color Extraction、Glass Surface、Card Highlight、Flip Card、Photo Scatter 等独立 Capability；完整 Blueprint 只是高级组合层。</p></section></div></main>;
}
