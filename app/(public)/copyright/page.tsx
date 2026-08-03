import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/copyright" }, description: "AI Build Blocks Marketplace 的来源、归属、重实现和版权边界。", title: "Copyright" };

export default function CopyrightPage() {
  return <main className="prose-page site-shell" id="main-content" tabIndex={-1}><header className="prose-page-header"><span className="eyebrow">Copyright</span><h1>References are credited. Packages are rebuilt.</h1><p>每个公开内容都应能说明来源、归属、许可证和本站的独立重实现边界。</p></header><div className="prose-content"><section><h2>Attribution</h2><p>来源平台、作者、许可证和核验时间会记录在内容资料中。外部产品的名称、商标和截图不代表本站拥有其产品或代码。</p></section><section><h2>What is shared</h2><p>免费内容只包含本站拥有或明确获准再分发的实现资产。没有明确权利的第三方源码不会进入 Package。</p></section><section><h2>Current launch boundary</h2><p>当前版本免费公开已有的 Preview 和 Package 资料；显示为 Preview only 的内容仍不代表源码或下载已经准备完成。</p></section></div></main>;
}
