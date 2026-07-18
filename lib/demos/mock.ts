import { capabilities } from "../capabilities/catalog";
import previewMockCatalog from "../../content/preview-mock/catalog.json";
import type {
  CatalogFilterOptions,
  CatalogFilters,
  CatalogResult,
  DemoCardData,
  DemoClaim,
  DemoDetailData,
  Difficulty,
  HomeData,
} from "./types";

const previewDate = "2026-07-19T00:00:00.000Z";
const repositoryUrl = "https://github.com/JamesonZGJ/ai-demo-vault";

function slugify(value: string) {
  return value
    .toLocaleLowerCase()
    .replace(/&/gu, "and")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");
}

function difficulty(value: "easy" | "medium" | "advanced"): Difficulty {
  if (value === "easy") return "beginner";
  if (value === "medium") return "intermediate";
  return "advanced";
}

function claim(
  section: string,
  text: string,
  index: number,
  kind: DemoClaim["kind"] = "editorial_inference",
): DemoClaim {
  return {
    id: `mock-claim-${index}-${section}`,
    isPrimary: true,
    kind,
    section,
    sourceUrl: repositoryUrl,
    text,
    verifiedAt: previewDate,
  };
}

function buildMockDemo(capability: (typeof capabilities)[number], index: number): DemoDetailData {
  const categorySlug = slugify(capability.category);
  const id = `preview-${capability.id}`;
  const media = {
    alt: `${capability.name} capability preview`,
    id: `${id}:preview`,
    kind: "image" as const,
    role: "product_preview" as const,
    status: "approved" as const,
    summary: capability.description,
    url: "/og-image.svg",
  };
  const productOverview = `${capability.name} 是一个可复用的 ${capability.category} 能力模块，先用在线 Preview 验证交互，再决定是否接入自己的项目。`;
  const solution = `把 ${capability.name} 拆成明确的输入、状态和输出，并用 ${capability.stack.join("、")} 保持接入边界清晰。`;
  const targetUsers = `${capability.useCases.join("、")} 的独立开发者、设计师和前端团队。`;
  const coreFeatures = capability.useCases;
  const claims: DemoClaim[] = [
    claim("product_overview", productOverview, index),
    claim("why_it_works", capability.summary, index + 1),
    claim("pain_points", capability.problem, index + 2),
    claim("solution", solution, index + 3),
    claim("target_users", targetUsers, index + 4),
    claim("core_features", coreFeatures.join("、"), index + 5),
    claim("ai_implementation", "Preview 只展示能力边界；AI Prompt 与自动化工作流在 Package 资产中单独维护。", index + 6),
    claim("technical_implementation", `${capability.stack.join("、")}，采用自研前端状态和可调参数实现。`, index + 7),
    claim("monetization", "单个 Capability Package 采用低价一次性获取策略；当前只展示资产状态，不接支付。", index + 8),
    claim("truth_boundary", "这是本地自研 Preview，不代表第三方源码授权、真实销量或市场验证。", index + 9, "fact"),
    claim("adaptation", `可将用户从${capability.useCases[0] ?? "个人项目"}改为团队工作流，将场景从 Demo 改为生产产品。`, index + 10),
  ];

  return {
    aiImplementation: "AI Prompt 和工作流属于后续 Package 资产；当前 Preview 只展示可复用能力本身。",
    businessModel: "低价 Capability Package；当前无支付、订单或下载权益。",
    caseKind: "product",
    category: { name: capability.category, slug: categorySlug },
    claims,
    commercialPotential: {
      evaluatedAt: previewDate,
      evidence: "本站编辑根据复用频率、接入成本和产品展示价值做的静态判断。",
      rationale: index < 3 ? "可直接预览，接入边界清晰。" : "适合进入后续精选能力池。",
      rulesVersion: "preview-mock-1",
      score: index < 3 ? 4 : 3,
    },
    coreFeatures,
    cover: {
      alt: `${capability.name} cover`,
      id: `${id}:cover`,
      kind: "image",
      role: "cover",
      status: "approved",
      url: "/og-image.svg",
    },
    difficulty: difficulty(capability.difficulty),
    evidence: [
      {
        kind: "self_owned",
        label: "本站自研 Preview",
        sourceUrl: repositoryUrl,
        verifiedAt: previewDate,
      },
    ],
    favoriteCount: 0,
    id,
    implementationBoundary: {
      implemented: ["在线 Preview", "能力说明", "本地静态展示"],
      missing: ["真实支付", "私有下载", "生产数据连接"],
      simulated: ["商业潜力评分", "Package 交付状态"],
    },
    links: [
      {
        kind: "live_demo",
        label: "在线 Preview",
        url: `/explore/${capability.slug}`,
        verifiedAt: previewDate,
      },
      {
        kind: "repository",
        label: "本站仓库",
        url: repositoryUrl,
        verifiedAt: previewDate,
      },
      {
        kind: "official_source",
        label: "本站自研来源",
        url: repositoryUrl,
        verifiedAt: previewDate,
      },
    ],
    maturity: capability.previewStatus === "preview_ready" ? "interactive_prototype" : "concept",
    media: [media],
    name: capability.name,
    problem: capability.problem,
    productOverview,
    publishedAt: previewDate,
    publisherRegion: "mixed",
    publishers: [
      {
        evidenceUrl: repositoryUrl,
        name: "AI Demo Marketplace",
        region: "self-owned",
        role: "developer",
        verifiedAt: previewDate,
      },
    ],
    solution,
    sourceCodeStatus: "closed_source",
    sourcePlatform: "AI Demo Marketplace",
    summary: capability.summary,
    tagline: capability.description,
    targetUsers,
    technology: capability.stack.join("、"),
    technologyDisclosure: "verified",
    tools: capability.stack.map((name) => ({ name, slug: slugify(name) })),
    ventureAdaptation: {
      changeAudience: "独立开发者 → 产品团队",
      changeContent: `${capability.name} → 可配置的业务模块`,
      changeContext: "个人 Demo → 生产项目",
      newOpportunity: "为团队提供一套可复制、可验证的前端能力资产。",
    },
    whyItWorks: capability.summary,
    slug: capability.slug,
  };
}

const mockDetails = previewMockCatalog.demos
  .filter(({ status }) => status === "published")
  .map((entry, index) => {
    const capability = capabilities.find(({ slug }) => slug === entry.capabilitySlug);
    if (!capability) throw new Error(`Preview Mock 缺少 Capability：${entry.capabilitySlug}`);
    return buildMockDemo(capability, index);
  });
const mockCards: DemoCardData[] = mockDetails.map(({ commercialPotential, cover, ...demo }) => ({
  ...demo,
  commercialPotential: { score: commercialPotential.score },
  productPreview: { ...cover, role: "product_preview" },
}));

export function getMockDemoBySlug(slug: string) {
  return mockDetails.find((demo) => demo.slug === slug) ?? null;
}

export function getMockPublishedSlugs() {
  return mockDetails.map(({ slug }) => ({ slug, updated_at: previewDate }));
}

export function getMockCatalogFilterOptions(): CatalogFilterOptions {
  const categories = [...new Map(mockCards.map(({ category }) => [category.slug, category.name])).entries()]
    .map(([value, label]) => ({ label, value }));
  const tools = [...new Map(mockCards.flatMap(({ tools }) => tools).map(({ slug, name }) => [slug, name])).entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([value, label]) => ({ label, value }));
  return { categories, tools };
}

export function searchMockCatalog(filters: CatalogFilters): CatalogResult {
  const query = filters.q?.toLocaleLowerCase();
  const filtered = mockCards.filter((demo) => {
    const detail = getMockDemoBySlug(demo.slug);
    const searchable = [
      demo.name,
      demo.summary,
      demo.tagline,
      demo.category.name,
      ...demo.tools.map(({ name }) => name),
      ...(detail?.coreFeatures ?? []),
    ].join(" ").toLocaleLowerCase();
    return (
      (!query || searchable.includes(query)) &&
      (!filters.category || demo.category.slug === filters.category) &&
      (!filters.difficulty || demo.difficulty === filters.difficulty) &&
      (!filters.region || demo.publisherRegion === filters.region) &&
      (!filters.tool || demo.tools.some(({ slug }) => slug === filters.tool))
    );
  });

  const sorted = [...filtered].sort((left, right) => {
    if (filters.sort === "most-favorited" || filters.sort === "commercial-potential") {
      return right.commercialPotential.score - left.commercialPotential.score;
    }
    return right.slug.localeCompare(left.slug);
  });
  const total = sorted.length;
  const start = (filters.page - 1) * 12;
  return {
    filters,
    items: sorted.slice(start, start + 12),
    pageCount: Math.ceil(total / 12),
    total,
  };
}

export function getMockHomeData(): HomeData {
  return {
    editorPicks: mockCards.slice(0, 6),
    featured: mockCards[0] ?? null,
    latest: mockCards.slice(0, 6),
    mostFavorited: [],
  };
}
