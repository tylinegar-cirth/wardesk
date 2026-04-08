"use client";

import StudioAmbient from "@/components/studio/StudioAmbient";
import StudioNav from "@/components/studio/StudioNav";
import StudioHero from "@/components/studio/StudioHero";
import StudioServicesV2 from "@/components/studio/StudioServicesV2";
import StudioEcosystem from "@/components/studio/StudioEcosystem";
import StudioBrands from "@/components/studio/StudioBrands";
import StudioTeamV2 from "@/components/studio/StudioTeamV2";
import StudioContact from "@/components/studio/StudioContact";
import StudioFooter from "@/components/studio/StudioFooter";

export default function StudioPage() {
  return (
    <div className="wd-app">
      <StudioAmbient />
      <StudioNav />
      <StudioHero />
      <StudioServicesV2 />
      <StudioBrands />
      <StudioTeamV2 />
      <StudioEcosystem />
      <StudioContact />
      <StudioFooter />
    </div>
  );
}
