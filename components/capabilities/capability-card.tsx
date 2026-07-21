import Link from "next/link";

import { difficultyLabels, getCategoryLabel } from "../../lib/capabilities/catalog";
import type { Capability } from "../../lib/capabilities/types";

function assetState(capability: Capability, label: string) {
  return capability.packageAssets.find((asset) => asset.label === label)?.status === "ready" ? "Ready" : "Planned";
}

export function CapabilityCard({ capability }: { capability: Capability }) {
  const previewLabel = capability.previewStatus === "preview_ready" ? "在线预览" : "预览准备中";
  const sourceLabel = capability.sourceStatus === "self_owned_prototype" ? "源码已准备" : "源码准备中";
  const promptLabel = assetState(capability, "Cursor 提示词") === "Ready" ? "提示词已包含" : "提示词准备中";
  const previewPrice = capability.priceDisplay?.split(" · ")[0] ?? "展示价格";
  return (
    <article className="capability-card marketplace-block-card">
      <Link className="capability-card-preview-link" href={`/explore/${capability.slug}`}>
        <div className="capability-card-preview"><span className="capability-card-index">{capability.categoryZh ?? getCategoryLabel(capability.category)}</span><span className={`capability-status-dot ${capability.previewStatus === "preview_ready" ? "is-ready" : ""}`} /><span className="capability-card-preview-mark">{capability.previewStatus === "preview_ready" ? "在线预览" : "预览准备中"}</span><strong>{capability.displayNameZh ?? capability.name}</strong><small>{capability.summary}</small><span className="capability-card-preview-arrow" aria-hidden="true">↗</span></div>
      </Link>
      <div className="capability-card-body">
        <div className="capability-card-topline"><span>可复用模块</span><span>{difficultyLabels[capability.difficulty]}</span></div>
        <h2><Link href={`/explore/${capability.slug}`}>{capability.displayNameZh ?? capability.name}</Link></h2>
        <p>{capability.description}</p>
        <div className="capability-card-includes" aria-label="模块内容"><span>在线预览</span><span>{sourceLabel}</span><span>{promptLabel}</span></div>
        <div className="capability-card-footer"><div><strong>{previewPrice}</strong><span>{previewLabel} · 展示价格</span></div><Link className="capability-card-cta" href={`/explore/${capability.slug}`}>查看模块 <span aria-hidden="true">↗</span></Link></div>
      </div>
    </article>
  );
}
