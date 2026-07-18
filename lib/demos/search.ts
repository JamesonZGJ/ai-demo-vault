import { createClient } from "../supabase/server";
import { createPublicClient } from "../supabase/public";
import type {
  CaseKind,
  CatalogFilterOptions,
  CatalogFilters,
  CatalogResult,
  DemoCardData,
  DemoMedia,
  DemoMediaKind,
  Difficulty,
  HomeData,
  Maturity,
  PublisherRegion,
} from "./types";

const caseKinds = new Set<CaseKind>([
  "product",
  "open_source_project",
  "model_demo",
  "official_template",
  "platform_workflow",
  "embedded_feature",
]);
const difficulties = new Set<Difficulty>([
  "beginner",
  "intermediate",
  "advanced",
]);
const maturities = new Set<Maturity>([
  "concept",
  "interactive_prototype",
  "working_demo",
  "production_product",
]);
const regions = new Set<PublisherRegion>([
  "mainland_china",
  "international",
  "mixed",
]);

interface SearchDemoRow {
  case_kind: string;
  category_name: string;
  category_slug: string;
  commercial_potential_rationale: string;
  commercial_potential_score: number;
  difficulty: string;
  editor_pick_rank: number | null;
  favorites_count: number;
  featured?: boolean;
  id: string;
  maturity: string;
  name: string;
  primary_source_platform: string;
  published_at: string;
  publisher_region: string;
  slug: string;
  summary: string;
  tagline: string;
  tool_names: string[];
  tool_slugs: string[];
  total_count?: number | string;
}

interface ProductPreviewRow {
  alt_text: string;
  authorization_status: string;
  captions_path: string | null;
  demo_id: string;
  id: string;
  media_type: string;
  role: string;
  static_poster_path: string | null;
  storage_path: string;
  text_summary: string | null;
}

interface SearchResult extends DemoCardData {
  editorPickRank: number | null;
  featured: boolean;
  totalCount: number;
}

function requireEnum<Value extends string>(
  value: string,
  values: Set<Value>,
  field: string,
): Value {
  if (!values.has(value as Value)) {
    throw new Error(`公开案例返回了无效 ${field}`);
  }
  return value as Value;
}

function requireInteger(value: number | string, field: string) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(`公开案例返回了无效 ${field}`);
  }
  return parsed;
}

function requireBoolean(value: boolean | undefined, field: string) {
  if (typeof value !== "boolean") {
    throw new Error(`公开案例返回了无效 ${field}`);
  }
  return value;
}

function productPreviewKind(value: string): DemoMediaKind {
  if (value === "image" || value === "gif" || value === "video") return value;
  throw new Error("公开卡片产品展示媒体类型无效");
}

export function requirePrimaryProductPreviews(
  rows: ProductPreviewRow[],
  demoIds: string[],
): Map<string, DemoMedia> {
  const requestedIds = [...new Set(demoIds)];
  const requestedIdSet = new Set(requestedIds);
  const previews = new Map<string, DemoMedia>();

  for (const row of rows) {
    if (!requestedIdSet.has(row.demo_id) || previews.has(row.demo_id)) continue;
    if (
      row.role !== "product_preview" ||
      row.authorization_status !== "approved" ||
      !row.id ||
      !row.alt_text.trim() ||
      !row.storage_path.trim()
    ) {
      throw new Error("公开卡片产品展示媒体数据无效");
    }

    const kind = productPreviewKind(row.media_type);
    if (kind === "gif" && !row.static_poster_path) {
      throw new Error("公开卡片 GIF 缺少静态海报");
    }

    previews.set(row.demo_id, {
      alt: row.alt_text,
      ...(row.captions_path ? { captionsUrl: row.captions_path } : {}),
      id: row.id,
      kind,
      ...(row.static_poster_path ? { posterUrl: row.static_poster_path } : {}),
      role: "product_preview",
      status: "approved",
      ...(row.text_summary ? { summary: row.text_summary } : {}),
      url: row.storage_path,
    });
  }

  const missingIds = requestedIds.filter((id) => !previews.has(id));
  if (missingIds.length > 0) {
    throw new Error(
      `公开卡片缺少已批准主产品展示媒体：${missingIds.join(", ")}`,
    );
  }

  return previews;
}

async function getPrimaryProductPreviews(
  supabase: Awaited<ReturnType<typeof createClient>>,
  demoIds: string[],
) {
  const uniqueIds = [...new Set(demoIds)];
  if (uniqueIds.length === 0) return new Map<string, DemoMedia>();

  const { data, error } = await supabase
    .from("demo_media")
    .select(
      "id, demo_id, role, storage_path, media_type, alt_text, authorization_status, static_poster_path, captions_path, text_summary, created_at",
    )
    .in("demo_id", uniqueIds)
    .eq("role", "product_preview")
    .eq("authorization_status", "approved")
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error("公开卡片产品展示媒体查询失败", { cause: error });
  }

  return requirePrimaryProductPreviews(
    data as unknown as ProductPreviewRow[],
    uniqueIds,
  );
}

function mapSearchRow(
  row: SearchDemoRow,
  productPreview: DemoMedia,
  override?: { featured: boolean; totalCount: number },
): SearchResult {
  if (row.tool_names.length !== row.tool_slugs.length) {
    throw new Error("公开案例工具名称与标识数量不一致");
  }

  const score = requireInteger(
    row.commercial_potential_score,
    "商业潜力编辑判断",
  );
  if (score < 1 || score > 5 || !row.commercial_potential_rationale.trim()) {
    throw new Error("公开案例商业潜力编辑判断不完整");
  }

  return {
    caseKind: requireEnum(row.case_kind, caseKinds, "案例形态"),
    category: { name: row.category_name, slug: row.category_slug },
    commercialPotential: { score },
    difficulty: requireEnum(row.difficulty, difficulties, "开发难度"),
    editorPickRank: row.editor_pick_rank,
    favoriteCount: requireInteger(row.favorites_count, "收藏数"),
    featured: override?.featured ?? requireBoolean(row.featured, "精选状态"),
    id: row.id,
    maturity: requireEnum(row.maturity, maturities, "成熟度"),
    name: row.name,
    productPreview,
    publishedAt: row.published_at,
    publisherRegion: requireEnum(row.publisher_region, regions, "发布方地区"),
    slug: row.slug,
    sourcePlatform: row.primary_source_platform,
    summary: row.summary,
    tagline: row.tagline,
    tools: row.tool_names.map((name, index) => ({
      name,
      slug: row.tool_slugs[index] as string,
    })),
    totalCount:
      override?.totalCount ?? requireInteger(row.total_count ?? -1, "结果总数"),
  };
}

async function runSearch(
  filters: CatalogFilters,
): Promise<SearchResult[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_demos", {
    p_category: filters.category ?? null,
    p_difficulty: filters.difficulty ?? null,
    p_page: filters.page,
    p_query: filters.q ?? null,
    p_region: filters.region ?? null,
    p_sort: filters.sort,
    p_tool: filters.tool ?? null,
  });

  if (error) throw new Error("公开案例查询失败", { cause: error });
  const rows = data as unknown as SearchDemoRow[];
  const previews = await getPrimaryProductPreviews(
    supabase,
    rows.map(({ id }) => id),
  );
  return rows.map((row) => mapSearchRow(row, previews.get(row.id)!));
}

async function getFeaturedRows(): Promise<SearchResult[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_featured_demos");
  if (error) throw new Error("今日精选查询失败", { cause: error });
  const rows = data as unknown as SearchDemoRow[];
  const previews = await getPrimaryProductPreviews(
    supabase,
    rows.map(({ id }) => id),
  );
  return rows.map((row) =>
    mapSearchRow(row, previews.get(row.id)!, {
      featured: true,
      totalCount: rows.length,
    }),
  );
}

export async function getCatalogFilterOptions(): Promise<CatalogFilterOptions> {
  const supabase = await createClient();
  const [categoryResult, toolResult] = await Promise.all([
    supabase.from("categories").select("name_zh, slug").order("sort_order"),
    supabase.from("tools").select("name, slug").order("name"),
  ]);

  if (categoryResult.error) {
    throw new Error("分类筛选加载失败", { cause: categoryResult.error });
  }
  if (toolResult.error) {
    throw new Error("工具筛选加载失败", { cause: toolResult.error });
  }

  return {
    categories: categoryResult.data.map(({ name_zh, slug }) => ({
      label: name_zh,
      value: slug,
    })),
    tools: toolResult.data.map(({ name, slug }) => ({ label: name, value: slug })),
  };
}

export async function searchCatalog(filters: CatalogFilters): Promise<CatalogResult> {
  const rows = await runSearch(filters);
  const total = rows[0]?.totalCount ?? 0;

  return {
    filters,
    items: rows,
    pageCount: Math.ceil(total / 12),
    total,
  };
}

function hongKongDayIndex(length: number) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Hong_Kong",
    year: "numeric",
  }).formatToParts(new Date());
  const byType = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const dayNumber = Math.floor(
    Date.parse(`${byType.year}-${byType.month}-${byType.day}T00:00:00Z`) / 86_400_000,
  );
  return ((dayNumber % length) + length) % length;
}

const homeFilters: CatalogFilters = { page: 1, sort: "newest" };

export async function getHomeData(): Promise<HomeData> {
  const [featuredRows, latestRows, favoritedRows, editorRows] = await Promise.all([
    getFeaturedRows(),
    runSearch(homeFilters),
    runSearch({ page: 1, sort: "most-favorited" }),
    runSearch({ page: 1, sort: "editor-pick" }),
  ]);
  const featured =
    featuredRows.length > 0
      ? featuredRows[hongKongDayIndex(featuredRows.length)] ?? null
      : null;

  return {
    editorPicks: editorRows
      .filter(({ editorPickRank }) => editorPickRank !== null)
      .slice(0, 6),
    featured,
    latest: latestRows.slice(0, 6),
    mostFavorited: favoritedRows
      .filter(({ favoriteCount }) => favoriteCount > 0)
      .slice(0, 6),
  };
}

export async function getPublishedSlugs() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("demos")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("slug");

  if (error) throw new Error("站点地图案例查询失败", { cause: error });
  return data;
}
