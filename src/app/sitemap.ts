import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.empire-inspections.example";
  return [
    { url: base + "/", priority: 1 },
    { url: base + "/services" },
    { url: base + "/about" },
    { url: base + "/contact" },
  ];
}

