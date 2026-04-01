"use client";

import Reveal from "@/components/ui/Reveal";

const brands = [
  "Dept of War",
  "Boeing",
  "Viasat",
  "Toyota",
  "Ferrari",
  "Audi",
  "Starlink",
  "Sony Pictures",
  "Mercedes-Benz",
  "Netflix",
  "McDonald's",
  "Coca-Cola",
  "Shell",
  "GE",
  "Universal",
  "Warner Bros",
];

export default function StudioBrands() {
  return (
    <div className="relative">
      <div
        className="absolute top-0 left-[5%] right-[5%] h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,var(--wd-divider),transparent)",
        }}
      />
      <Reveal>
        <section className="py-[clamp(36px,5vw,56px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto text-center">
          <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-muted mb-5">
            Brands We&apos;ve Worked For
          </div>
          <div className="font-sans text-[15px] font-medium text-wd-sub leading-relaxed flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
            {brands.map((brand, i) => (
              <span key={brand} className="flex items-center gap-2">
                <span className="hover:text-wd-text transition-colors cursor-default">
                  {brand}
                </span>
                {i < brands.length - 1 && (
                  <span className="text-wd-gold/40 text-xs">◆</span>
                )}
              </span>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
