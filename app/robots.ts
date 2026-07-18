import type { MetadataRoute } from "next";

import { getSiteUrl } from "../lib/catalog/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      allow: ["/", "/explore", "/demos", "/bundles", "/about", "/license", "/copyright", "/privacy"],
      disallow: [
        "/account/",
        "/auth/",
        "/blueprints",
        "/checkout/",
        "/favorites",
        "/login",
        "/register",
      ],
      userAgent: "*",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
