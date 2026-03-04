"use client";

import { advisors } from "@/data/advisors";
import Reveal from "@/components/ui/Reveal";

const fourStars = advisors.filter((a) => a.stars >= 4);

export default function ShowSection() {
  return (
    <section id="live" className="py-[clamp(56px,9vw,110px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto relative">
      {/* Divider */}
      <div className="absolute top-0 left-[5%] right-[5%] h-px" style={{ background: "linear-gradient(90deg,transparent,var(--wd-divider),transparent)" }} />

      <div className="grid grid-cols-2 gap-[clamp(32px,5vw,72px)] items-center max-[768px]:grid-cols-1">
        <div>
          <Reveal>
            <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-4">
              War Desk Live
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-[clamp(28px,3.8vw,40px)] font-normal text-wd-text mb-5 leading-[1.12]">
              The conversation the industry actually needs.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="font-sans text-[15px] font-light text-wd-sub leading-[1.7] mb-9 max-w-[420px]">
              Every week, a senior defense leader sits down with a founder
              building the future. No scripts. No PR handlers. The signal you
              can&apos;t get anywhere else.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <button className="font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-8 bg-wd-overlay/[0.03] text-wd-sub border border-wd-border rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-[8px] hover:bg-wd-overlay/[0.07] hover:border-wd-border-hov hover:text-wd-text hover:-translate-y-px active:translate-y-0 active:scale-[0.98]">
              Coming soon
            </button>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="aspect-[16/10] rounded-[20px] relative overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] border border-wd-border hover:-translate-y-1 hover:shadow-[0_16px_56px_rgba(0,0,0,0.5)] flex items-center justify-center max-[480px]:rounded-[14px]">
            {/* Split face background */}
            <div className="absolute inset-0 flex rounded-[20px] overflow-hidden">
              <div className="flex-1 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fourStars[1]?.image}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.2) brightness(0.45)" }}
                />
              </div>
              <div
                className="w-px z-[1]"
                style={{ background: "linear-gradient(transparent, rgba(212,168,67,0.3), transparent)" }}
              />
              <div className="flex-1 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={advisors[7]?.image}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.2) brightness(0.45)" }}
                />
              </div>
            </div>
            {/* Glass overlay */}
            <div className="relative z-[2] text-center py-7 px-10 bg-wd-bg/55 backdrop-blur-[24px] saturate-150 border border-wd-overlay/[0.08] rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(var(--wd-overlay),0.06)] animate-wd-float">
              <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-wd-gold mb-2.5">
                War Desk Live
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
