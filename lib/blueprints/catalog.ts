import { cache } from "react";

import { isLocalBlueprintPilot } from "../env";
import { createClient } from "../supabase/server";
import type {
  BlueprintDeliverable,
  BlueprintDeliverableKind,
  BlueprintLibraryEntry,
  BlueprintProduct,
  BlueprintResource,
  BlueprintScore,
  BuildTimelineStep,
} from "./types";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const requiredDeliverableKinds: BlueprintDeliverableKind[] = [
  "product_breakdown",
  "business_model",
  "ui_resources",
  "prd",
  "prompts",
  "technical_plan",
  "marketing_plan",
];

type JsonRecord = Record<string, unknown>;

function record(value: unknown, label: string): JsonRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}数据无效`);
  }
  return value as JsonRecord;
}

function stringValue(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label}数据无效`);
  }
  return value;
}

function stringArray(value: unknown, label: string): string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => typeof item !== "string" || !item.trim())
  ) {
    throw new Error(`${label}数据无效`);
  }
  return value as string[];
}

function scoreValue(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > 100) {
    throw new Error(`${label}数据无效`);
  }
  return value;
}

function mapBlueprintScore(value: unknown): BlueprintScore {
  const score = record(value, "Blueprint Score");
  return {
    aiCompatibility: scoreValue(score.ai_compatibility, "AI Compatibility"),
    buildDifficulty: scoreValue(score.build_difficulty, "Build Difficulty"),
    competition: scoreValue(score.competition, "Competition"),
    marketDemand: scoreValue(score.market_demand, "Market Demand"),
    note: stringValue(score.note, "Blueprint Score 说明"),
    overall: scoreValue(score.overall, "Blueprint Score 综合分"),
    revenuePotential: scoreValue(score.revenue_potential, "Revenue Potential"),
  };
}

function mapBuildTimeline(value: unknown): BuildTimelineStep[] {
  if (!Array.isArray(value) || value.length !== 5) {
    throw new Error("Blueprint Build Timeline 必须精确包含五个步骤");
  }

  return value.map((item, index) => {
    const step = record(item, `Build Timeline 第 ${index + 1} 步`);
    const stepNumber = step.step;
    if (stepNumber !== index + 1) {
      throw new Error("Blueprint Build Timeline 步骤编号必须连续");
    }
    const difficulty = step.difficulty;
    if (difficulty !== "low" && difficulty !== "medium" && difficulty !== "high") {
      throw new Error(`Build Timeline 第 ${index + 1} 步难度无效`);
    }
    return {
      description: stringValue(step.description, `Build Timeline 第 ${index + 1} 步说明`),
      difficulty,
      estimate: stringValue(step.estimate, `Build Timeline 第 ${index + 1} 步耗时`),
      output: stringValue(step.output, `Build Timeline 第 ${index + 1} 步产出`),
      step: stepNumber,
      title: stringValue(step.title, `Build Timeline 第 ${index + 1} 步标题`),
      titleZh: stringValue(step.title_zh, `Build Timeline 第 ${index + 1} 步中文标题`),
    };
  });
}

function mapFacts(value: unknown) {
  const facts = record(value, "Blueprint Demo 事实边界");
  return {
    implemented: stringArray(facts.implemented, "已实现能力"),
    missing: stringArray(facts.missing, "未实现能力"),
    simulated: stringArray(facts.simulated, "模拟能力"),
  };
}

function mapTargetPlan(value: unknown) {
  const plan = record(value, "Blueprint 目标方案");
  return {
    notIncluded: stringArray(plan.not_included, "不包含内容"),
    positioning: stringValue(plan.positioning, "目标定位"),
    validationGoal: stringValue(plan.validation_goal, "验证目标"),
  };
}

function assertDeliverables(rows: BlueprintDeliverable[]) {
  const kinds = rows.map(({ kind }) => kind);
  if (
    rows.length !== requiredDeliverableKinds.length ||
    new Set(kinds).size !== requiredDeliverableKinds.length ||
    requiredDeliverableKinds.some((kind) => !kinds.includes(kind))
  ) {
    throw new Error("Blueprint #001 必须精确包含七类资料样品");
  }
}

type BlueprintRow = {
  access_mode: string;
  blueprint_number: number;
  demo_facts: unknown;
  id: string;
  name: string;
  origin_statement: string;
  product_overview: string;
  target_users: string;
  problem_statement: string;
  solution_statement: string;
  feature_map: string;
  user_flow: string;
  ui_screens: string;
  blueprint_score: unknown;
  build_timeline: unknown;
  pricing_status: string;
  slug: string;
  status: string;
  summary: string;
  tagline: string;
  target_plan: unknown;
  version: string;
};

async function hydrateBlueprints(rows: BlueprintRow[]): Promise<BlueprintProduct[]> {
  if (rows.length === 0) return [];

  const supabase = await createClient();
  const ids = rows.map(({ id }) => id);
  const [deliverableResult, linkResult] = await Promise.all([
    supabase
      .from("blueprint_deliverables")
      .select("blueprint_id, kind, title, summary, format_label, sample_status, sort_order")
      .in("blueprint_id", ids)
      .order("sort_order"),
    supabase
      .from("blueprint_demo_links")
      .select("blueprint_id, relation_kind, disclosure")
      .in("blueprint_id", ids),
  ]);

  if (deliverableResult.error) {
    throw new Error("Blueprint 交付摘要查询失败", { cause: deliverableResult.error });
  }
  if (linkResult.error) {
    throw new Error("Blueprint Demo 关系查询失败", { cause: linkResult.error });
  }

  return rows.map((row) => {
    if (
      row.status !== "rework_required" ||
      row.access_mode !== "pilot_preview" ||
      row.pricing_status !== "undecided"
    ) {
      throw new Error("Blueprint 本地试用状态无效");
    }

    const deliverables: BlueprintDeliverable[] = (deliverableResult.data ?? [])
      .filter((item) => item.blueprint_id === row.id)
      .map((item) => ({
        format: item.format_label,
        kind: item.kind as BlueprintDeliverableKind,
        sampleStatus: item.sample_status as "sample_ready" | "blocked",
        summary: item.summary,
        title: item.title,
      }));
    assertDeliverables(deliverables);

    const relationshipRow = (linkResult.data ?? []).find(
      (item) => item.blueprint_id === row.id,
    );

    return {
      accessMode: "pilot_preview",
      blueprintScore: mapBlueprintScore(row.blueprint_score),
      buildTimeline: mapBuildTimeline(row.build_timeline),
      demoFacts: mapFacts(row.demo_facts),
      deliverables,
      id: row.id,
      name: row.name,
      number: row.blueprint_number,
      originStatement: row.origin_statement,
      productSections: {
        featureMap: row.feature_map,
        problem: row.problem_statement,
        productOverview: row.product_overview,
        solution: row.solution_statement,
        targetUsers: row.target_users,
        uiScreens: row.ui_screens,
        userFlow: row.user_flow,
      },
      pricingStatus: "undecided",
      relationship: relationshipRow
        ? {
            disclosure: relationshipRow.disclosure,
            kind: relationshipRow.relation_kind as
              | "own_case"
              | "original_rebuild"
              | "licensed_derivative",
          }
        : null,
      slug: row.slug,
      status: "rework_required",
      summary: row.summary,
      tagline: row.tagline,
      targetPlan: mapTargetPlan(row.target_plan),
      version: row.version,
    } satisfies BlueprintProduct;
  });
}

export const getBlueprintCatalog = cache(async (): Promise<BlueprintProduct[]> => {
  if (!isLocalBlueprintPilot()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blueprints")
    .select(
      "id, blueprint_number, slug, name, tagline, summary, status, version, pricing_status, access_mode, origin_statement, demo_facts, target_plan, product_overview, target_users, problem_statement, solution_statement, feature_map, user_flow, ui_screens, blueprint_score, build_timeline",
    )
    .order("blueprint_number");

  if (error) throw new Error("Blueprint 目录查询失败", { cause: error });
  return hydrateBlueprints(data as unknown as BlueprintRow[]);
});

export const getBlueprintBySlug = cache(
  async (slug: string): Promise<BlueprintProduct | null> => {
    if (!slugPattern.test(slug) || slug.length > 120) return null;
    const products = await getBlueprintCatalog();
    return products.find((product) => product.slug === slug) ?? null;
  },
);

export async function hasBlueprintAccess(blueprintId: string): Promise<boolean> {
  if (!isLocalBlueprintPilot()) return false;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("blueprint_access_grants")
    .select("id")
    .eq("user_id", user.id)
    .eq("blueprint_id", blueprintId)
    .maybeSingle();
  if (error) throw new Error("Blueprint 访问权查询失败", { cause: error });
  return Boolean(data);
}

export async function getOwnedBlueprints(): Promise<BlueprintProduct[]> {
  if (!isLocalBlueprintPilot()) return [];

  const products = await getBlueprintCatalog();
  if (products.length === 0) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("blueprint_access_grants")
    .select("blueprint_id")
    .eq("user_id", user.id);
  if (error) throw new Error("我的 Blueprint 查询失败", { cause: error });
  const ownedIds = new Set((data ?? []).map(({ blueprint_id }) => blueprint_id));
  return products.filter(({ id }) => ownedIds.has(id));
}

export async function getBlueprintLibraryEntry(
  slug: string,
): Promise<BlueprintLibraryEntry | null> {
  if (!isLocalBlueprintPilot()) return null;
  const product = await getBlueprintBySlug(slug);
  if (!product) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: grant, error: grantError } = await supabase
    .from("blueprint_access_grants")
    .select("created_at")
    .eq("user_id", user.id)
    .eq("blueprint_id", product.id)
    .maybeSingle();
  if (grantError) throw new Error("Blueprint 访问权查询失败", { cause: grantError });
  if (!grant) return null;

  const { data: resources, error: resourceError } = await supabase
    .from("blueprint_resources")
    .select("kind, title, summary, content, sort_order")
    .eq("blueprint_id", product.id)
    .order("sort_order");
  if (resourceError) {
    throw new Error("Blueprint 资料查询失败", { cause: resourceError });
  }

  const mappedResources: BlueprintResource[] = (resources ?? []).map((resource) => ({
    content: resource.content,
    kind: resource.kind as BlueprintDeliverableKind,
    summary: resource.summary,
    title: resource.title,
  }));
  if (mappedResources.length !== requiredDeliverableKinds.length) {
    throw new Error("ColorSnap Blueprint 资料样品不完整");
  }

  return {
    accessGrantedAt: grant.created_at,
    product,
    resources: mappedResources,
  };
}
