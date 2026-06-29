"use client";

import { useEffect } from "react";
import StudioAmbient from "@/components/studio/StudioAmbient";
import StudioNav from "@/components/studio/StudioNav";
import StudioHero from "@/components/studio/StudioHero";
import StudioServicesV3 from "@/components/studio/StudioServicesV3";
import StudioBrands from "@/components/studio/StudioBrands";
import StudioTeamV2 from "@/components/studio/StudioTeamV2";
import StudioContact from "@/components/studio/StudioContact";
import StudioFooter from "@/components/studio/StudioFooter";

// Shared studio page body. `scrollTo` is the section id to land on at mount
// (used by the /credits deep-link route). Falls back to the URL hash so
// /studio#credits-style links work too. Intent comes from a prop, not the
// pathname, so it survives the App Router's production URL normalization.
export default function StudioPageContent({
  scrollTo,
}: {
  scrollTo?: string;
}) {
  useEffect(() => {
    const target =
      scrollTo || (window.location.hash ? window.location.hash.slice(1) : "");
    if (!target) return;
    const NAV = 88; // clear the fixed nav (~80px)
    // Stop the App Router from restoring scroll to top after we've positioned.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    let tries = 0;
    const id = setInterval(() => {
      const el = document.getElementById(target);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - NAV;
        // Re-assert with an absolute, instant scroll (the page sets
        // scroll-behavior: smooth globally, which we override here). Keep
        // nudging while the hero/sections settle and shift the target.
        window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
      }
      if (++tries >= 25) clearInterval(id); // ~3.75s of re-asserts
    }, 150);
    return () => clearInterval(id);
  }, [scrollTo]);

  return (
    <div className="wd-app">
      <StudioAmbient />
      <StudioNav />
      <StudioHero />
      <StudioServicesV3 />
      <StudioBrands />
      <StudioTeamV2 />
      <StudioContact />
      <StudioFooter />
    </div>
  );
}
