import type {
  CatalogFilterOptions,
  CatalogFilters,
  CatalogSort,
  Difficulty,
  PublisherRegion,
} from "../demos/types";

export type RawSearchParams = Record<string, string | string[] | undefined>;
type CatalogPatch = {
  [Key in keyof CatalogFilters]?: CatalogFilters[Key] | undefined;
};

const difficulties = new Set<Difficulty>([
  "beginner",
  "intermediate",
  "advanced",
]);
const regions = new Set<PublisherRegion>([
  "mainland_china",
  "international",
  "mixed",
]);
const sorts = new Set<CatalogSort>([
  "newest",
  "commercial-potential",
  "most-favorited",
  "editor-pick",
]);
// 12 条/页时已远超规划规模，同时避免无界 OFFSET 和 PostgreSQL integer 溢出。
const maxCatalogPage = 10_000;
const supportedKeys = new Set([
  "q",
  "category",
  "tool",
  "difficulty",
  "region",
  "sort",
  "page",
]);

function firstValue(params: URLSearchParams, key: string) {
  return params.getAll(key)[0];
}

export function canonicalStaticCatalogQueryString(params: URLSearchParams) {
  const query = new URLSearchParams();
  const q = firstValue(params, "q")?.trim().slice(0, 100);
  const category = firstValue(params, "category")?.trim();
  const tool = firstValue(params, "tool")?.trim();
  const difficulty = firstValue(params, "difficulty");
  const region = firstValue(params, "region");
  const sort = firstValue(params, "sort");
  const pageRaw = firstValue(params, "page");

  if (q) query.set("q", q);
  // 分类和工具的存在性依赖数据库；代理只做结构清理，页面再做动态核验。
  if (category) query.set("category", category);
  if (tool) query.set("tool", tool);
  if (difficulties.has(difficulty as Difficulty)) {
    query.set("difficulty", difficulty as Difficulty);
  }
  if (regions.has(region as PublisherRegion)) {
    query.set("region", region as PublisherRegion);
  }
  if (sorts.has(sort as CatalogSort) && sort !== "newest") {
    query.set("sort", sort as CatalogSort);
  }
  if (pageRaw !== undefined) {
    const page = Number(pageRaw);
    if (
      Number.isSafeInteger(page) &&
      page > 1 &&
      page <= maxCatalogPage
    ) {
      query.set("page", String(page));
    }
  }

  return query.toString();
}

function scalar(
  raw: string | string[] | undefined,
): { invalid: boolean; value?: string } {
  if (Array.isArray(raw)) {
    return raw[0] === undefined
      ? { invalid: true }
      : { invalid: true, value: raw[0] };
  }

  return raw === undefined
    ? { invalid: false }
    : { invalid: false, value: raw };
}

export function catalogQueryString(filters: CatalogFilters): string {
  const query = new URLSearchParams();
  if (filters.q) query.set("q", filters.q);
  if (filters.category) query.set("category", filters.category);
  if (filters.tool) query.set("tool", filters.tool);
  if (filters.difficulty) query.set("difficulty", filters.difficulty);
  if (filters.region) query.set("region", filters.region);
  if (filters.sort !== "newest") query.set("sort", filters.sort);
  if (filters.page > 1) query.set("page", String(filters.page));
  return query.toString();
}

export function catalogHref(
  filters: CatalogFilters,
  patch: CatalogPatch,
): string {
  const category = Object.hasOwn(patch, "category")
    ? patch.category
    : filters.category;
  const difficulty = Object.hasOwn(patch, "difficulty")
    ? patch.difficulty
    : filters.difficulty;
  const q = Object.hasOwn(patch, "q") ? patch.q : filters.q;
  const region = Object.hasOwn(patch, "region") ? patch.region : filters.region;
  const tool = Object.hasOwn(patch, "tool") ? patch.tool : filters.tool;
  const next: CatalogFilters = {
    ...(category ? { category } : {}),
    ...(difficulty ? { difficulty } : {}),
    page: patch.page ?? filters.page,
    ...(q ? { q } : {}),
    ...(region ? { region } : {}),
    sort: patch.sort ?? filters.sort,
    ...(tool ? { tool } : {}),
  };
  const query = catalogQueryString(next);
  return query ? `/demos?${query}` : "/demos";
}

export function parseCatalogFilters(
  raw: RawSearchParams,
  options: CatalogFilterOptions,
): { filters: CatalogFilters; needsRedirect: boolean } {
  let needsRedirect = Object.keys(raw).some((key) => !supportedKeys.has(key));
  const qRaw = scalar(raw.q);
  const categoryRaw = scalar(raw.category);
  const toolRaw = scalar(raw.tool);
  const difficultyRaw = scalar(raw.difficulty);
  const regionRaw = scalar(raw.region);
  const sortRaw = scalar(raw.sort);
  const pageRaw = scalar(raw.page);
  needsRedirect ||= [
    qRaw,
    categoryRaw,
    toolRaw,
    difficultyRaw,
    regionRaw,
    sortRaw,
    pageRaw,
  ].some(({ invalid }) => invalid);

  if (
    [
      qRaw.value,
      categoryRaw.value,
      toolRaw.value,
      difficultyRaw.value,
      regionRaw.value,
      sortRaw.value,
      pageRaw.value,
    ].some((value) => value === "")
  ) {
    needsRedirect = true;
  }

  const q = qRaw.value?.trim().slice(0, 100);
  if (qRaw.value !== undefined && qRaw.value !== q) needsRedirect = true;

  const categoryValues = new Set(options.categories.map(({ value }) => value));
  const category =
    categoryRaw.value && categoryValues.has(categoryRaw.value)
      ? categoryRaw.value
      : undefined;
  if (categoryRaw.value && !category) needsRedirect = true;

  const toolValues = new Set(options.tools.map(({ value }) => value));
  const tool =
    toolRaw.value && toolValues.has(toolRaw.value) ? toolRaw.value : undefined;
  if (toolRaw.value && !tool) needsRedirect = true;

  const difficulty = difficulties.has(difficultyRaw.value as Difficulty)
    ? (difficultyRaw.value as Difficulty)
    : undefined;
  if (difficultyRaw.value && !difficulty) needsRedirect = true;

  const region = regions.has(regionRaw.value as PublisherRegion)
    ? (regionRaw.value as PublisherRegion)
    : undefined;
  if (regionRaw.value && !region) needsRedirect = true;

  const sort = sorts.has(sortRaw.value as CatalogSort)
    ? (sortRaw.value as CatalogSort)
    : "newest";
  if (sortRaw.value && !sorts.has(sortRaw.value as CatalogSort)) {
    needsRedirect = true;
  }
  if (sortRaw.value === "newest") needsRedirect = true;

  let page = 1;
  if (pageRaw.value !== undefined) {
    const parsed = Number(pageRaw.value);
    if (
      Number.isSafeInteger(parsed) &&
      parsed > 0 &&
      parsed <= maxCatalogPage
    ) {
      page = parsed;
      if (parsed === 1 || String(parsed) !== pageRaw.value) needsRedirect = true;
    } else {
      needsRedirect = true;
    }
  }

  return {
    filters: {
      ...(category ? { category } : {}),
      ...(difficulty ? { difficulty } : {}),
      page,
      ...(q ? { q } : {}),
      ...(region ? { region } : {}),
      sort,
      ...(tool ? { tool } : {}),
    },
    needsRedirect,
  };
}
