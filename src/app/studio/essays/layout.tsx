import type { Metadata } from "next";

// The essays pages are client components, so their metadata lives here.
export const metadata: Metadata = {
  title: "Essays",
  description:
    "Why hard-tech companies need the thinking layer, not just the camera. Essays by Ty Linegar, War Desk Studio.",
  alternates: { canonical: "/studio/essays" },
};

export default function EssaysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
