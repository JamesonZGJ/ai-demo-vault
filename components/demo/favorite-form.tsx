"use client";

import { useActionState } from "react";

import {
  setFavoriteAction,
  type FavoriteActionState,
} from "../../lib/favorites/actions";
import { FavoriteSubmitButton } from "./favorite-submit-button";

const initialState: FavoriteActionState = { error: null };

interface FavoriteFormProps {
  demoId: string;
  demoName: string;
  isFavorited: boolean;
  returnTo: string;
  variant?: "default" | "quiet";
}

export function FavoriteForm({
  demoId,
  demoName,
  isFavorited,
  returnTo,
  variant = "default",
}: FavoriteFormProps) {
  const [state, action] = useActionState(
    setFavoriteAction.bind(null, demoId, !isFavorited, returnTo),
    initialState,
  );

  return (
    <form action={action} className="favorite-form">
      <FavoriteSubmitButton
        demoName={demoName}
        isFavorited={isFavorited}
        variant={variant}
      />
      {state.error ? (
        <span aria-live="polite" className="favorite-error" role="status">
          {state.error}
        </span>
      ) : null}
    </form>
  );
}
