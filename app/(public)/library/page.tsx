import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { description: "查看已获取的 Build Block、Bundle 和高级 Blueprint。", robots: { follow: false, index: false }, title: "Library" };

export default function LibraryPage() {
  return <main className="library-page site-shell" id="main-content" tabIndex={-1}><header className="library-page-header"><span className="eyebrow">Library</span><h1>Your reusable Build Blocks, in one place.</h1><p>购买后，这里会显示版本、Prompt、源码、README、参数和 Integration Guide。当前公开版本没有真实购买和下载资产。</p></header><section className="library-empty"><span className="state-kicker">NO ACQUIRED PACKAGES</span><h2>Library is ready for your first Build Block.</h2><p>先从可交互的 Preview 开始。没有真实权益时，我们不会显示 Download 或已拥有状态。</p><Link className="button button-primary" href="/explore">Explore Build Blocks</Link></section></main>;
}
