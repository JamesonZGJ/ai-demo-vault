import { cache } from "react";

import { createClient } from "../supabase/server";
import type {
  CaseKind,
  ClaimKind,
  DemoClaim,
  DemoDetailData,
  DemoEvidence,
  DemoLink,
  DemoLinkKind,
  DemoMedia,
  DemoMediaKind,
  Difficulty,
  Maturity,
  PublisherRegion,
  SourceCodeStatus,
  TechnologyDisclosure,
} from "./types";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function requiredString(value: string | null, field: string): string {
  if (!value?.trim()) throw new Error(`公开案例缺少${field}`);
  return value;
}

function requiredScore(value: number | null): number {
  if (!Number.isInteger(value) || value === null || value < 1 || value > 5) {
    throw new Error("公开案例商业潜力编辑判断分数无效");
  }
  return value;
}

function stringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`公开案例 ${field} 数据无效`);
  }
  return value;
}

function truthBoundary(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("公开案例实现边界数据无效");
  }
  const boundary = value as Record<string, unknown>;
  return {
    implemented: stringArray(boundary.implemented, "已实现能力"),
    missing: stringArray(boundary.not_implemented, "未实现能力"),
    simulated: stringArray(boundary.simulated, "模拟能力"),
  };
}

function linkKind(kind: string): DemoLinkKind {
  const map: Record<string, DemoLinkKind> = {
    documentation: "documentation",
    online_demo: "live_demo",
    primary_source: "official_source",
    repository: "repository",
  };
  return map[kind] ?? "other";
}

function mediaKind(kind: string): DemoMediaKind {
  if (kind === "image" || kind === "gif" || kind === "video") return kind;
  throw new Error("公开案例媒体类型无效");
}

function requiredSourceCodeStatus(
  value: string,
): Exclude<SourceCodeStatus, "not_disclosed"> {
  if (value === "open_source" || value === "closed_source") return value;
  throw new Error("公开案例源码状态无效");
}

function evidenceLabel(kind: string) {
  const labels: Record<string, string> = {
    commercial_service: "提供商业服务",
    open_source: "开源仓库",
    public_adoption: "公开采用证据",
    public_pricing: "公开定价",
  };
  return labels[kind] ?? kind;
}

export const getPublishedDemoBySlug = cache(
  async (slug: string): Promise<DemoDetailData | null> => {
    if (!slugPattern.test(slug) || slug.length > 120) return null;

    const supabase = await createClient();
    const { data: demo, error: demoError } = await supabase
      .from("demos")
      .select(
        "id, slug, name, tagline, summary, category_id, case_kind, maturity, publisher_region, technology_disclosure, source_code_status, difficulty, pain_points, solution, target_users, core_features, ai_implementation, technical_implementation, monetization, truth_boundary, why_it_works, adapt_change_who, adapt_change_what, adapt_change_context, adapt_new_opportunity, primary_source_platform, primary_source_url, primary_source_verified_at, cover_path, cover_alt, commercial_potential_score, commercial_potential_rationale, commercial_potential_evidence, commercial_potential_rule_version, commercial_potential_verified_at, published_at, favorites_count",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (demoError) throw new Error("案例详情查询失败", { cause: demoError });
    if (!demo) return null;

    const [
      categoryResult,
      toolLinksResult,
      publishersResult,
      linksResult,
      claimsResult,
      mediaResult,
      evidenceResult,
    ] = await Promise.all([
      supabase.from("categories").select("name_zh, slug").eq("id", demo.category_id).single(),
      supabase.from("demo_tools").select("tool_id").eq("demo_id", demo.id),
      supabase
        .from("demo_publishers")
        .select("name, region, role, official_evidence_url, verified_at")
        .eq("demo_id", demo.id)
        .order("role"),
      supabase
        .from("demo_links")
        .select("link_type, label, url, last_verified_at")
        .eq("demo_id", demo.id)
        .order("link_type"),
      supabase
        .from("demo_claims")
        .select("id, section, claim_type, content, source_url, verified_at, is_primary")
        .eq("demo_id", demo.id)
        .order("created_at"),
      supabase
        .from("demo_media")
        .select(
          "id, role, storage_path, media_type, alt_text, authorization_status, static_poster_path, captions_path, text_summary",
        )
        .eq("demo_id", demo.id)
        .eq("authorization_status", "approved")
        .in("role", ["product_preview", "gallery"])
        .order("created_at"),
      supabase
        .from("demo_evidence")
        .select("evidence_type, description, source_url, verified_at")
        .eq("demo_id", demo.id)
        .order("evidence_type"),
    ]);

    const queryErrors = [
      categoryResult.error,
      toolLinksResult.error,
      publishersResult.error,
      linksResult.error,
      claimsResult.error,
      mediaResult.error,
      evidenceResult.error,
    ].filter((error) => error !== null);
    if (queryErrors.length > 0) {
      throw new Error("案例证据关系查询失败", { cause: queryErrors[0] });
    }

    const toolIds = (toolLinksResult.data ?? []).map(({ tool_id }) => tool_id);
    const toolsResult =
      toolIds.length > 0
        ? await supabase
            .from("tools")
            .select("name, slug, official_url")
            .in("id", toolIds)
            .order("name")
        : { data: [], error: null };
    if (toolsResult.error) {
      throw new Error("案例工具查询失败", { cause: toolsResult.error });
    }

    const links: DemoLink[] = (linksResult.data ?? []).map((link) => ({
      kind: linkKind(link.link_type),
      label: link.label,
      url: link.url,
      verifiedAt: link.last_verified_at,
    }));
    if (!links.some(({ url }) => url === demo.primary_source_url)) {
      links.push({
        kind: "official_source",
        label: "官方主来源",
        url: requiredString(demo.primary_source_url, "官方主来源"),
        verifiedAt: requiredString(demo.primary_source_verified_at, "主来源核验日期"),
      });
    }

    const media: DemoMedia[] = (mediaResult.data ?? []).map((item) => ({
      alt: item.alt_text,
      ...(item.captions_path ? { captionsUrl: item.captions_path } : {}),
      id: item.id,
      kind: mediaKind(item.media_type),
      ...(item.static_poster_path ? { posterUrl: item.static_poster_path } : {}),
      role: item.role as "product_preview" | "gallery",
      status: "approved",
      ...(item.text_summary ? { summary: item.text_summary } : {}),
      url: item.storage_path,
    }));

    const evidence: DemoEvidence[] = (evidenceResult.data ?? []).map((item) => ({
      kind: item.evidence_type,
      label: evidenceLabel(item.evidence_type),
      sourceUrl: item.source_url,
      verifiedAt: item.verified_at,
    }));

    const claims: DemoClaim[] = (claimsResult.data ?? []).map((claim) => ({
      id: claim.id,
      isPrimary: claim.is_primary,
      kind: claim.claim_type as ClaimKind,
      section: claim.section,
      ...(claim.source_url ? { sourceUrl: claim.source_url } : {}),
      text: claim.content,
      ...(claim.verified_at ? { verifiedAt: claim.verified_at } : {}),
    }));
    const productOverviewClaim = claims.find(
      (claim) => claim.isPrimary && claim.section === "product_overview",
    );
    if (!productOverviewClaim) {
      throw new Error("公开案例缺少产品概览主要主张");
    }

    if (!categoryResult.data) throw new Error("公开案例缺少分类");

    return {
      aiImplementation: requiredString(demo.ai_implementation, "AI 实现方式"),
      businessModel: requiredString(demo.monetization, "盈利方式"),
      caseKind: demo.case_kind as CaseKind,
      category: {
        name: categoryResult.data.name_zh,
        slug: categoryResult.data.slug,
      },
      claims,
      commercialPotential: {
        evaluatedAt: requiredString(
          demo.commercial_potential_verified_at,
          "商业潜力核验日期",
        ),
        evidence: requiredString(
          demo.commercial_potential_evidence,
          "商业潜力判断依据",
        ),
        rationale: requiredString(
          demo.commercial_potential_rationale,
          "商业潜力判断理由",
        ),
        rulesVersion: requiredString(
          demo.commercial_potential_rule_version,
          "商业潜力规则版本",
        ),
        score: requiredScore(demo.commercial_potential_score),
      },
      coreFeatures: stringArray(demo.core_features, "核心功能"),
      cover: {
        alt: requiredString(demo.cover_alt, "封面替代文本"),
        id: `${demo.id}:cover`,
        kind: "image",
        role: "cover",
        status: "approved",
        url: requiredString(demo.cover_path, "封面路径"),
      },
      difficulty: demo.difficulty as Difficulty,
      evidence,
      favoriteCount: demo.favorites_count,
      id: demo.id,
      implementationBoundary: truthBoundary(demo.truth_boundary),
      links,
      maturity: demo.maturity as Maturity,
      media,
      name: demo.name,
      problem: requiredString(demo.pain_points, "用户痛点"),
      productOverview: productOverviewClaim.text,
      publishedAt: requiredString(demo.published_at, "发布时间"),
      publisherRegion: demo.publisher_region as PublisherRegion,
      publishers: (publishersResult.data ?? []).map((publisher) => ({
        evidenceUrl: publisher.official_evidence_url,
        name: publisher.name,
        region: publisher.region,
        role: publisher.role,
        verifiedAt: publisher.verified_at,
      })),
      slug: demo.slug,
      solution: requiredString(demo.solution, "解决方案"),
      sourceCodeStatus: requiredSourceCodeStatus(demo.source_code_status),
      sourcePlatform: requiredString(demo.primary_source_platform, "来源平台"),
      summary: demo.summary,
      tagline: demo.tagline,
      targetUsers: requiredString(demo.target_users, "目标用户"),
      technology: requiredString(demo.technical_implementation, "技术实现"),
      technologyDisclosure: demo.technology_disclosure as TechnologyDisclosure,
      tools: (toolsResult.data ?? []).map((tool) => ({
        name: tool.name,
        ...(tool.official_url ? { url: tool.official_url } : {}),
        slug: tool.slug,
      })),
      ventureAdaptation: {
        changeAudience: requiredString(demo.adapt_change_who, "创业改造用户"),
        changeContent: requiredString(demo.adapt_change_what, "创业改造内容"),
        changeContext: requiredString(demo.adapt_change_context, "创业改造场景"),
        newOpportunity: requiredString(
          demo.adapt_new_opportunity,
          "创业改造新机会",
        ),
      },
      whyItWorks: requiredString(demo.why_it_works, "为什么成立"),
    };
  },
);
