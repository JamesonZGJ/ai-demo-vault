import type { Metadata } from "next";
import Link from "next/link";

import { CapabilityGrid } from "../../../components/capabilities/capability-grid";
import { getCapabilities, getCapabilityCategories, getCapabilityStacks } from "../../../lib/capabilities/catalog";

export const metadata: Metadata = {
  alternates: { canonical: "/explore" },
  description: "Search reusable AI product Build Blocks with live demos, prompts, source status and integration notes.",
  title: "Explore Build Blocks",
};

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; stack?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const stack = params.stack?.trim() ?? "";
  const filtered = getCapabilities(query).filter((capability) => (!category || capability.category === category) && (!stack || capability.stack.includes(stack)));
  const categories = getCapabilityCategories();
  const stacks = getCapabilityStacks();
  return (
    <main className="capability-explore-page" id="main-content" tabIndex={-1}>
      <section className="capability-explore-hero site-shell">
        <span className="eyebrow">AI Build Blocks Marketplace</span>
        <h1>Find the Build Block your next build needs.</h1>
        <p>搜索一个可复用模块，在线预览，查看源码、Prompt、README、License 和接入说明。</p>
        <form action="/explore" className="capability-search-form" method="get">
          <label className="sr-only" htmlFor="capability-search">Search Build Blocks</label>
          <input defaultValue={query} id="capability-search" name="q" placeholder="Glass, Hero, Chat, Prompt, Animation…" type="search" />
          <button className="button button-primary" type="submit">Search Build Blocks</button>
        </form>
        <div className="capability-hot-searches" aria-label="Popular searches">{["Glass", "Hero", "Chat", "Prompt", "Animation", "Image Upload", "Ticket", "Color Picker"].map((term) => <Link href={`/explore?q=${encodeURIComponent(term)}`} key={term}>{term}</Link>)}</div>
      </section>

      <section className="capability-filter-strip" aria-label="Build Block categories">
        <div className="site-shell capability-filter-inner">
          <div><span className="eyebrow">Browse by need</span><strong>Build Block categories</strong></div>
          <div className="capability-filter-links"><Link className={!category ? "is-active" : ""} href={query ? `/explore?q=${encodeURIComponent(query)}` : "/explore"}>All</Link>{categories.map((item) => <Link className={category === item ? "is-active" : ""} href={`/explore?category=${encodeURIComponent(item)}`} key={item}>{item}</Link>)}</div>
        </div>
      </section>

      <section className="site-shell capability-results-section" aria-labelledby="capability-results-title">
        <div className="capability-results-heading"><div><span className="eyebrow">{query ? `Search results for “${query}”` : "The Build Block shelf"}</span><h2 id="capability-results-title">{filtered.length} Build Blocks</h2></div><div className="capability-stack-filter">{stacks.slice(0, 6).map((item) => <Link className={stack === item ? "is-active" : ""} href={`/explore?stack=${encodeURIComponent(item)}`} key={item}>{item}</Link>)}</div></div>
        {filtered.length > 0 ? <CapabilityGrid capabilities={filtered} /> : <div className="capability-empty"><span className="state-kicker">NO MATCHES</span><h2>No Build Block matches yet.</h2><p>我们不会用无关内容填充结果。试试 Glass、Hero、Prompt 或清除筛选。</p><Link className="button button-secondary" href="/explore">Clear search</Link></div>}
      </section>
    </main>
  );
}
