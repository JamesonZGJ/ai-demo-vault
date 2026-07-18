import type { Capability } from "../../lib/capabilities/types";
import { CapabilityCard } from "./capability-card";

export function CapabilityGrid({ capabilities }: { capabilities: Capability[] }) {
  return <div className="capability-grid">{capabilities.map((capability) => <CapabilityCard capability={capability} key={capability.id} />)}</div>;
}
