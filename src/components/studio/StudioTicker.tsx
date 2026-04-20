"use client";

import MarqueeTicker from "@/components/ui/MarqueeTicker";

const intelItems = [
  <span key="1" className="font-display text-wd-bone text-[clamp(32px,5vw,64px)] leading-none tracking-[-0.02em] uppercase">Business Is War</span>,
  <span key="2" className="font-serif italic text-wd-gold text-[clamp(32px,5vw,64px)] leading-none tracking-[-0.01em]">We forge your legend.</span>,
  <span key="3" className="font-display text-wd-bone/70 text-[clamp(32px,5vw,64px)] leading-none tracking-[-0.02em] uppercase">Hard Tech · Defense · Aerospace</span>,
  <span key="4" className="font-serif italic text-wd-gold/80 text-[clamp(32px,5vw,64px)] leading-none tracking-[-0.01em]">The craft in service of something real.</span>,
  <span key="5" className="font-display text-wd-bone text-[clamp(32px,5vw,64px)] leading-none tracking-[-0.02em] uppercase">Est. 2026 — El Segundo, CA</span>,
];

const statusItems = [
  <span key="a" className="font-mono text-wd-gold/80 text-[11px] tracking-[0.28em] uppercase">{"// TRANSMISSION ACTIVE"}</span>,
  <span key="b" className="font-mono text-wd-muted text-[11px] tracking-[0.28em] uppercase">{"// N 33°55'09\" W 118°24'59\""}</span>,
  <span key="c" className="font-mono text-wd-gold/80 text-[11px] tracking-[0.28em] uppercase">{"// FIELD TESTED — STATUS: ACTIVE"}</span>,
  <span key="d" className="font-mono text-wd-muted text-[11px] tracking-[0.28em] uppercase">{"// CLASSIFIED — OPS: WD-2026-01"}</span>,
  <span key="e" className="font-mono text-wd-gold/80 text-[11px] tracking-[0.28em] uppercase">{"// FOR NATIONAL IMPORTANCE"}</span>,
  <span key="f" className="font-mono text-wd-muted text-[11px] tracking-[0.28em] uppercase">{"// MADE IN USA — CONTINUOUS OPERATION"}</span>,
];

export default function StudioTicker() {
  return (
    <section aria-hidden="true" className="relative border-y border-wd-gold/25 bg-wd-bg overflow-hidden">
      <div className="py-3 border-b border-wd-gold/20">
        <MarqueeTicker items={statusItems} speed="fast" divider="◆" />
      </div>

      <div className="py-8">
        <MarqueeTicker items={intelItems} speed="normal" divider="/" />
      </div>

      <div className="py-3 border-t border-wd-gold/20">
        <MarqueeTicker items={statusItems} speed="fast" reverse divider="◆" />
      </div>
    </section>
  );
}
