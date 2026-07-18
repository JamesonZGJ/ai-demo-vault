import Link from "next/link";

export default function BlueprintNotFound() {
  return (
    <main className="site-shell state-page" id="main-content" tabIndex={-1}>
      <section className="state-panel">
        <span className="state-kicker">Blueprint 不可用</span>
        <h1>没有找到这个 Blueprint</h1>
        <p>它可能尚未通过本地预览门槛，或生产商城仍处于关闭状态。</p>
        <Link className="button button-secondary" href="/demos">浏览免费 Demo</Link>
      </section>
    </main>
  );
}
