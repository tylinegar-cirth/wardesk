import type { Metadata } from "next";
import { essayBySlug } from "@/data/studio-essays";

// Per-essay title and description for search results and link previews.
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const essay = essayBySlug(params.slug);
  if (!essay) return {};
  const url = `/studio/essays/${essay.slug}`;
  return {
    title: essay.title,
    description: essay.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: essay.title,
      description: essay.summary,
      authors: ["Ty Linegar"],
      images: [{ url: "/og-studio.jpg", width: 1200, height: 630, alt: "War Desk Studio" }],
    },
  };
}

export default function EssayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
