import type { MetadataRoute } from "next";

const siteUrl = "https://pratik-kubal.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/ucd-faq-demo"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
