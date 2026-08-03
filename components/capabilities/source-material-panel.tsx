"use client";

import { useState } from "react";

import type { CapabilityMaterial } from "../../lib/capabilities/package-materials";

export function SourceMaterialPanel({ materials }: { materials: CapabilityMaterial[] }) {
  const [activeId, setActiveId] = useState(materials[0]?.id ?? "source");
  const [copied, setCopied] = useState(false);
  const active = materials.find(({ id }) => id === activeId) ?? materials[0];

  if (!active) {
    return (
      <div className="vault-source-empty" id="materials">
        <span>资料状态</span>
        <strong>当前只有在线预览</strong>
        <p>没有真实源码或 Prompt 文件，因此这里不会显示可复制内容。</p>
      </div>
    );
  }

  async function copyActive() {
    if (!active) return;
    await navigator.clipboard.writeText(active.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="vault-source-panel" id="materials">
      <div className="vault-source-tabs" role="tablist" aria-label="真实资料">
        {materials.map((material) => <button aria-selected={active.id === material.id} className={active.id === material.id ? "is-active" : ""} key={material.id} onClick={() => { setActiveId(material.id); setCopied(false); }} role="tab" type="button">{material.label}</button>)}
      </div>
      <div className="vault-source-toolbar"><span>{active.language}</span><button onClick={copyActive} type="button">{copied ? "已复制" : "复制"}</button></div>
      <pre><code>{active.content}</code></pre>
    </div>
  );
}
