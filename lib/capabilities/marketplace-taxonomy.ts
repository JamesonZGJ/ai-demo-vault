import type { Capability } from "./types";

export const marketplaceCategories = [
  { id: "ai-chat", label: "AI 对话", description: "输入、回复、加载与消息操作" },
  { id: "multimodal", label: "多模态", description: "图片、文件与媒体处理" },
  { id: "agent", label: "Agent 工作流", description: "节点、命令与执行关系" },
  { id: "content", label: "内容工具", description: "选择、渲染与结果表达" },
  { id: "free-ui", label: "Free UI", description: "通用产品界面基础" },
  { id: "visual", label: "Visual Effects", description: "视觉反馈与动效" },
  { id: "foundation", label: "Foundation", description: "结构、状态与导航" },
] as const;

export type MarketplaceCategoryId = (typeof marketplaceCategories)[number]["id"];

const categoryBySlug: Record<string, MarketplaceCategoryId> = {
  "ai-reasoning-panel": "ai-chat",
  "album-picker": "multimodal",
  "card-highlight": "visual",
  "circular-theme-reveal": "visual",
  "collapsible-sidebar": "foundation",
  "color-extraction": "multimodal",
  "command-palette": "agent",
  "connection-beam": "agent",
  "draw-card-animation": "visual",
  "file-upload-dropzone": "multimodal",
  "flip-card": "visual",
  "glass-surface": "visual",
  "gradient-background": "visual",
  "image-cropper": "multimodal",
  "image-desktop-pet": "free-ui",
  "magic-card": "visual",
  "map-marker": "content",
  "morphing-dialog": "free-ui",
  "photo-scatter": "visual",
  "prompt-composer": "ai-chat",
  "skeleton-loader": "ai-chat",
  "sortable-list": "free-ui",
  "streaming-chat": "ai-chat",
  "text-selection-toolbar": "content",
  "ticket-share-poster": "content",
  "toast-stack": "foundation",
};

export function getMarketplaceCategoryId(capability: Capability): MarketplaceCategoryId {
  return categoryBySlug[capability.slug] ?? "free-ui";
}

export function getMarketplaceCategoryLabel(capability: Capability) {
  const categoryId = getMarketplaceCategoryId(capability);
  return marketplaceCategories.find(({ id }) => id === categoryId)?.label ?? "Free UI";
}

export function getMarketplaceCategoryCount(capabilities: Capability[], categoryId: MarketplaceCategoryId) {
  return capabilities.filter((capability) => getMarketplaceCategoryId(capability) === categoryId).length;
}

export function getCapabilitySearchText(capability: Capability) {
  return [
    capability.displayNameZh,
    capability.name,
    capability.summary,
    capability.description,
    capability.problem,
    capability.tags.join(" "),
    capability.stack.join(" "),
    getMarketplaceCategoryLabel(capability),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}
