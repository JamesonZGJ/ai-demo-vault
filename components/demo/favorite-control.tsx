import Link from "next/link";

import { FavoriteForm } from "./favorite-form";

interface FavoriteControlProps {
  demoId: string;
  demoName: string;
  isFavorited: boolean | null;
  returnTo: string;
}

export function FavoriteControl({
  demoId,
  demoName,
  isFavorited,
  returnTo,
}: FavoriteControlProps) {
  if (isFavorited === null) {
    return (
      <Link
        aria-label={`收藏《${demoName}》`}
        className="favorite-login-link"
        href={`/login?${new URLSearchParams({ returnTo }).toString()}`}
      >
        收藏
      </Link>
    );
  }

  return (
    <FavoriteForm
      demoId={demoId}
      demoName={demoName}
      isFavorited={isFavorited}
      returnTo={returnTo}
    />
  );
}
