import Link from "next/link";

import { isLocalBlueprintPilot } from "../../lib/env";

export function SiteFooter() {
  const blueprintPilot = isLocalBlueprintPilot();
  return (
    <footer className="site-footer">
      <div className="site-shell site-footer-grid">
        <div>
          <Link className="brand" href="/">
            <span aria-hidden="true" className="brand-mark">
              AD
            </span>
            <span>AI Demo Marketplace</span>
          </Link>
          <p>
            搜索一个能力，在线预览，再把可复用的前端模块带回自己的项目。
          </p>
        </div>
        <nav aria-label="页脚导航">
          <Link href="/explore">Explore Capabilities</Link>
          <Link href="/bundles">Bundles</Link>
          {blueprintPilot ? <Link href="/blueprints">App Blueprints</Link> : null}
          <Link href="/about">About</Link>
          <Link href="/license">License</Link>
          <Link href="/copyright">Copyright</Link>
          <Link href="/privacy">隐私说明</Link>
        </nav>
        <p className="footer-disclaimer">
          {blueprintPilot
            ? "当前为本地预发布：Capability Package 仍是 Preview only，不扣款、不创建订单。本站不出售第三方源码或未授权素材。"
            : "当前公开版本不接支付；没有自研实现和权利记录的内容不会显示为可售 Package。"}
        </p>
      </div>
    </footer>
  );
}
