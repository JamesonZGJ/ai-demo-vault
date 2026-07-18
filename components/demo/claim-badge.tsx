import { claimKindLabels } from "../../lib/demos/labels";
import type { ClaimKind } from "../../lib/demos/types";

export function ClaimBadge({ kind }: { kind: ClaimKind }) {
  return <span className={`claim-badge claim-badge-${kind}`}>{claimKindLabels[kind]}</span>;
}
