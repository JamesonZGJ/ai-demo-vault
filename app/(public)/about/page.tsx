import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/about" }, description: "AI Build Blocks 内容库的定位、内容标准与 Launch Version 边界。", title: "About" };

export default function AboutPage() {
  return <main className="prose-page site-shell" id="main-content" tabIndex={-1}><header className="prose-page-header"><span className="eyebrow">About</span><h1>Find a Build Block. Preview it. Reuse it.</h1><p>AI Build Blocks 内容库收集、拆解并重构可直接复用的 UI、Prompt、交互效果、动画和 AI Workflow。</p></header><div className="prose-content"><section><h2>What we share</h2><p>已有真实资料的 Build Block 免费公开源码、Prompt、参数和接入说明，帮助开发者把一个效果或工作流接入自己的项目。</p></section><section><h2>Launch Version</h2><p>当前版本优先保证搜索、在线预览、Build Block 详情、状态透明、基础导航和移动端体验。支付、会员、评论、排行榜和复杂后台不在当前范围内。</p></section><section><h2>ColorSnap</h2><p>ColorSnap 作为一个示例 App，被拆成 Color Extraction、Glass Surface、Card Highlight、Flip Card、Photo Scatter 等独立 Build Block；完整 Blueprint 只是高级组合层。</p></section></div></main>;
}
