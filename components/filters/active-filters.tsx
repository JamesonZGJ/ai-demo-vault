import Link from "next/link";

import { difficultyLabels, regionLabels } from "../../lib/demos/labels";
import type {
  CatalogFilterOptions,
  CatalogFilters,
} from "../../lib/demos/types";
import { catalogHref } from "../../lib/catalog/search-params";

interface ActiveFiltersProps {
  filters: CatalogFilters;
  options: CatalogFilterOptions;
}

export function ActiveFilters({ filters, options }: ActiveFiltersProps) {
  const active = [
    filters.q
      ? { href: catalogHref(filters, { page: 1, q: undefined }), label: `关键词：${filters.q}` }
      : null,
    filters.category
      ? {
          href: catalogHref(filters, { category: undefined, page: 1 }),
          label: `分类：${options.categories.find(({ value }) => value === filters.category)?.label ?? filters.category}`,
        }
      : null,
    filters.tool
      ? {
          href: catalogHref(filters, { page: 1, tool: undefined }),
          label: `工具：${options.tools.find(({ value }) => value === filters.tool)?.label ?? filters.tool}`,
        }
      : null,
    filters.difficulty
      ? {
          href: catalogHref(filters, { difficulty: undefined, page: 1 }),
          label: `难度：${difficultyLabels[filters.difficulty]}`,
        }
      : null,
    filters.region
      ? {
          href: catalogHref(filters, { page: 1, region: undefined }),
          label: `地区：${regionLabels[filters.region]}`,
        }
      : null,
  ].filter((item): item is { href: string; label: string } => item !== null);

  if (active.length === 0) return null;

  return (
    <div aria-label="已选筛选条件" className="active-filters">
      {active.map((item) => (
        <Link href={item.href} key={item.label}>
          {item.label}
          <span aria-hidden="true">×</span>
          <span className="sr-only">移除此条件</span>
        </Link>
      ))}
      <Link className="clear-filters" href="/demos">
        清除全部
      </Link>
    </div>
  );
}
