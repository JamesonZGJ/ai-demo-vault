import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "没有找到这个 Build Block",
};

export default function NotFound() {
  return (
    <main className="state-page" id="main-content" tabIndex={-1}>
      <div className="state-panel">
        <span className="state-kicker">404</span>
        <h1>没有找到这个 Build Block</h1>
        <p>它可能尚未完成 Preview、已经撤下，或链接并不存在。</p>
        <Link className="button button-primary" href="/explore">
          返回 Build Blocks Marketplace
        </Link>
      </div>
    </main>
  );
}
