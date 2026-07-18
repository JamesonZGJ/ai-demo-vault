"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isLocalBlueprintPilot } from "../../../../lib/env";
import { createClient } from "../../../../lib/supabase/server";

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function checkoutError(slug: string, code: string) {
  return `/checkout/${encodeURIComponent(slug)}?${new URLSearchParams({ error: code })}`;
}

export async function acquireBlueprintPilot(formData: FormData) {
  const slug = field(formData, "slug");
  if (!isLocalBlueprintPilot() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) {
    redirect("/");
  }
  if (field(formData, "acknowledgement") !== "accepted") {
    redirect(checkoutError(slug, "ack-required"));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const returnTo = `/checkout/${slug}`;
    redirect(`/login?${new URLSearchParams({ returnTo })}`);
  }

  const { error } = await supabase.rpc("claim_blueprint_pilot", {
    p_blueprint_slug: slug,
  });
  if (error) redirect(checkoutError(slug, "claim-failed"));

  revalidatePath("/account/library");
  revalidatePath(`/blueprints/${slug}`);
  redirect(`/account/library/${slug}?acquired=1`);
}
