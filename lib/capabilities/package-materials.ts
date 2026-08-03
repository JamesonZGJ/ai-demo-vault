import { readFile } from "node:fs/promises";
import path from "node:path";

export interface CapabilityMaterial {
  content: string;
  id: "source" | "cursor" | "claude" | "readme" | "integration" | "parameters";
  label: string;
  language: string;
}

const sourceFiles: Record<string, string> = {
  "ai-action-approval-card": "src/AIActionApprovalCard.tsx",
  "ai-reasoning-panel": "src/AIReasoningPanel.tsx",
  "circular-theme-reveal": "src/CircularThemeReveal.tsx",
  "collapsible-sidebar": "src/CollapsibleSidebar.tsx",
  "color-extraction": "src/index.ts",
  "command-palette": "src/CommandPalette.tsx",
  "connection-beam": "src/ConnectionBeam.tsx",
  "file-upload-dropzone": "src/FileUploadDropzone.tsx",
  "glass-surface": "src/GlassCard.tsx",
  "image-desktop-pet": "src/ImageDesktopPet.tsx",
  "magic-card": "src/MagicCard.tsx",
  "morphing-dialog": "src/MorphingDialog.tsx",
  "prompt-composer": "src/PromptComposer.tsx",
  "skeleton-loader": "src/SkeletonLoader.tsx",
  "sortable-list": "src/SortableList.tsx",
  "streaming-chat": "src/StreamingChat.tsx",
  "text-selection-toolbar": "src/TextSelectionToolbar.tsx",
  "toast-stack": "src/ToastStack.tsx",
};

async function readMaterial(packageName: string, relativePath: string) {
  try {
    return await readFile(path.join(process.cwd(), "packages", packageName, relativePath), "utf8");
  } catch {
    return null;
  }
}

export async function getCapabilityMaterials(slug: string): Promise<CapabilityMaterial[]> {
  const sourcePath = sourceFiles[slug];
  if (!sourcePath) return [];

  const definitions = [
    { id: "source", label: sourcePath.endsWith(".tsx") ? "React / TypeScript" : "TypeScript", language: "tsx", path: sourcePath },
    { id: "cursor", label: "Cursor Prompt", language: "markdown", path: "prompts/cursor.md" },
    { id: "claude", label: "Claude Prompt", language: "markdown", path: "prompts/claude.md" },
    { id: "readme", label: "README", language: "markdown", path: "README.md" },
    { id: "integration", label: "接入指南", language: "markdown", path: "INTEGRATION_GUIDE.md" },
    { id: "parameters", label: "参数", language: "json", path: "parameters.json" },
  ] as const;

  const materials = await Promise.all(
    definitions.map(async (definition) => ({
      ...definition,
      content: await readMaterial(slug, definition.path),
    })),
  );

  return materials
    .filter((material): material is typeof material & { content: string } => Boolean(material.content))
    .map(({ content, id, label, language }) => ({ content: content.slice(0, 12_000), id, label, language }));
}
