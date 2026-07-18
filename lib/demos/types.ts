export type CaseKind =
  | "product"
  | "open_source_project"
  | "model_demo"
  | "official_template"
  | "platform_workflow"
  | "embedded_feature";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type PublisherRegion =
  | "mainland_china"
  | "international"
  | "mixed";

export type Maturity =
  | "concept"
  | "interactive_prototype"
  | "working_demo"
  | "production_product";

export type ClaimKind = "fact" | "editorial_inference" | "hypothesis";

export type TechnologyDisclosure =
  | "verified"
  | "partially_disclosed"
  | "not_disclosed";

export type SourceCodeStatus =
  | "open_source"
  | "closed_source"
  | "not_disclosed";

export type DemoLinkKind =
  | "live_demo"
  | "repository"
  | "documentation"
  | "official_source"
  | "other";

export type DemoMediaKind = "image" | "gif" | "video";

export interface DemoTool {
  name: string;
  slug: string;
  url?: string | null;
}

export interface DemoCategory {
  name: string;
  slug: string;
}

export interface DemoMedia {
  alt: string;
  captionsUrl?: string | null;
  id: string;
  kind: DemoMediaKind;
  posterUrl?: string | null;
  role: "cover" | "product_preview" | "gallery";
  status: "approved";
  summary?: string | null;
  url: string;
}

export interface CommercialPotential {
  evaluatedAt: string;
  evidence: string;
  rationale: string;
  rulesVersion: string;
  score: number;
}

export interface CommercialPotentialSummary {
  score: number;
}

export interface DemoCardData {
  caseKind: CaseKind;
  category: DemoCategory;
  commercialPotential: CommercialPotentialSummary;
  difficulty: Difficulty;
  favoriteCount: number;
  id: string;
  maturity: Maturity;
  name: string;
  productPreview: DemoMedia;
  publishedAt: string;
  publisherRegion: PublisherRegion;
  slug: string;
  sourcePlatform: string;
  summary: string;
  tagline: string;
  tools: DemoTool[];
}

export interface DemoPublisher {
  evidenceUrl: string;
  name: string;
  region: string;
  role: string;
  verifiedAt: string;
}

export interface DemoLink {
  kind: DemoLinkKind;
  label: string;
  url: string;
  verifiedAt: string;
}

export interface DemoClaim {
  id: string;
  isPrimary: boolean;
  kind: ClaimKind;
  section: string;
  sourceUrl?: string | null;
  text: string;
  verifiedAt?: string | null;
}

export interface DemoEvidence {
  kind: string;
  label: string;
  sourceUrl: string;
  verifiedAt: string;
}

export interface DemoDetailData
  extends Omit<DemoCardData, "commercialPotential" | "productPreview"> {
  aiImplementation: string;
  businessModel: string;
  claims: DemoClaim[];
  commercialPotential: CommercialPotential;
  cover: DemoMedia;
  coreFeatures: string[];
  evidence: DemoEvidence[];
  implementationBoundary: {
    implemented: string[];
    missing: string[];
    simulated: string[];
  };
  links: DemoLink[];
  media: DemoMedia[];
  problem: string;
  productOverview: string;
  publishers: DemoPublisher[];
  solution: string;
  sourceCodeStatus: Exclude<SourceCodeStatus, "not_disclosed">;
  targetUsers: string;
  technology: string;
  technologyDisclosure: TechnologyDisclosure;
  ventureAdaptation: {
    changeAudience: string;
    changeContent: string;
    changeContext: string;
    newOpportunity: string;
  };
  whyItWorks: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export type CatalogSort =
  | "newest"
  | "commercial-potential"
  | "most-favorited"
  | "editor-pick";

export interface CatalogFilters {
  category?: string;
  difficulty?: Difficulty;
  page: number;
  q?: string;
  region?: PublisherRegion;
  sort: CatalogSort;
  tool?: string;
}

export interface CatalogFilterOptions {
  categories: FilterOption[];
  tools: FilterOption[];
}

export interface CatalogResult {
  filters: CatalogFilters;
  items: DemoCardData[];
  pageCount: number;
  total: number;
}

export interface HomeData {
  editorPicks: DemoCardData[];
  featured: DemoCardData | null;
  latest: DemoCardData[];
  mostFavorited: DemoCardData[];
}
