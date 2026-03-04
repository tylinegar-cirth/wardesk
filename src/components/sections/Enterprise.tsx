"use client";

import Reveal from "@/components/ui/Reveal";

export default function Enterprise() {
  return (
    <Reveal>
      <section className="mx-[clamp(16px,4vw,72px)] p-[clamp(40px,5vw,72px)] bg-wd-surface border border-wd-border rounded-3xl grid grid-cols-[2fr_1fr] gap-12 items-center shadow-wd-card backdrop-blur-[8px] max-[1024px]:grid-cols-1 max-[768px]:mx-4 max-[768px]:grid-cols-1 max-[768px]:rounded-2xl">
        <div>
          <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
            Enterprise
          </div>
          <h2 className="font-serif text-[clamp(24px,3.2vw,32px)] font-normal text-wd-text mb-3.5 leading-[1.2]">
            Need a team, not a call?
          </h2>
          <p className="font-sans text-[15px] font-light text-wd-sub leading-[1.7] max-w-[480px]">
            Multi-advisor engagements, capture strategy, M&A due diligence,
            board-level advisory. Cypress International&apos;s consulting practice
            stands behind every engagement.
          </p>
        </div>
        <div className="text-right max-[768px]:!text-left">
          <button className="font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-8 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98]">
            Contact Cypress →
          </button>
        </div>
      </section>
    </Reveal>
  );
}
