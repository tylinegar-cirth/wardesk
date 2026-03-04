"use client";

import { useState } from "react";
import { Advisor } from "@/data/advisors";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import FeaturedAdvisors from "@/components/sections/FeaturedAdvisors";
import AdvisorGrid from "@/components/sections/AdvisorGrid";
import ShowSection from "@/components/sections/ShowSection";
import Enterprise from "@/components/sections/Enterprise";
import Studio from "@/components/sections/Studio";
import Footer from "@/components/sections/Footer";
import AdvisorModal from "@/components/modals/AdvisorModal";

export default function Home() {
  const [selected, setSelected] = useState<Advisor | null>(null);

  return (
    <>
      <div className="wd-app">
        <Nav />
        <Hero />
        <Stats />
        <section id="advisors" className="py-[clamp(56px,9vw,110px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto">
          <FeaturedAdvisors onSelect={setSelected} />
          <AdvisorGrid onSelect={setSelected} />
        </section>
        <ShowSection />
        <Enterprise />
        <Studio />
        <Footer />
      </div>

      {selected && (
        <AdvisorModal
          advisor={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
