import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { description: "查看免费开放的 Build Block、Bundle 和高级 Blueprint。", robots: { follow: false, index: false }, title: "Library" };

export default function LibraryPage() {
  return <main className="library-page site-shell" id="main-content" tabIndex={-1}><header className="library-page-header"><span className="eyebrow">Library</span><h1>Your reusable Build Blocks, in one place.</h1><p>已有模块的 Prompt、源码、README、参数和 Integration Guide 直接在详情页免费公开。</p></header><section className="library-empty"><span className="state-kicker">FREE LIBRARY</span><h2>从一个真实 Build Block 开始。</h2><p>当前不需要购买或领取。进入模块详情即可查看在线 Demo 和已经准备好的资料。</p><Link className="button button-primary" href="/explore">浏览免费模块</Link></section></main>;
}
