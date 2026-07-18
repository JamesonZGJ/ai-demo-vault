import type { Metadata } from "next";
import Link from "next/link";

import { BlueprintCard } from "../../../components/blueprint/blueprint-card";
import { getBlueprintCatalog } from "../../../lib/blueprints/catalog";
import { isLocalBlueprintPilot } from "../../../lib/env";

export const metadata: Metadata = {
  description: "本地预发布的产品 Blueprint 商品样品与 AI 升级候选。",
  robots: { follow: false, index: false },
  title: "Blueprint Marketplace 预发布",
};

export default async function BlueprintsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const products = await getBlueprintCatalog();
  const params = await searchParams;
  const query = (params.q ?? "").trim().toLowerCase();
  const category = params.category ?? "";
  const filteredProducts = products.filter((product) => {
    const matchesQuery = !query || [product.name, product.tagline, product.summary].join(" ").toLowerCase().includes(query);
    const matchesCategory = !category || category === "AI Design" || [product.name, product.tagline, product.summary].join(" ").toLowerCase().includes(category.toLowerCase());
    return matchesQuery && matchesCategory;
  });

  if (!isLocalBlueprintPilot() || products.length === 0) {
    return (
      <main className="site-shell blueprint-catalog-page" id="main-content" tabIndex={-1}>
        <header className="blueprint-catalog-header marketplace-catalog-header-v2">
          <span className="eyebrow">Advanced products</span>
          <h1>Blueprints are the whole-product layer.</h1>
          <p>Blueprints assemble Build Blocks into a complete product direction. This public preview keeps the catalog visible while the first verified Blueprint package is being prepared.</p>
          <Link className="button button-primary" href="/explore">Browse Build Blocks ↗</Link>
        </header>
        <section className="empty-state" aria-label="Blueprint status"><span className="state-kicker">COMING SOON</span><h2>Blueprint catalog is not open in this preview.</h2><p>No product, payment or access claim is shown until the Blueprint package is verified.</p></section>
      </main>
    );
  }

  return (
    <main className="site-shell blueprint-catalog-page" id="main-content" tabIndex={-1}>
      <header className="blueprint-catalog-header marketplace-catalog-header-v2">
        <span className="eyebrow">AI Product Blueprint Marketplace</span>
        <h1>Find the product you want to build next.</h1>
        <p>Browse founder-ready product blueprints. Each one turns a product idea into a clearer build, launch, and validation plan.</p>
        <form action="/blueprints" className="marketplace-search-form marketplace-catalog-search" method="get">
          <label className="sr-only" htmlFor="catalog-search">Search Blueprints</label>
          <input defaultValue={params.q ?? ""} id="catalog-search" name="q" placeholder="Search Blueprints" type="search" />
          <button className="button button-primary" type="submit">Search</button>
        </form>
      </header>

      <nav aria-label="Blueprint categories" className="marketplace-catalog-categories">
        {['All', 'AI Design', 'AI Video', 'AI Writing', 'AI Marketing', 'AI Productivity'].map((item) => (
          <Link className={(!category && item === 'All') || category === item ? 'is-active' : ''} href={item === 'All' ? '/blueprints' : `/blueprints?category=${encodeURIComponent(item)}`} key={item}>{item}</Link>
        ))}
      </nav>

      <section className="pilot-notice" role="note">
        <strong>本地预发布</strong>
        <p>当前只有 ColorSnap Blueprint #001 资料样品。正式价格未决定，模拟购买不会扣款或创建支付交易。</p>
      </section>

      {filteredProducts.length > 0 ? (
        <section aria-labelledby="blueprint-products-title" className="blueprint-catalog-results">
          <div className="section-heading">
            <div><span className="eyebrow">{query || category ? "Search results" : "Featured shelf"}</span><h2 id="blueprint-products-title">{filteredProducts.length} Blueprint{filteredProducts.length === 1 ? "" : "s"}</h2></div>
            <span className="marketplace-section-note">Editorial preview collection</span>
          </div>
          <div className="blueprint-grid">
            {filteredProducts.map((product) => <BlueprintCard key={product.id} product={product} />)}
          </div>
        </section>
      ) : (
        <section className="empty-state">
          <span className="state-kicker">No matches</span>
          <h2>No Blueprint matches that search yet.</h2>
          <p>Try another keyword. This MVP intentionally contains only the verified ColorSnap Blueprint #001.</p>
          <Link className="button button-secondary" href="/blueprints">Clear search</Link>
        </section>
      )}
    </main>
  );
}
