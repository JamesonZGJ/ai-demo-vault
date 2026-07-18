import type { MetadataRoute } from "next";

import { getSiteUrl } from "../lib/catalog/site-url";
import { getPublishedSlugs } from "../lib/demos/search";
import { getCapabilities } from "../lib/capabilities/catalog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const demos = await getPublishedSlugs();
  const staticPages: MetadataRoute.Sitemap = [
    { changeFrequency: "daily", priority: 1, url: siteUrl.toString() },
    {
      changeFrequency: "daily",
      priority: 0.9,
      url: new URL("/explore", siteUrl).toString(),
    },
    { changeFrequency: "weekly", priority: 0.7, url: new URL("/bundles", siteUrl).toString() },
    { changeFrequency: "yearly", priority: 0.4, url: new URL("/about", siteUrl).toString() },
    { changeFrequency: "yearly", priority: 0.3, url: new URL("/license", siteUrl).toString() },
    { changeFrequency: "yearly", priority: 0.3, url: new URL("/copyright", siteUrl).toString() },
    {
      changeFrequency: "yearly",
      priority: 0.3,
      url: new URL("/privacy", siteUrl).toString(),
    },
  ];

  return [
    ...staticPages,
    ...getCapabilities().map((capability) => ({
      changeFrequency: "weekly" as const,
      priority: capability.previewStatus === "preview_ready" ? 0.8 : 0.5,
      url: new URL(`/explore/${capability.slug}`, siteUrl).toString(),
    })),
    ...demos.map((demo) => ({
      changeFrequency: "weekly" as const,
      lastModified: new Date(demo.updated_at),
      priority: 0.7,
      url: new URL(`/demos/${demo.slug}`, siteUrl).toString(),
    })),
  ];
}
