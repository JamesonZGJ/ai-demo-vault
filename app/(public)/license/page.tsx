import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/license" }, description: "Capability Package 的源码、Prompt、素材和第三方来源许可边界。", title: "License" };

export default function LicensePage() {
  return <main className="prose-page site-shell" id="main-content" tabIndex={-1}><header className="prose-page-header"><span className="eyebrow">License</span><h1>Every package needs a clear reuse boundary.</h1><p>本站不直接售卖第三方源码、模板或未授权素材。</p></header><div className="prose-content"><section><h2>Self-owned implementation</h2><p>可售 Capability Package 必须使用本站自研重实现，并记录源码版本、依赖、参数、Prompt、README 和 Integration Guide。</p></section><section><h2>Reference sources</h2><p>CodePen、Aceternity UI、Magic UI、ReactBits、Motion Primitives 等只作为交互和视觉参考。参考来源不等于可再分发许可。</p></section><section><h2>Package status</h2><p>没有源码、Prompt、README、参数或权利记录时，页面只能显示 Preview 或 Planned，不能显示购买、已拥有或 Download。</p></section></div></main>;
}
