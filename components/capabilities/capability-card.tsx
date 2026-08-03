import Link from "next/link";

import { difficultyLabels, getCapabilityAccessLabel } from "../../lib/capabilities/catalog";
import { getMarketplaceCategoryLabel } from "../../lib/capabilities/marketplace-taxonomy";
import type { Capability } from "../../lib/capabilities/types";
import { CapabilityPreview } from "./capability-preview";

function assetReady(capability: Capability, label: string) {
  return capability.packageAssets.some((asset) => asset.label === label && asset.status === "ready");
}

export function CapabilityCard({ capability }: { capability: Capability }) {
  const displayName = capability.displayNameZh ?? capability.name;
  const previewReady = capability.previewStatus === "preview_ready";
  const sourceReady = capability.sourceStatus === "self_owned_prototype" && assetReady(capability, "自研源码");
  const promptReady = assetReady(capability, "Cursor 提示词") || assetReady(capability, "Claude 提示词");
  const accessLabel = getCapabilityAccessLabel(capability);
  const primaryStack = capability.stack.slice(0, 2).join(" · ");

  return (
    <article className="capability-card vault-block-card">
      <div className="vault-card-preview">
        <div aria-hidden="true" className="vault-card-preview-live" inert>
          <div className="vault-card-preview-scale"><CapabilityPreview slug={capability.slug} /></div>
        </div>
        <span className={`vault-card-live-state ${previewReady ? "is-ready" : ""}`}><i />{previewReady ? "Live Demo" : "Preview"}</span>
        <div className="vault-card-hover-actions">
          <Link href={`/explore/${capability.slug}#preview`}>在线预览</Link>
          <Link href={`/explore/${capability.slug}`}>查看模块 ↗</Link>
        </div>
      </div>

      <div className="vault-card-info">
        <div className="vault-card-title-row">
          <div><h2><Link href={`/explore/${capability.slug}`}>{displayName}</Link></h2><span>{capability.name}</span></div>
          <button aria-label={`收藏${displayName}，功能暂未开放`} disabled title="收藏功能暂未开放" type="button">♡</button>
        </div>
        <div className="vault-card-meta"><span>{getMarketplaceCategoryLabel(capability)}</span><span>{primaryStack}</span></div>
        <div className="vault-card-footer">
          <div><span>{difficultyLabels[capability.difficulty]}</span><span>{sourceReady ? "源码" : "仅预览"}</span>{promptReady ? <span>Prompt</span> : null}</div>
          <strong>{accessLabel}</strong>
        </div>
      </div>
    </article>
  );
}
