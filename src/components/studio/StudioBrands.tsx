"use client";

import Reveal from "@/components/ui/Reveal";

const brands = [
  "Dept of War",
  "Boeing",
  "Starlink",
  "Viasat",
  "Toyota",
  "Ferrari",
  "Audi",
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
      <div
        className="absolute bottom-0 left-[5%] right-[5%] h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,var(--wd-divider),transparent)",
        }}
      />
      <Reveal>
        <section className="py-[clamp(44px,6vw,72px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto text-center">
          <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold/60 mb-6">
            Credits // Past Lives
          </div>
          <div className="font-serif text-[clamp(17px,1.7vw,22px)] font-normal text-wd-text/90 leading-[1.5] flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 max-w-[1080px] mx-auto">
            {brands.map((brand, i) => (
              <span key={brand} className="flex items-center gap-3">
                <span className="hover:text-wd-gold transition-colors duration-300 cursor-default">
                  {brand}
                </span>
                {i < brands.length - 1 && (
                  <span className="text-wd-gold/50 text-[9px]">◆</span>
                )}
              </span>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
