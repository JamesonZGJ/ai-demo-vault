"use client";

import { useFormStatus } from "react-dom";

interface FavoriteSubmitButtonProps {
  demoName: string;
  isFavorited: boolean;
  variant?: "default" | "quiet";
}

export function FavoriteSubmitButton({
  demoName,
  isFavorited,
  variant = "default",
}: FavoriteSubmitButtonProps) {
  const { pending } = useFormStatus();
  const action = isFavorited ? "取消收藏" : "收藏";

  return (
    <button
      aria-busy={pending}
      aria-label={`${action}《${demoName}》`}
      aria-pressed={isFavorited}
      className={
        variant === "quiet"
          ? "button button-quiet"
          : isFavorited
            ? "favorite-button is-favorited"
            : "favorite-button"
      }
      disabled={pending}
      type="submit"
    >
      {pending ? "处理中" : action}
    </button>
  );
}
