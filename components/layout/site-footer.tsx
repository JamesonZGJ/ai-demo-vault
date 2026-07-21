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
            <span>AI 能力模块库</span>
          </Link>
          <p>
            搜索一个能力模块，在线预览，再把可复用的界面、提示词和代码带回自己的项目。
          </p>
        </div>
        <nav aria-label="页脚导航">
          <Link href="/explore">浏览能力模块</Link>
          <Link href="/blueprints">产品蓝图</Link>
          <Link href="/bundles">组合包</Link>
          <Link href="/library">我的资源</Link>
          <Link href="/about">资源说明</Link>
          <Link href="/about">关于项目</Link>
          <Link href="/license">许可证</Link>
          <Link href="/copyright">版权声明</Link>
          <Link href="/privacy">隐私说明</Link>
        </nav>
        <p className="footer-disclaimer">
          当前公开版本使用预览数据；价格仅用于展示，不扣款、不创建订单。没有自研实现和权利记录的内容不会显示为可售模块。
        </p>
      </div>
    </footer>
  );
}
