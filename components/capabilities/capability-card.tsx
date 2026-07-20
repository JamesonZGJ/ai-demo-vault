import Link from "next/link";

import type { Capability } from "../../lib/capabilities/types";

function assetState(capability: Capability, label: string) {
  return capability.packageAssets.find((asset) => asset.label === label)?.status === "ready" ? "Ready" : "Planned";
}

export function CapabilityCard({ capability }: { capability: Capability }) {
  const previewLabel = capability.previewStatus === "preview_ready" ? "Live preview" : "Preview planned";
  const sourceLabel = capability.sourceStatus === "self_owned_prototype" ? "Source ready" : "Source planned";
  const promptLabel = assetState(capability, "Cursor Prompt") === "Ready" ? "Prompt included" : "Prompt planned";
  const previewPrice = capability.priceDisplay?.split(" · ")[0] ?? "Preview price";
  return (
    <article className="capability-card marketplace-block-card">
      <Link className="capability-card-preview-link" href={`/explore/${capability.slug}`}>
        <div className="capability-card-preview"><span className="capability-card-index">{capability.categoryZh ?? capability.category}</span><span className={`capability-status-dot ${capability.previewStatus === "preview_ready" ? "is-ready" : ""}`} /><span className="capability-card-preview-mark">{capability.previewStatus === "preview_ready" ? "LIVE PREVIEW" : "PREVIEW IN PREPARATION"}</span><strong>{capability.displayNameZh ?? capability.name}</strong><small>{capability.summary}</small><span className="capability-card-preview-arrow" aria-hidden="true">↗</span></div>
      </Link>
      <div className="capability-card-body">
        <div className="capability-card-topline"><span>BUILD BLOCK</span><span>{capability.difficulty}</span></div>
        <h2><Link href={`/explore/${capability.slug}`}>{capability.displayNameZh ?? capability.name}</Link></h2>
        <p>{capability.description}</p>
        <div className="capability-card-includes" aria-label="Package contents"><span>Preview</span><span>{sourceLabel}</span><span>{promptLabel}</span></div>
        <div className="capability-card-footer"><div><strong>{previewPrice}</strong><span>{previewLabel} · preview price</span></div><Link className="capability-card-cta" href={`/explore/${capability.slug}`}>View Block <span aria-hidden="true">↗</span></Link></div>
      </div>
    </article>
  );
}
