import { NextResponse } from "next/server";

import { getBlueprintLibraryEntry } from "../../../../../../lib/blueprints/catalog";
import { isLocalBlueprintPilot } from "../../../../../../lib/env";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!isLocalBlueprintPilot()) return new NextResponse(null, { status: 404 });

  const { slug } = await params;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) {
    return new NextResponse(null, { status: 404 });
  }

  const entry = await getBlueprintLibraryEntry(slug);
  if (!entry) return new NextResponse(null, { status: 404 });

  const content = [
    `# ${entry.product.name} · 资料样品`,
    "",
    `版本：${entry.product.version}`,
    "获取方式：本地试用访问权（不代表支付、订单或客户许可）",
    "",
    ...entry.resources.flatMap((resource, index) => [
      `## ${String(index + 1).padStart(2, "0")} · ${resource.title}`,
      "",
      resource.summary,
      "",
      ...resource.content.map((item) => `- ${item}`),
      "",
    ]),
  ].join("\n");

  return new NextResponse(content, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${slug}-blueprint-sample.md"`,
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
