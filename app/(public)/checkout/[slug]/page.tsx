import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Blueprint 免费内容",
};

export default async function BlueprintCheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/blueprints/${encodeURIComponent(slug)}`);
}
