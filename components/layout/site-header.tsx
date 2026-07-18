import Link from "next/link";

import { MobileNavigation } from "./mobile-navigation";
import { isLocalBlueprintPilot, isStaticPreviewMode } from "../../lib/env";
import { createClient } from "../../lib/supabase/server";

export async function SiteHeader() {
  const previewMode = isStaticPreviewMode();
  const user = previewMode
    ? null
    : (await createClient()).auth.getUser().then(({ data }) => data.user);
  const blueprintPilot = isLocalBlueprintPilot();

  return (
    <header className="site-header">
      <div className="site-shell site-header-inner">
        <Link aria-label="AI Demo Marketplace 首页" className="brand" href="/">
          <span aria-hidden="true" className="brand-mark">
            AD
          </span>
          <span>AI Demo Marketplace</span>
        </Link>
        <nav aria-label="主导航" className="desktop-navigation">
          <Link href="/explore">Explore</Link>
          <Link href="/explore">Search Capabilities</Link>
          <Link href="/bundles">Bundles</Link>
          {blueprintPilot ? <Link href="/blueprints">App Blueprints</Link> : null}
          {user ? <Link href="/library">My Library</Link> : null}
          <Link href="/demos">Reference Demos</Link>
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
        <MobileNavigation blueprintPilot={blueprintPilot} loggedIn={Boolean(user)} />
      </div>
    </header>
  );
}
