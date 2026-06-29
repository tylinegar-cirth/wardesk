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

export default function StudioPage() {
  // Deep link: /credits (and /studio#credits) lands on the credits section.
  // Capture intent at mount, then retry the scroll until the section settles
  // just under the fixed nav (the page hero/sections shift height as they load).
  useEffect(() => {
    const wantsCredits =
      window.location.pathname === "/credits" ||
      window.location.hash === "#credits";
    if (!wantsCredits) return;
    let tries = 0;
    const id = setInterval(() => {
      const el = document.getElementById("credits");
      if (el) {
        const top = el.getBoundingClientRect().top;
        // Landed: section top is parked just below the ~80px fixed nav.
        if (top > 50 && top < 150) {
          clearInterval(id);
          return;
        }
        el.scrollIntoView({ block: "start" });
      }
      if (++tries >= 15) clearInterval(id); // ~3s safety cap
    }, 200);
    return () => clearInterval(id);
  }, []);

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
