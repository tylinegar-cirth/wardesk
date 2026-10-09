import type { MetadataRoute } from "next";

// Served at /robots.txt. Public studio pages are open; the portals, internal
// tools, API and the unlisted sales deck are kept out of search.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/portal",
          "/studio-portal",
          "/advisor",
          "/admin",
          "/studio/login",
          "/studio/preview",
          "/studio/mythic",
          "/studiodeck",
        ],
      },
    ],
    sitemap: "https://www.thewardesk.com/sitemap.xml",
    host: "https://www.thewardesk.com",
  };
}
