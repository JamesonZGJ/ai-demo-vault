import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/copyright" }, description: "AI Demo Marketplace 的来源、归属、重实现和版权边界。", title: "Copyright" };

export default function CopyrightPage() {
  return <main className="prose-page site-shell" id="main-content" tabIndex={-1}><header className="prose-page-header"><span className="eyebrow">Copyright</span><h1>References are credited. Packages are rebuilt.</h1><p>每个公开内容都应能说明来源、归属、许可证和本站的独立重实现边界。</p></header><div className="prose-content"><section><h2>Attribution</h2><p>来源平台、作者、许可证和核验时间会记录在内容资料中。外部产品的名称、商标和截图不代表本站拥有其产品或代码。</p></section><section><h2>What is sold</h2><p>商品只包含本站拥有或明确获准再分发的实现资产。没有明确权利的第三方源码不会进入 Package。</p></section><section><h2>Current launch boundary</h2><p>当前版本主要展示 Preview 和 Package 规划状态，尚未开放真实支付。任何内容显示为 Preview only 时，都不代表已经购买或可下载。</p></section></div></main>;
}
