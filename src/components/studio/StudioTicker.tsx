"use client";

import MarqueeTicker from "@/components/ui/MarqueeTicker";

const intelItems = [
  <span key="1" className="font-display text-wd-bone text-[clamp(32px,5vw,64px)] leading-none tracking-[-0.02em] uppercase">Business Is War</span>,
  <span key="2" className="font-serif italic text-wd-gold text-[clamp(32px,5vw,64px)] leading-none tracking-[-0.01em]">We forge your legend.</span>,
  <span key="3" className="font-display text-wd-bone/70 text-[clamp(32px,5vw,64px)] leading-none tracking-[-0.02em] uppercase">Hard Tech · Defense · Aerospace</span>,
  <span key="4" className="font-serif italic text-wd-gold/80 text-[clamp(32px,5vw,64px)] leading-none tracking-[-0.01em]">The craft in service of something real.</span>,
  <span key="5" className="font-display text-wd-bone text-[clamp(32px,5vw,64px)] leading-none tracking-[-0.02em] uppercase">Est. 2026 — El Segundo, CA</span>,
];

export default function StudioTicker() {
  return (
    <section aria-hidden="true" className="relative border-y border-wd-gold/25 bg-wd-bg overflow-hidden">
      <div className="py-8">
        <MarqueeTicker items={intelItems} speed="normal" divider="/" />
      </div>
    </section>
  );
}
