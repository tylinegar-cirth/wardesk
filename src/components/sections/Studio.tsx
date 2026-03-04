"use client";

import Reveal from "@/components/ui/Reveal";

export default function Studio() {
  return (
    <div className="relative">
      {/* Divider */}
      <div className="absolute top-0 left-[5%] right-[5%] h-px" style={{ background: "linear-gradient(90deg,transparent,var(--wd-divider),transparent)" }} />
      <Reveal>
        <section
          id="studio"
          className="py-[clamp(36px,5vw,64px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto flex justify-between items-center gap-6 flex-wrap"
        >
          <div>
            <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-2">
              War Desk Studio
            </div>
            <p className="font-sans text-[15px] font-light text-wd-sub max-w-[460px] leading-relaxed">
              Conference production, recruitment films, and brand strategy for
              hard tech companies.
            </p>
          </div>
          <button className="font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-8 bg-wd-overlay/[0.03] text-wd-sub border border-wd-border rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-[8px] hover:bg-wd-overlay/[0.07] hover:border-wd-border-hov hover:text-wd-text hover:-translate-y-px active:translate-y-0 active:scale-[0.98]">
            Visit studio →
          </button>
        </section>
      </Reveal>
    </div>
  );
}
