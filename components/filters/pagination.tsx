import Link from "next/link";

import { catalogHref } from "../../lib/catalog/search-params";
import type { CatalogFilters } from "../../lib/demos/types";

interface PaginationProps {
  filters: CatalogFilters;
  pageCount: number;
}

function pageWindow(current: number, pageCount: number) {
  const first = Math.max(1, Math.min(current - 2, pageCount - 4));
  const last = Math.min(pageCount, Math.max(current + 2, 5));
  return Array.from({ length: Math.max(0, last - first + 1) }, (_, index) => first + index);
}

export function Pagination({ filters, pageCount }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="案例库分页" className="pagination">
      {filters.page > 1 ? (
        <Link href={catalogHref(filters, { page: filters.page - 1 })} rel="prev">
          上一页
        </Link>
      ) : (
        <span aria-disabled="true">上一页</span>
      )}
      <div>
        {pageWindow(filters.page, pageCount).map((page) =>
          page === filters.page ? (
            <span aria-current="page" className="current-page" key={page}>
              {page}
            </span>
          ) : (
            <Link href={catalogHref(filters, { page })} key={page}>
              {page}
            </Link>
          ),
        )}
      </div>
      {filters.page < pageCount ? (
        <Link href={catalogHref(filters, { page: filters.page + 1 })} rel="next">
          下一页
        </Link>
      ) : (
        <span aria-disabled="true">下一页</span>
      )}
    </nav>
  );
}
