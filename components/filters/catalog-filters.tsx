"use client";

import Link from "next/link";
import { useRef } from "react";

import type {
  CatalogFilterOptions,
  CatalogFilters as CatalogFilterValues,
} from "../../lib/demos/types";

interface CatalogFiltersProps {
  filters: CatalogFilterValues;
  options: CatalogFilterOptions;
}

interface FilterFormProps extends CatalogFiltersProps {
  idPrefix: string;
  onApply?: () => void;
  onReset?: () => void;
}

function FilterForm({
  filters,
  idPrefix,
  onApply,
  onReset,
  options,
}: FilterFormProps) {
  return (
    <form action="/demos" className="catalog-filter-form" method="get">
      <div className="filter-field filter-field-search">
        <label htmlFor={`${idPrefix}-q`}>搜索案例</label>
        <input
          defaultValue={filters.q}
          id={`${idPrefix}-q`}
          maxLength={100}
          name="q"
          placeholder="名称、短句或摘要"
          type="search"
        />
      </div>

      <div className="filter-field">
        <label htmlFor={`${idPrefix}-category`}>分类</label>
        <select
          defaultValue={filters.category ?? ""}
          id={`${idPrefix}-category`}
          name="category"
        >
          <option value="">全部分类</option>
          {options.categories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor={`${idPrefix}-tool`}>开发工具</label>
        <select
          defaultValue={filters.tool ?? ""}
          id={`${idPrefix}-tool`}
          name="tool"
        >
          <option value="">全部工具</option>
          {options.tools.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor={`${idPrefix}-difficulty`}>开发难度</label>
        <select
          defaultValue={filters.difficulty ?? ""}
          id={`${idPrefix}-difficulty`}
          name="difficulty"
        >
          <option value="">全部难度</option>
          <option value="beginner">入门</option>
          <option value="intermediate">中等</option>
          <option value="advanced">进阶</option>
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor={`${idPrefix}-region`}>发布方地区</label>
        <select
          defaultValue={filters.region ?? ""}
          id={`${idPrefix}-region`}
          name="region"
        >
          <option value="">全部地区</option>
          <option value="mainland_china">中国大陆发布方</option>
          <option value="international">海外发布方</option>
          <option value="mixed">跨地区主体</option>
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor={`${idPrefix}-sort`}>排序</label>
        <select defaultValue={filters.sort} id={`${idPrefix}-sort`} name="sort">
          <option value="newest">最新收录</option>
          <option value="commercial-potential">商业潜力编辑判断</option>
          <option value="most-favorited">真实收藏数</option>
          <option value="editor-pick">编辑精选</option>
        </select>
      </div>

      <div className="filter-actions">
        <button className="button button-primary" onClick={onApply} type="submit">
          应用筛选
        </button>
        <Link
          className="button button-quiet"
          href="/demos"
          {...(onReset ? { onClick: onReset } : {})}
        >
          重置
        </Link>
      </div>
    </form>
  );
}

export function CatalogFilters({ filters, options }: CatalogFiltersProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreFocusRef = useRef(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function close() {
    restoreFocusRef.current = true;
    dialogRef.current?.close();
  }

  function closeForNavigation() {
    restoreFocusRef.current = false;
    dialogRef.current?.close();
  }

  return (
    <>
      <div className="catalog-filters-desktop">
        <FilterForm
          filters={filters}
          idPrefix="desktop-filter"
          options={options}
        />
      </div>

      <div className="catalog-filters-mobile">
        <button
          aria-haspopup="dialog"
          className="button button-secondary filter-dialog-trigger"
          onClick={() => dialogRef.current?.showModal()}
          ref={triggerRef}
          type="button"
        >
          搜索与筛选
          <span aria-hidden="true">＋</span>
        </button>
        <dialog
          aria-labelledby="filter-dialog-title"
          className="filter-dialog"
          onClose={() => {
            if (restoreFocusRef.current) triggerRef.current?.focus();
            restoreFocusRef.current = true;
          }}
          ref={dialogRef}
        >
          <div className="filter-dialog-header">
            <h2 id="filter-dialog-title">搜索与筛选</h2>
            <button className="icon-button" onClick={close} type="button">
              <span aria-hidden="true">×</span>
              <span className="sr-only">关闭筛选</span>
            </button>
          </div>
          <FilterForm
            filters={filters}
            idPrefix="mobile-filter"
            onApply={closeForNavigation}
            onReset={closeForNavigation}
            options={options}
          />
        </dialog>
      </div>
    </>
  );
}
