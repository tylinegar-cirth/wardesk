"use client";

import StudioNav from "@/components/studio/StudioNav";
import StudioHero from "@/components/studio/StudioHero";
import StudioServicesV2 from "@/components/studio/StudioServicesV2";
import StudioBrands from "@/components/studio/StudioBrands";
import StudioTeam from "@/components/studio/StudioTeam";
import StudioEcosystem from "@/components/studio/StudioEcosystem";
import StudioContact from "@/components/studio/StudioContact";
import StudioFooter from "@/components/studio/StudioFooter";

export default function StudioPreview() {
  return (
    <div className="wd-app">
      <StudioNav />
      <StudioHero />
      <StudioServicesV2 />
      <StudioBrands />
      <StudioTeam />
      <StudioEcosystem />
      <StudioContact />
      <StudioFooter />
    </div>
  );
}
