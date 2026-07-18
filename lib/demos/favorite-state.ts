import { createClient } from "../supabase/server";
import { isPreviewMockMode } from "../env";

export async function getFavoriteState(
  demoIds: string[],
): Promise<Set<string> | null> {
  if (isPreviewMockMode()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  if (demoIds.length === 0) return new Set<string>();

  const uniqueIds = [...new Set(demoIds)];
  const { data, error } = await supabase
    .from("favorites")
    .select("demo_id")
    .in("demo_id", uniqueIds);

  if (error) throw new Error("收藏状态读取失败", { cause: error });
  return new Set(data.map(({ demo_id }) => demo_id));
}
