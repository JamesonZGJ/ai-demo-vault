import Link from "next/link";

import { MobileNavigation } from "./mobile-navigation";
import { isStaticPreviewMode } from "../../lib/env";
import { createClient } from "../../lib/supabase/server";

export async function SiteHeader() {
  const previewMode = isStaticPreviewMode();
  const user = previewMode
    ? null
    : (await createClient()).auth.getUser().then(({ data }) => data.user);

  return (
    <header className="site-header">
      <div className="site-shell site-header-inner">
        <Link aria-label="AI Build Blocks Marketplace 首页" className="brand" href="/">
          <span aria-hidden="true" className="brand-mark">
            BB
          </span>
          <span>AI Build Blocks</span>
        </Link>
        <nav aria-label="主导航" className="desktop-navigation">
          <Link href="/explore">Explore</Link>
          <Link href="/explore">Build Blocks</Link>
          <Link href="/bundles">Bundles</Link>
          <Link href="/blueprints">Blueprints</Link>
          <Link href="/about">Resources</Link>
          <Link href="/library">Library</Link>
          {user ? <Link href="/favorites">我的收藏</Link> : null}
          {user ? (
            <form action="/auth/signout" method="post">
              <button className="button button-small button-secondary" type="submit">
                退出
              </button>
            </form>
          ) : (
            <Link className="button button-small button-secondary" href="/login">
              登录
            </Link>
          )}
        </nav>
        <MobileNavigation loggedIn={Boolean(user)} />
      </div>
    </header>
  );
}
