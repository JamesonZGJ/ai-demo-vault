export type CapabilityStatus = "preview_ready" | "planned";
export type CapabilityMode = "frontend" | "visual" | "interaction" | "ai_native";
export type PackageStatus = "preview_only" | "planned" | "ready_for_checkout";

export interface CapabilityAssetStatus {
  label: string;
  status: "ready" | "planned" | "not_available";
  note: string;
}

export interface Capability {
  category: string;
  /** 面向中文读者的展示标题；name 保留英文 internal 命名。 */
  displayNameZh?: string;
  categoryZh?: string;
  series?: {
    nameZh: string;
    episode: number;
    subtitleZh: string;
  };
  description: string;
  difficulty: "easy" | "medium" | "advanced";
  id: string;
  mode: CapabilityMode;
  name: string;
  packageAssets: CapabilityAssetStatus[];
  packageStatus: PackageStatus;
  problem: string;
  previewStatus: CapabilityStatus;
  slug: string;
  sourceStatus: "self_owned_prototype" | "planned";
  stack: string[];
  summary: string;
  tags: string[];
  useCases: string[];
}
