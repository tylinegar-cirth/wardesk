"use client";

import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";

const stats = [
  { v: "1000", s: "+", l: "Years of gov't service" },
  { v: "66", s: "", l: "Senior advisors" },
  { v: "7", s: "", l: "Four-star commanders" },
  { v: "", s: "TS/SCI", l: "Cleared network" },
];

export default function Stats() {
  return (
    <Reveal>
      <div className="flex justify-center gap-[clamp(24px,5vw,72px)] flex-wrap py-11 px-[clamp(20px,4vw,48px)] relative">
        {/* Top divider */}
        <div className="absolute top-0 left-[5%] right-[5%] h-px" style={{ background: "linear-gradient(90deg,transparent,var(--wd-divider),transparent)" }} />
        {/* Bottom divider */}
        <div className="absolute bottom-0 left-[5%] right-[5%] h-px" style={{ background: "linear-gradient(90deg,transparent,var(--wd-divider),transparent)" }} />

        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.12}>
            <div className="text-center min-w-[100px]">
              <div className="font-serif text-[clamp(22px,2.8vw,28px)] text-wd-text mb-1">
                {s.v ? <Counter target={s.v} suffix={s.s} /> : s.s}
              </div>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted">
                {s.l}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Reveal>
  );
}
