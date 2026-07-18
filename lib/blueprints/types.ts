export type BlueprintDeliverableKind =
  | "product_breakdown"
  | "business_model"
  | "ui_resources"
  | "prd"
  | "prompts"
  | "technical_plan"
  | "marketing_plan";

export interface BlueprintDeliverable {
  format: string;
  kind: BlueprintDeliverableKind;
  sampleStatus: "sample_ready" | "blocked";
  summary: string;
  title: string;
}

export interface BlueprintScore {
  aiCompatibility: number;
  buildDifficulty: number;
  competition: number;
  marketDemand: number;
  note: string;
  overall: number;
  revenuePotential: number;
}

export type BuildTimelineDifficulty = "low" | "medium" | "high";

export interface BuildTimelineStep {
  description: string;
  difficulty: BuildTimelineDifficulty;
  estimate: string;
  output: string;
  step: number;
  title: string;
  titleZh: string;
}

export interface BlueprintProduct {
  accessMode: "pilot_preview";
  blueprintScore: BlueprintScore;
  buildTimeline: BuildTimelineStep[];
  demoFacts: {
    implemented: string[];
    missing: string[];
    simulated: string[];
  };
  deliverables: BlueprintDeliverable[];
  id: string;
  name: string;
  number: number;
  originStatement: string;
  productSections: {
    featureMap: string;
    problem: string;
    productOverview: string;
    solution: string;
    targetUsers: string;
    uiScreens: string;
    userFlow: string;
  };
  pricingStatus: "undecided";
  relationship: {
    disclosure: string;
    kind: "own_case" | "original_rebuild" | "licensed_derivative";
  } | null;
  slug: string;
  status: "rework_required";
  summary: string;
  tagline: string;
  targetPlan: {
    notIncluded: string[];
    positioning: string;
    validationGoal: string;
  };
  version: string;
}

export interface BlueprintResource {
  content: string[];
  kind: BlueprintDeliverableKind;
  summary: string;
  title: string;
}

export interface BlueprintLibraryEntry {
  accessGrantedAt: string;
  product: BlueprintProduct;
  resources: BlueprintResource[];
}
