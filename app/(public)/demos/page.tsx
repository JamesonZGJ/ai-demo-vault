import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PublicAnalytics } from "../../../components/analytics/public-analytics";
import { ColorSnapDemoTeaser } from "../../../components/blueprint/colorsnap-demo-teaser";
import { DemoGrid } from "../../../components/demo/demo-grid";
import { ActiveFilters } from "../../../components/filters/active-filters";
import { CatalogFilters } from "../../../components/filters/catalog-filters";
import { Pagination } from "../../../components/filters/pagination";
import {
  catalogHref,
  parseCatalogFilters,
  type RawSearchParams,
} from "../../../lib/catalog/search-params";
import {
  getCatalogFilterOptions,
  searchCatalog,
} from "../../../lib/demos/search";
import { getFavoriteState } from "../../../lib/demos/favorite-state";
import { getBlueprintBySlug } from "../../../lib/blueprints/catalog";
import { isLocalBlueprintPilot } from "../../../lib/env";

export function generateMetadata(): Metadata {
  return {
    alternates: { canonical: "/demos" },
    description: "搜索和筛选有来源、有真实性边界与创业改造建议的 AI 产品案例。",
    ...(isLocalBlueprintPilot()
      ? { robots: { follow: false, index: false } }
      : {}),
    title: "AI 产品案例库",
  };
}

export default async function DemosPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const [raw, options] = await Promise.all([
    searchParams,
    getCatalogFilterOptions(),
  ]);
  const { filters, needsRedirect } = parseCatalogFilters(raw, options);

  if (needsRedirect) redirect(catalogHref(filters, {}));

  const result = await searchCatalog(filters);
  if (filters.page > 1 && (result.pageCount === 0 || filters.page > result.pageCount)) {
    redirect(
      catalogHref(filters, {
        page: result.pageCount > 0 ? result.pageCount : 1,
      }),
    );
  }
  const favoriteState = await getFavoriteState(result.items.map(({ id }) => id));
  const returnTo = catalogHref(filters, {});
  const colorsnapBlueprint = await getBlueprintBySlug("colorsnap-blueprint");
  const showPilotDemo = Boolean(
    colorsnapBlueprint &&
    filters.page === 1 &&
    filters.sort === "newest" &&
    !filters.category &&
    !filters.difficulty &&
    !filters.q &&
    !filters.region &&
    !filters.tool,
  );

  return (
    <main className="site-shell catalog-page" id="main-content" tabIndex={-1}>
      <header className="catalog-header">
        <span className="eyebrow">免费 Demo 发现入口</span>
        <h1>先看产品证据，再决定是否购买复刻资料</h1>
        <p>
          公开案例继续用于发现方向；只有存在本站合法 Blueprint 的案例，才会出现商品入口。
        </p>
      </header>

      <div className="catalog-layout">
        <aside aria-label="案例筛选" className="catalog-sidebar">
          <CatalogFilters filters={filters} options={options} />
        </aside>

        <section aria-labelledby="catalog-results-title" className="catalog-results">
          <div className="catalog-results-header">
            <div>
              <h2 id="catalog-results-title">全部案例</h2>
              <p aria-live="polite" role="status">
                共 {result.total} 个公开案例{showPilotDemo ? "，另有 1 个 Blueprint 预发布 Demo" : ""}
              </p>
            </div>
          </div>

          <ActiveFilters filters={filters} options={options} />

          {showPilotDemo && colorsnapBlueprint ? (
            <section aria-label="Blueprint #001 免费 Demo" className="pilot-demo-result">
              <ColorSnapDemoTeaser product={colorsnapBlueprint} />
            </section>
          ) : null}

          {result.items.length > 0 ? (
            <DemoGrid
              demos={result.items}
              eagerMediaCount={3}
              favoriteState={favoriteState}
              returnTo={returnTo}
            />
          ) : (
            <div className="empty-state catalog-empty-state">
              <span className="state-kicker">0 个结果</span>
              <h2>没有符合当前条件的案例</h2>
              <p>我们不会自动放宽条件或填入示例数据。</p>
              <Link className="button button-secondary" href="/demos">
                清除筛选
              </Link>
            </div>
          )}

          <Pagination filters={filters} pageCount={result.pageCount} />
        </section>
      </div>
      {colorsnapBlueprint ? null : <PublicAnalytics path="/demos" />}
    </main>
  );
}
