import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell site-footer-grid">
        <div>
          <Link className="brand" href="/">
            <span aria-hidden="true" className="brand-mark">
              BB
            </span>
            <span>AI Build Blocks Marketplace</span>
          </Link>
          <p>
            搜索一个 Build Block，在线预览，再把可复用的 UI、Prompt 和代码带回自己的项目。
          </p>
        </div>
        <nav aria-label="页脚导航">
          <Link href="/explore">Explore Build Blocks</Link>
          <Link href="/blueprints">Blueprints</Link>
          <Link href="/bundles">Bundles</Link>
          <Link href="/library">Library</Link>
          <Link href="/about">Resources</Link>
          <Link href="/about">About</Link>
          <Link href="/license">License</Link>
          <Link href="/copyright">Copyright</Link>
          <Link href="/privacy">隐私说明</Link>
        </nav>
        <p className="footer-disclaimer">
          当前公开版本使用 Preview 数据；价格为展示用 Mock Price，不扣款、不创建订单。没有自研实现和权利记录的内容不会显示为可售 Package。
        </p>
      </div>
    </footer>
  );
}
