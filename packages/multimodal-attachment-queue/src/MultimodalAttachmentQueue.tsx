"use client";

export type AttachmentStatus = "queued" | "uploading" | "parsing" | "complete" | "failed";

export type AttachmentItem = {
  id: string;
  name: string;
  progress?: number;
  status: AttachmentStatus;
  type?: string;
};

export type MultimodalAttachmentQueueProps = {
  items: AttachmentItem[];
  onItemsChange?: (items: AttachmentItem[]) => void;
  onRetry?: (id: string) => void;
};

export function reorderAttachments(items: AttachmentItem[], movingId: string, targetId: string) {
  const movingIndex = items.findIndex(({ id }) => id === movingId);
  const targetIndex = items.findIndex(({ id }) => id === targetId);
  if (movingIndex < 0 || targetIndex < 0 || movingIndex === targetIndex) return [...items];
  const next = [...items];
  const [moving] = next.splice(movingIndex, 1);
  if (!moving) return [...items];
  next.splice(targetIndex, 0, moving);
  return next;
}

const attachmentStatusLabels: Record<AttachmentStatus, string> = {
  complete: "处理完成",
  failed: "处理失败",
  parsing: "正在解析",
  queued: "等待处理",
  uploading: "正在上传",
};

export function MultimodalAttachmentQueue({ items, onItemsChange, onRetry }: MultimodalAttachmentQueueProps) {
  const move = (index: number, offset: number) => {
    const moving = items[index];
    const target = items[index + offset];
    if (moving && target) onItemsChange?.(reorderAttachments(items, moving.id, target.id));
  };
  return (
    <section aria-label="多模态附件队列" className="attachment-queue-block">
      <header><strong>附件处理队列</strong><span>{items.length} 个文件</span></header>
      <ol>
        {items.map((item, index) => (
          <li key={item.id}>
            <div><strong>{item.name}</strong><small>{item.type ?? "文件"} · {attachmentStatusLabels[item.status]}</small></div>
            {item.status === "uploading" ? <progress max={100} value={item.progress ?? 0} /> : null}
            <div>
              <button disabled={index === 0} onClick={() => move(index, -1)} type="button">上移</button>
              <button disabled={index === items.length - 1} onClick={() => move(index, 1)} type="button">下移</button>
              {item.status === "failed" ? <button onClick={() => onRetry?.(item.id)} type="button">重试</button> : null}
              <button onClick={() => onItemsChange?.(items.filter(({ id }) => id !== item.id))} type="button">移除</button>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
