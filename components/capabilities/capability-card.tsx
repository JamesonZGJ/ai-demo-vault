import Link from "next/link";

import type { Capability } from "../../lib/capabilities/types";

function assetState(capability: Capability, label: string) {
  return capability.packageAssets.find((asset) => asset.label === label)?.status === "ready" ? "Ready" : "Planned";
}

export function CapabilityCard({ capability }: { capability: Capability }) {
  const previewLabel = capability.previewStatus === "preview_ready" ? "Live preview" : "Preview planned";
  const sourceLabel = capability.sourceStatus === "self_owned_prototype" ? "Source ready" : "Source planned";
  const promptLabel = assetState(capability, "Cursor Prompt") === "Ready" ? "Prompt included" : "Prompt planned";
  return (
    <article className="capability-card marketplace-block-card">
      <Link className="capability-card-preview-link" href={`/explore/${capability.slug}`}>
        <div className="capability-card-preview"><span className="capability-card-index">{capability.category}</span><span className={`capability-status-dot ${capability.previewStatus === "preview_ready" ? "is-ready" : ""}`} /><span className="capability-card-preview-mark">{capability.previewStatus === "preview_ready" ? "LIVE PREVIEW" : "PREVIEW IN PREPARATION"}</span><strong>{capability.name}</strong><small>{capability.summary}</small><span className="capability-card-preview-arrow" aria-hidden="true">↗</span></div>
      </Link>
      <div className="capability-card-body">
        <div className="capability-card-topline"><span>BUILD BLOCK</span><span>{capability.difficulty}</span></div>
        <h2><Link href={`/explore/${capability.slug}`}>{capability.name}</Link></h2>
        <p>{capability.description}</p>
        <div className="capability-tag-row">{capability.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="capability-card-includes" aria-label="Package contents"><span>Preview</span><span>{sourceLabel}</span><span>{promptLabel}</span></div>
        <div className="capability-card-footer"><div><strong>{capability.priceDisplay ?? "Mock price"}</strong><span>{previewLabel} · license notes on detail</span></div><div className="capability-card-actions"><button aria-label={`Save ${capability.name} (coming soon)`} className="capability-save-control" disabled type="button">♡</button><Link className="capability-card-cta" href={`/explore/${capability.slug}`}>View Block <span aria-hidden="true">↗</span></Link></div></div>
      </div>
    </article>
  );
}
