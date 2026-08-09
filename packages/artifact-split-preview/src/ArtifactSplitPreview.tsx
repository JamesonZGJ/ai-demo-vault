"use client";

export type ArtifactMessage = {
  author: "user" | "assistant";
  id: string;
  text: string;
};

export type ArtifactVersion = {
  content: string;
  id: string;
  label: string;
  status?: "generating" | "ready" | "failed";
};

export type ArtifactSplitPreviewProps = {
  activeVersionId: string;
  messages: ArtifactMessage[];
  onVersionChange?: (versionId: string) => void;
  versions: ArtifactVersion[];
};

export function selectArtifactVersion(id: string, versions: ArtifactVersion[]) {
  return versions.find((version) => version.id === id);
}

export function ArtifactSplitPreview({
  activeVersionId,
  messages,
  onVersionChange,
  versions,
}: ArtifactSplitPreviewProps) {
  const active = selectArtifactVersion(activeVersionId, versions);

  return (
    <section aria-label="成果双栏预览" className="artifact-split-block">
      <div className="artifact-chat-pane">
        <span className="artifact-pane-label">对话</span>
        {messages.map((message) => (
          <p data-author={message.author} key={message.id}>{message.text}</p>
        ))}
      </div>
      <div className="artifact-preview-pane">
        <div className="artifact-version-bar">
          <span className="artifact-pane-label">成果预览</span>
          <div aria-label="成果版本">
            {versions.map((version) => (
              <button
                aria-pressed={version.id === activeVersionId}
                key={version.id}
                onClick={() => onVersionChange?.(version.id)}
                type="button"
              >
                {version.label}
              </button>
            ))}
          </div>
        </div>
        {active ? (
          <article aria-live="polite" data-status={active.status ?? "ready"}>
            <span>{active.status === "generating" ? "正在更新" : active.status === "failed" ? "更新失败" : "已完成"}</span>
            <p>{active.content}</p>
          </article>
        ) : (
          <p>请选择一个版本。</p>
        )}
      </div>
    </section>
  );
}
