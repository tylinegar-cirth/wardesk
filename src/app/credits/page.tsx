import StudioPageContent from "@/components/studio/StudioPageContent";

// Real route (not a rewrite) so the /credits URL stays put — a rewrite to
// /studio gets normalized to /studio in the production App Router build.
// Renders the studio page and lands on the credits section on mount.
export default function CreditsPage() {
  return <StudioPageContent scrollTo="credits" />;
}
