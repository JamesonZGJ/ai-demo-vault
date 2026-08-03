"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Capability } from "../../lib/capabilities/types";
import {
  getCapabilitySearchText,
  getMarketplaceCategoryCount,
  getMarketplaceCategoryId,
  marketplaceCategories,
  type MarketplaceCategoryId,
} from "../../lib/capabilities/marketplace-taxonomy";
import { CapabilityCard } from "./capability-card";

type SortMode = "recommended" | "newest";

export function CapabilityBrowser({
  capabilities,
  initialCategory = "",
  initialQuery = "",
  initialStack = "",
}: {
  capabilities: Capability[];
  initialCategory?: string;
  initialQuery?: string;
  initialStack?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<MarketplaceCategoryId | "">(
    marketplaceCategories.some(({ id }) => id === initialCategory) ? (initialCategory as MarketplaceCategoryId) : "",
  );
  const [difficulty, setDifficulty] = useState("");
  const [stack, setStack] = useState(initialStack);
  const [materialState, setMaterialState] = useState("");
  const [sort, setSort] = useState<SortMode>("recommended");

  const stacks = useMemo(
    () => Array.from(new Set(capabilities.flatMap((capability) => capability.stack))).sort((a, b) => a.localeCompare(b)),
    [capabilities],
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const result = capabilities.filter((capability) => {
      if (normalizedQuery && !getCapabilitySearchText(capability).includes(normalizedQuery)) return false;
      if (category && getMarketplaceCategoryId(capability) !== category) return false;
      if (difficulty && capability.difficulty !== difficulty) return false;
      if (stack && !capability.stack.includes(stack)) return false;
      if (materialState === "ready" && capability.packageStatus !== "ready_for_checkout") return false;
      if (materialState === "preview" && capability.previewStatus !== "preview_ready") return false;
      return true;
    });

    if (sort === "newest") {
      return [...result].sort((a, b) => (b.series?.episode ?? 0) - (a.series?.episode ?? 0));
    }
    return result;
  }, [capabilities, category, difficulty, materialState, query, sort, stack]);

  function clearFilters() {
    setQuery("");
    setCategory("");
    setDifficulty("");
    setStack("");
    setMaterialState("");
    setSort("recommended");
  }

  return (
    <div className="vault-browser">
      <aside className="vault-category-rail" aria-label="AI 模块分类">
        <div className="vault-category-rail-heading"><span>分类</span><strong>AI 产品能力</strong></div>
        <button className={!category ? "is-active" : ""} onClick={() => setCategory("")} type="button"><span>全部模块</span><small>{capabilities.length}</small></button>
        {marketplaceCategories.map((item) => {
          const count = getMarketplaceCategoryCount(capabilities, item.id);
          return (
            <button className={category === item.id ? "is-active" : ""} key={item.id} onClick={() => setCategory(item.id)} type="button">
              <span>{item.label}</span><small>{count}</small>
            </button>
          );
        })}
        <div className="vault-category-rail-note"><strong>内容边界</strong><p>只展示已有 Demo 和真实资料状态，不使用虚构热度。</p></div>
      </aside>

      <section className="vault-browser-results" aria-labelledby="vault-results-heading">
        <div className="vault-browser-toolbar">
          <label className="vault-inline-search">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">即时搜索模块</span>
            <input onChange={(event) => setQuery(event.target.value)} placeholder="搜索中英文名称、标签或技术栈" type="search" value={query} />
          </label>
          <select aria-label="技术栈" onChange={(event) => setStack(event.target.value)} value={stack}><option value="">全部技术栈</option>{stacks.map((item) => <option key={item}>{item}</option>)}</select>
          <select aria-label="难度" onChange={(event) => setDifficulty(event.target.value)} value={difficulty}><option value="">全部难度</option><option value="easy">简单</option><option value="medium">中等</option><option value="advanced">较难</option></select>
          <select aria-label="资料状态" onChange={(event) => setMaterialState(event.target.value)} value={materialState}><option value="">全部状态</option><option value="ready">资料已准备</option><option value="preview">可在线预览</option></select>
          <select aria-label="排序" onChange={(event) => setSort(event.target.value as SortMode)} value={sort}><option value="recommended">推荐顺序</option><option value="newest">最新完成</option></select>
        </div>

        <div className="vault-results-summary">
          <div><span>浏览结果</span><h1 id="vault-results-heading">{filtered.length} 个 Build Blocks</h1></div>
          {(query || category || difficulty || stack || materialState) ? <button onClick={clearFilters} type="button">清除筛选</button> : <span>热门排序将在有真实行为数据后开放</span>}
        </div>

        {filtered.length ? (
          <div className="vault-block-grid">{filtered.map((capability) => <CapabilityCard capability={capability} key={capability.id} />)}</div>
        ) : (
          <div className="vault-empty-state"><span>0 个结果</span><h2>暂时没有匹配的真实模块。</h2><p>换一个关键词，或者清除当前筛选条件。</p><button onClick={clearFilters} type="button">查看全部模块</button></div>
        )}

        <div className="vault-results-footer"><span>已经到底了</span><Link href="/about">了解内容生产与版权边界 →</Link></div>
      </section>
    </div>
  );
}
