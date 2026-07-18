import { DemoCard } from "./demo-card";
import { FavoriteControl } from "./favorite-control";
import type { DemoCardData } from "../../lib/demos/types";

interface DemoGridProps {
  demos: DemoCardData[];
  eagerMediaCount?: number;
  favoriteState: Set<string> | null;
  returnTo: string;
}

export function DemoGrid({
  demos,
  eagerMediaCount = 0,
  favoriteState,
  returnTo,
}: DemoGridProps) {
  return (
    <div className="demo-grid">
      {demos.map((demo, index) => (
        <DemoCard
          demo={demo}
          eagerMedia={index < eagerMediaCount}
          favoriteControl={
            <FavoriteControl
              demoId={demo.id}
              demoName={demo.name}
              isFavorited={favoriteState?.has(demo.id) ?? null}
              returnTo={returnTo}
            />
          }
          key={demo.id}
        />
      ))}
    </div>
  );
}
