import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://www.empire-inspections.example";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: base + "/sitemap.xml",
  };
}

