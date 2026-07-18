import Link from "next/link";

import type { Capability } from "../../lib/capabilities/types";

export function CapabilityCard({ capability }: { capability: Capability }) {
  const previewLabel = capability.previewStatus === "preview_ready" ? "Preview ready" : "Preview planned";
  const packageLabel = capability.packageStatus === "ready_for_checkout" ? "Package assets ready" : "Package in preparation";
  return (
    <article className="capability-card">
      <Link className="capability-card-preview-link" href={`/explore/${capability.slug}`}>
        <div className="capability-card-preview"><span className="capability-card-index">{capability.category}</span><span className={`capability-status-dot ${capability.previewStatus === "preview_ready" ? "is-ready" : ""}`} />{capability.previewStatus === "preview_ready" ? <span className="capability-card-preview-mark">LIVE PREVIEW</span> : <span className="capability-card-preview-mark">IN THE WORKSHOP</span>}<strong>{capability.name}</strong><small>{capability.summary}</small></div>
      </Link>
      <div className="capability-card-body">
        <div className="capability-card-topline"><span>{capability.category}</span><span>{capability.difficulty}</span></div>
        <h2><Link href={`/explore/${capability.slug}`}>{capability.name}</Link></h2>
        <p>{capability.description}</p>
        <div className="capability-tag-row">{capability.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="capability-card-footer"><div><span>{previewLabel}</span><span>{packageLabel}</span></div><Link className="capability-card-cta" href={`/explore/${capability.slug}`}>View capability <span aria-hidden="true">↗</span></Link></div>
      </div>
    </article>
  );
}
