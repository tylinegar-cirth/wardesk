import type { Metadata } from "next";
import StudioPageContent from "@/components/studio/StudioPageContent";

// Same page as /studio, so point search engines at /studio as the one to index.
export const metadata: Metadata = {
  title: "Credits",
  alternates: { canonical: "/studio" },
};

// Real route (not a rewrite) so the /credits URL stays put — a rewrite to
// /studio gets normalized to /studio in the production App Router build.
// Renders the studio page and lands on the credits section on mount.
export default function CreditsPage() {
  return <StudioPageContent scrollTo="credits" />;
}
