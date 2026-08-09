"use client";

export type DiffLine = {
  content: string;
  type: "add" | "remove" | "context";
};

export type DiffReviewFile = {
  added: number;
  decision?: "accepted" | "rejected";
  id: string;
  lines: DiffLine[];
  name: string;
  removed: number;
  reviewed: boolean;
};

export type AIDiffReviewProps = {
  activeFileId: string;
  files: DiffReviewFile[];
  onActiveFileChange?: (fileId: string) => void;
  onDecision?: (fileId: string, decision: "accepted" | "rejected") => void;
};

export function calculateReviewProgress(files: Array<{ reviewed: boolean }>) {
  if (files.length === 0) return 0;
  return Math.round((files.filter(({ reviewed }) => reviewed).length / files.length) * 100);
}

export function AIDiffReview({
  activeFileId,
  files,
  onActiveFileChange,
  onDecision,
}: AIDiffReviewProps) {
  const active = files.find(({ id }) => id === activeFileId) ?? files[0];
  const progress = calculateReviewProgress(files);
  return (
    <section aria-label="AI 代码差异审查" className="ai-diff-review-block">
      <aside>
        <strong>改动文件</strong>
        {files.map((file) => (
          <button aria-pressed={file.id === active?.id} key={file.id} onClick={() => onActiveFileChange?.(file.id)} type="button">
            <span>{file.name}</span><small>+{file.added} −{file.removed} · {file.reviewed ? "已审查" : "待审查"}</small>
          </button>
        ))}
      </aside>
      <div>
        <header><strong>{active?.name ?? "暂无改动"}</strong><span>{progress}% 已审查</span></header>
        <pre aria-label="代码差异">
          {active?.lines.map((line, index) => (
            <code data-line-type={line.type} key={`${line.content}-${index}`}>{line.type === "add" ? "+" : line.type === "remove" ? "−" : " "} {line.content}</code>
          ))}
        </pre>
        {active ? <footer><button onClick={() => onDecision?.(active.id, "rejected")} type="button">拒绝此文件</button><button onClick={() => onDecision?.(active.id, "accepted")} type="button">接受此文件</button></footer> : null}
      </div>
    </section>
  );
}
