import type { MetadataRoute } from "next";
import { essays } from "@/data/studio-essays";

// Served at /sitemap.xml. Submit this URL in Google Search Console.
const BASE = "https://www.thewardesk.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/studio`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/studio/essays`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...essays.map((e) => ({
      url: `${BASE}/studio/essays/${e.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
