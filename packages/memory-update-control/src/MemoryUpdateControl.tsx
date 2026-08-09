"use client";

export type MemoryItem = {
  id: string;
  source?: string;
  value: string;
};

export type MemoryUpdateControlProps = {
  memories: MemoryItem[];
  onMemoriesChange?: (memories: MemoryItem[]) => void;
  temporary?: boolean;
};

export function removeMemoryItem(memories: MemoryItem[], id: string) {
  return memories.filter((memory) => memory.id !== id);
}

export function MemoryUpdateControl({ memories, onMemoriesChange, temporary = false }: MemoryUpdateControlProps) {
  if (temporary) {
    return <section className="memory-control-block" data-temporary><strong>临时会话</strong><p>本次对话不会使用或新增记忆。</p></section>;
  }

  return (
    <section aria-label="AI 记忆管理" className="memory-control-block">
      <header><div><span>记忆已更新</span><strong>AI 记住了这些内容</strong></div><span>{memories.length} 条</span></header>
      <div>
        {memories.map((memory) => (
          <article key={memory.id}>
            <input
              aria-label="记忆内容"
              onChange={(event) => onMemoriesChange?.(memories.map((item) => item.id === memory.id ? { ...item, value: event.currentTarget.value } : item))}
              value={memory.value}
            />
            <small>{memory.source ?? "来自当前对话"}</small>
            <button onClick={() => onMemoriesChange?.(removeMemoryItem(memories, memory.id))} type="button">忘记</button>
          </article>
        ))}
      </div>
    </section>
  );
}
