"use client";

import StudioAmbient from "@/components/studio/StudioAmbient";
import StudioNav from "@/components/studio/StudioNav";
import StudioHero from "@/components/studio/StudioHero";
import StudioTicker from "@/components/studio/StudioTicker";
import StudioServicesV3 from "@/components/studio/StudioServicesV3";
import StudioEcosystem from "@/components/studio/StudioEcosystem";
import StudioBrands from "@/components/studio/StudioBrands";
import StudioTeamV2 from "@/components/studio/StudioTeamV2";
import StudioInterstitial from "@/components/studio/StudioInterstitial";
import StudioContact from "@/components/studio/StudioContact";
import StudioFooter from "@/components/studio/StudioFooter";

export default function StudioPage() {
  return (
    <div className="wd-app">
      <StudioAmbient />
      <StudioNav />
      <StudioHero />
      <StudioTicker />
      <StudioServicesV3 />
      <StudioBrands />
      <StudioTeamV2 />
      <StudioInterstitial />
      <StudioEcosystem />
      <StudioContact />
      <StudioFooter />
    </div>
  );
}
