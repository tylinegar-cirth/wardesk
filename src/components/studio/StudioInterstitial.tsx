"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function StudioInterstitial() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <motion.section
      ref={ref}
      className="relative h-[clamp(320px,42vh,520px)] w-full overflow-hidden"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Parallax image — scaled + origin-offset to crop the right-side building */}
      <motion.div
        className="absolute inset-0"
        style={{
          y,
          scale: 1.15,
          transformOrigin: "40% 50%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-radar.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: "contrast(1.12) brightness(0.82) saturate(0.78)",
            objectPosition: "center 35%",
          }}
        />
      </motion.div>

      {/* Warm gold tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "rgba(212,168,67,0.07)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Top fade — slash syntax so it adapts to light/dark mode */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgb(var(--wd-bg)) 0%, rgb(var(--wd-bg) / 0.6) 10%, rgb(var(--wd-bg) / 0.12) 24%, transparent 35%)",
        }}
      />
      {/* Bottom fade — long gradual bleed into page bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 32%, rgb(var(--wd-bg) / 0.08) 44%, rgb(var(--wd-bg) / 0.2) 56%, rgb(var(--wd-bg) / 0.4) 68%, rgb(var(--wd-bg) / 0.65) 80%, rgb(var(--wd-bg) / 0.88) 92%, rgb(var(--wd-bg)) 100%)",
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          backgroundSize: "240px 240px",
        }}
      />

      {/* Radar sweep */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] pointer-events-none hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0) 8%, rgba(212,168,67,0.5) 50%, rgba(212,168,67,0) 92%, transparent 100%)",
          boxShadow: "0 0 14px rgba(212,168,67,0.35)",
          top: 0,
        }}
        animate={{ top: ["-2%", "102%"] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1,
        }}
      />
    </motion.section>
  );
}
