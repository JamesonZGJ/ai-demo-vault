"use client";

export type CitationSource = {
  domain: string;
  excerpt: string;
  id: string;
  title: string;
};

export type CitationMarker = {
  id: string;
  label: string;
  sourceId: string;
};

export type SourceCitationPreviewProps = {
  activeCitationId?: string;
  citations: CitationMarker[];
  onCitationChange?: (citationId?: string) => void;
  sources: CitationSource[];
};

export function findCitationSource(id: string, sources: CitationSource[]) {
  return sources.find((source) => source.id === id);
}

export function SourceCitationPreview({
  activeCitationId,
  citations,
  onCitationChange,
  sources,
}: SourceCitationPreviewProps) {
  const activeCitation = citations.find(({ id }) => id === activeCitationId);
  const activeSource = activeCitation
    ? findCitationSource(activeCitation.sourceId, sources)
    : undefined;

  return (
    <section aria-label="引用来源预览" className="source-citation-block">
      <p className="source-citation-answer">
        调研结果显示，清晰的状态反馈能减少用户重复检查任务的次数
        {citations.map((citation) => (
          <button
            aria-expanded={citation.id === activeCitationId}
            className="source-citation-marker"
            key={citation.id}
            onClick={() =>
              onCitationChange?.(
                citation.id === activeCitationId ? undefined : citation.id,
              )
            }
            type="button"
          >
            {citation.label}
          </button>
        ))}
        。
      </p>
      {activeCitation ? (
        <aside aria-live="polite" className="source-citation-popover">
          {activeSource ? (
            <>
              <span>{activeSource.domain}</span>
              <strong>{activeSource.title}</strong>
              <p><mark>{activeSource.excerpt}</mark></p>
              <button onClick={() => onCitationChange?.(undefined)} type="button">
                关闭来源
              </button>
            </>
          ) : (
            <p>当前引用缺少可核查来源。</p>
          )}
        </aside>
      ) : null}
    </section>
  );
}
