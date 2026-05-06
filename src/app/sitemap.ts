import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://painspections.org";
  return [
    { url: base + "/", priority: 1 },
    { url: base + "/pay" },
    { url: base + "/services" },
    { url: base + "/about" },
    { url: base + "/contact" },
  ];
}

