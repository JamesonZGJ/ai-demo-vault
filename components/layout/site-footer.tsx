import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell site-footer-grid">
        <div>
          <Link className="brand vault-brand" href="/">
            <span aria-hidden="true" className="vault-brand-mark">DV</span>
            <span><strong>AI Demo Vault</strong><small>AI 拆解局</small></span>
          </Link>
          <p>
            搜索一个 AI 产品能力，在线预览，再检查真实源码、Prompt 和接入资料。
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
          当前已有真实资料的模块全部免费开放，不设置价格，也不创建订单。没有自研实现和权利记录的内容只显示为准备中。
        </p>
      </div>
    </footer>
  );
}
