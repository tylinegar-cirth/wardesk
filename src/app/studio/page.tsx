"use client";

import StudioNav from "@/components/studio/StudioNav";
import StudioHero from "@/components/studio/StudioHero";
import StudioServices from "@/components/studio/StudioServices";
import StudioEcosystem from "@/components/studio/StudioEcosystem";
import StudioBrands from "@/components/studio/StudioBrands";
import StudioTeam from "@/components/studio/StudioTeam";
import StudioContact from "@/components/studio/StudioContact";
import StudioFooter from "@/components/studio/StudioFooter";

export default function StudioPage() {
  return (
    <div className="wd-app">
      <StudioNav />
      <StudioHero />
      <StudioServices />
      <StudioBrands />
      <StudioTeam />
      <StudioEcosystem />
      <StudioContact />
      <StudioFooter />
    </div>
  );
}
