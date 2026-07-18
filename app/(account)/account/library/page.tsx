import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { BlueprintCard } from "../../../../components/blueprint/blueprint-card";
import { getOwnedBlueprints } from "../../../../lib/blueprints/catalog";
import { isLocalBlueprintPilot } from "../../../../lib/env";
import { createClient } from "../../../../lib/supabase/server";

export const metadata: Metadata = { title: "Launch Dashboard" };

export default async function BlueprintLibraryPage() {
  if (!isLocalBlueprintPilot()) notFound();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?${new URLSearchParams({ returnTo: "/account/library" })}`);

  const products = await getOwnedBlueprints();
  return (
    <main className="site-shell library-page" id="main-content" tabIndex={-1}>
      <header className="account-page-header">
        <span className="eyebrow">Launch Dashboard</span>
        <h1>Your product launch kits</h1>
        <p>这里显示当前账号在本地预览中获得的 Blueprint 启动台，不代表真实订单或付款。</p>
      </header>
      {products.length > 0 ? (
        <div className="blueprint-grid">{products.map((product) => <BlueprintCard key={product.id} library product={product} />)}</div>
      ) : (
        <section className="empty-state">
          <span className="state-kicker">还没有资料</span>
          <h2>Start with a Blueprint</h2>
          <p>完成明确标注的不扣款模拟流程后，启动台会保存在这里。</p>
          <Link className="button button-primary" href="/blueprints">浏览 Blueprint</Link>
        </section>
      )}
    </main>
  );
}
