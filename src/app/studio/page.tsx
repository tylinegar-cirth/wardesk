import type { Metadata } from "next";
import StudioPageContent from "@/components/studio/StudioPageContent";

export const metadata: Metadata = {
  title: { absolute: "War Desk Studio | Film and content for defense and hard tech" },
  alternates: { canonical: "/studio" },
};

export default function StudioPage() {
  return <StudioPageContent />;
}
