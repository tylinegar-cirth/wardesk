"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import CornerBrackets from "@/components/ui/CornerBrackets";

export default function StudioRoundTable() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  // Slow scroll-driven rotation — almost imperceptible, gives life
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-12, 12]);

  return (
    <section
      ref={ref}
      className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-[clamp(20px,5vw,72px)] py-[clamp(80px,10vw,140px)]"
    >
      <CornerBrackets
        size={24}
        inset={12}
        color="rgba(212,168,67,0.35)"
        strokeWidth={1}
      />

      {/* Pillar eyebrow only — this is a manifesto moment, not a numbered section */}
      <div className="absolute top-[clamp(32px,5vw,72px)] left-[clamp(24px,5vw,72px)] z-[2]">
        <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold">
          {"// The Round Table"}
        </div>
      </div>
      <div className="absolute top-[clamp(32px,5vw,72px)] right-[clamp(24px,5vw,72px)] z-[2] text-right hidden md:block">
        <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-wd-muted leading-[1.8]">
          XII Knights
          <br />
          <span className="text-wd-gold/80">One Round Table</span>
        </div>
      </div>

      {/* Faint radial gold glow behind the logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[min(720px,80vw)] h-[min(720px,80vw)] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,168,67,0.12) 0%, rgba(212,168,67,0.04) 35%, transparent 65%)",
          }}
          animate={
            inView ? { opacity: [0, 1], scale: [0.85, 1] } : { opacity: 0, scale: 0.85 }
          }
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Faint roman numeral row encircling — XII placed at cardinal points */}
      <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
        {[
          { label: "XII", x: 0, y: -260 },
          { label: "III", x: 260, y: 0 },
          { label: "VI", x: 0, y: 260 },
          { label: "IX", x: -260, y: 0 },
        ].map((pt, i) => (
          <motion.span
            key={pt.label}
            className="absolute font-mono text-[9px] tracking-[0.4em] uppercase text-wd-gold/35"
            style={{ transform: `translate(${pt.x}px, ${pt.y}px)` }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.4 + i * 0.12, ease: "easeOut" }}
          >
            {pt.label}
          </motion.span>
        ))}
      </div>

      {/* Centered content — eyebrow, logo, statement */}
      <div className="relative z-[2] text-center max-w-[820px] mx-auto">
        {/* The logo itself, with subtle scroll-driven rotation */}
        <motion.div
          className="flex justify-center mb-[clamp(36px,5vw,64px)]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <motion.div
            style={{ rotate }}
            className="w-[clamp(220px,26vw,340px)] aspect-square"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-gold.png"
              alt="War Desk Studio — twelve knights at the round table"
              className="w-full h-full object-contain"
              style={{
                filter: "drop-shadow(0 0 32px rgba(212,168,67,0.18))",
              }}
            />
          </motion.div>
        </motion.div>

        {/* Pillar statement */}
        <motion.h2
          className="font-serif text-[clamp(28px,4vw,52px)] font-normal leading-[1.1] tracking-[-0.01em] text-wd-text"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Twelve seats.
          <br />
          <span className="italic text-wd-gold/90">One creative force.</span>
        </motion.h2>

        <motion.p
          className="font-sans text-[clamp(14px,1.5vw,17px)] font-light text-wd-sub leading-[1.65] mt-[clamp(20px,2.5vw,30px)] max-w-[560px] mx-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          The few who&apos;ve sat at every table. Pentagon to private sector.
          Brand giants to defense startups. The round table for the companies
          advancing Western capability.
        </motion.p>

        {/* Closing tick — ties back to corner brackets system */}
        <motion.div
          className="mt-[clamp(36px,4vw,52px)] mx-auto w-12 h-px bg-wd-gold/50"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </section>
  );
}
