"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function StudioInterstitial() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative h-[clamp(200px,28vh,300px)] w-full overflow-hidden"
      aria-hidden="true"
    >
      {/* Parallax image with subtle grade */}
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-radar.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{
            filter: "contrast(1.12) brightness(0.82) saturate(0.78)",
          }}
        />
      </motion.div>

      {/* Warm gold multiply tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "rgba(212,168,67,0.07)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Top + bottom fade into page bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgb(var(--wd-bg)) 0%, rgba(var(--wd-bg),0.15) 25%, rgba(var(--wd-bg),0.15) 75%, rgb(var(--wd-bg)) 100%)",
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

      {/* HUD — ring + crosshair only, tracks the image crop */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
        viewBox="0 0 2593 1527"
        preserveAspectRatio="xMidYMid slice"
      >
        <g
          stroke="rgba(212,168,67,0.55)"
          strokeWidth="2"
          fill="none"
          vectorEffect="non-scaling-stroke"
        >
          <circle
            cx="1880"
            cy="770"
            r="300"
            strokeDasharray="10 16"
            opacity="0.7"
          />
          <circle
            cx="1880"
            cy="770"
            r="180"
            strokeDasharray="3 12"
            opacity="0.5"
          />
          <line x1="1820" y1="770" x2="1940" y2="770" />
          <line x1="1880" y1="710" x2="1880" y2="830" />
          <circle
            cx="1880"
            cy="770"
            r="6"
            fill="rgba(212,168,67,0.9)"
            stroke="none"
          />
        </g>
      </svg>

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
    </section>
  );
}
