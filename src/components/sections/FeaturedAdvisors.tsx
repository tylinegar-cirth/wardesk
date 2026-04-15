"use client";

import { advisors, Advisor } from "@/data/advisors";
import Stars from "@/components/ui/Stars";
import Reveal from "@/components/ui/Reveal";

const fourStars = advisors.filter((a) => a.stars >= 4);

export default function FeaturedAdvisors({
  onSelect,
}: {
  onSelect: (a: Advisor) => void;
}) {
  return (
    <div>
      <Reveal>
        <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          Four-Star Access
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-serif text-[clamp(28px,3.8vw,42px)] font-normal text-wd-text mb-3 leading-[1.1]">
          The highest echelon.
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="font-sans text-[15px] text-wd-muted mb-10 max-w-[500px] leading-relaxed">
          Former combatant commanders, service vice chiefs, and fleet
          commanders. The people who made the decisions.
        </p>
      </Reveal>

      <div className="grid grid-cols-3 gap-5 mb-16 max-[768px]:grid-cols-2 max-[768px]:gap-3 max-[480px]:gap-2.5">
        {fourStars.slice(0, 3).map((a, i) => (
          <Reveal key={a.id} delay={0.1 + i * 0.12} scale>
            <div
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] max-[768px]:last:hidden max-[480px]:rounded-xl"
              onClick={() => onSelect(a)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.image}
                alt={a.name}
                className="w-full h-full object-cover dark:grayscale-[50%] dark:brightness-[0.85] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:!grayscale-0 group-hover:!brightness-100 group-hover:scale-105"
              />
              {/* Info overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 py-7 px-6 z-[2]"
                style={{
                  background:
                    "linear-gradient(transparent, rgb(var(--wd-bg) / 0.95) 50%)",
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Stars count={a.stars} size={10} />
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted">
                    {a.branch}
                  </span>
                </div>
                <div className="font-serif text-[clamp(20px,2.2vw,26px)] text-wd-text mb-0.5">
                  {a.name}
                </div>
                <div className="font-sans text-[13px] text-wd-sub">
                  {a.title}
                </div>
              </div>
              {/* Border overlay */}
              <div className="absolute inset-0 rounded-2xl border border-wd-overlay/[0.04] pointer-events-none transition-[border-color] duration-300 group-hover:border-wd-overlay/10" />
              {/* Gold edge */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px] z-[3] rounded-b-2xl scale-x-0 transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #D4A843, transparent)",
                }}
              />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
