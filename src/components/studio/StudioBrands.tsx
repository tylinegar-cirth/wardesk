"use client";

import Reveal from "@/components/ui/Reveal";
import CornerBrackets from "@/components/ui/CornerBrackets";

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
      {/* Section dividers */}
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

      <section className="relative py-[clamp(72px,10vw,128px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto overflow-hidden">
        <CornerBrackets size={24} inset={12} color="rgba(212,168,67,0.5)" strokeWidth={1} />

        {/* Giant ghost wordmark background */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        >
          <span
            className="font-serif italic text-[clamp(140px,22vw,320px)] font-normal leading-none tracking-[-0.04em] text-wd-text/[0.025] whitespace-nowrap"
          >
            Credits
          </span>
        </div>

        {/* Asymmetric header */}
        <Reveal>
          <div className="relative mb-12 flex items-start justify-between gap-8">
            <div className="flex-1 max-w-[680px]">
              <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-4">
                Credits // Past Lives
              </div>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] font-normal text-wd-text leading-[1.02] tracking-[-0.01em]">
                The work <span className="italic text-wd-gold/90">behind</span> the work.
              </h2>
              <p className="font-sans text-[13px] font-light text-wd-sub leading-[1.65] max-w-[520px] mt-3">
                Featured credits from the team&apos;s previous lives — across
                defense, automotive, entertainment, and global brand campaigns.
              </p>
            </div>
            <div className="hidden md:block pt-1 text-right">
              <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-wd-muted leading-[1.8]">
                Record // 00
                <br />
                <span className="text-wd-gold/80">Legacy</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Brand grid — confident, large, white */}
        <Reveal delay={0.1}>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 md:gap-y-8">
            {brands.map((brand, i) => (
              <div
                key={brand}
                className="group flex items-center gap-3 border-b border-wd-border/50 pb-4 hover:border-wd-gold/40 transition-colors duration-400"
              >
                <span className="font-mono text-[9px] tracking-[0.15em] text-wd-muted group-hover:text-wd-gold/70 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-[clamp(16px,1.6vw,20px)] text-wd-text group-hover:text-wd-gold transition-colors duration-400 leading-tight">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
