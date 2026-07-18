import type {
  CaseKind,
  ClaimKind,
  Difficulty,
  Maturity,
  PublisherRegion,
  SourceCodeStatus,
  TechnologyDisclosure,
} from "./types";

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: "入门",
  intermediate: "中等",
  advanced: "进阶",
};

export const regionLabels: Record<PublisherRegion, string> = {
  mainland_china: "中国大陆发布方",
  international: "海外发布方",
  mixed: "跨地区主体",
};

export const maturityLabels: Record<Maturity, string> = {
  concept: "概念",
  interactive_prototype: "可交互原型",
  working_demo: "真实 Demo",
  production_product: "正式产品",
};

export const caseKindLabels: Record<CaseKind, string> = {
  product: "产品",
  open_source_project: "开源项目",
  model_demo: "模型 Demo",
  official_template: "官方模板",
  platform_workflow: "平台工作流",
  embedded_feature: "内嵌功能",
};

export const claimKindLabels: Record<ClaimKind, string> = {
  fact: "有来源事实",
  editorial_inference: "编辑推断",
  hypothesis: "产品假设",
};

export const technologyDisclosureLabels: Record<TechnologyDisclosure, string> = {
  verified: "技术信息已核验",
  partially_disclosed: "技术信息部分公开",
  not_disclosed: "技术信息未公开",
};

export const sourceCodeStatusLabels: Record<SourceCodeStatus, string> = {
  open_source: "源码已公开",
  closed_source: "源码未开放",
  not_disclosed: "源码状态未披露",
};
