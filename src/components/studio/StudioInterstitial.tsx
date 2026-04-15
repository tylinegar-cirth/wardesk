"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CornerBrackets from "@/components/ui/CornerBrackets";

export default function StudioInterstitial() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      ref={ref}
      className="relative h-[62vh] min-h-[480px] w-full overflow-hidden"
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

      {/* Warm gold multiply tint — pushes it into palette */}
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
            "linear-gradient(180deg, rgb(var(--wd-bg)) 0%, rgba(var(--wd-bg),0.35) 18%, rgba(var(--wd-bg),0.3) 82%, rgb(var(--wd-bg)) 100%)",
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.13] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          backgroundSize: "240px 240px",
        }}
      />

      {/* HUD overlay — SVG, desktop only */}
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
          {/* Outer range ring around dish position */}
          <circle
            cx="1880"
            cy="770"
            r="300"
            strokeDasharray="10 16"
            opacity="0.65"
          />
          {/* Inner ring */}
          <circle
            cx="1880"
            cy="770"
            r="180"
            strokeDasharray="3 12"
            opacity="0.5"
          />
          {/* Crosshair arms */}
          <line x1="1820" y1="770" x2="1940" y2="770" />
          <line x1="1880" y1="710" x2="1880" y2="830" />
          {/* Center pip */}
          <circle
            cx="1880"
            cy="770"
            r="6"
            fill="rgba(212,168,67,0.9)"
            stroke="none"
          />

          {/* Horizon reference line + tick marks */}
          <line
            x1="180"
            y1="1080"
            x2="2420"
            y2="1080"
            strokeWidth="1.5"
            opacity="0.28"
          />
          {Array.from({ length: 13 }).map((_, i) => (
            <line
              key={i}
              x1={180 + i * 186}
              y1="1068"
              x2={180 + i * 186}
              y2="1092"
              strokeWidth="1.5"
              opacity="0.38"
            />
          ))}

          {/* Leader line from dish crosshair → top-right readout area */}
          <path
            d="M 2180 770 L 2300 560 L 2440 560"
            strokeWidth="1.5"
            opacity="0.5"
            strokeDasharray="2 6"
          />
        </g>
      </svg>

      {/* Radar sweep — horizontal line traversing the section */}
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
          duration: 7,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1.5,
        }}
      />

      <CornerBrackets
        size={30}
        inset={20}
        color="rgba(212,168,67,0.75)"
        strokeWidth={1.25}
      />

      {/* ─── Text overlays ─── */}

      {/* Top-left — station label */}
      <div className="absolute top-[clamp(32px,5vw,64px)] left-[clamp(24px,5vw,72px)] z-[2]">
        <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold/80 leading-[1.8]">
          Station // 04
          <br />
          <span className="text-wd-muted">Forward Observation</span>
        </div>
      </div>

      {/* Top-right — target readout (connects to leader line) */}
      <div className="absolute top-[clamp(32px,5vw,64px)] right-[clamp(24px,5vw,72px)] z-[2] text-right hidden md:block">
        <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold/85 leading-[1.9]">
          Target // 01
          <br />
          <span className="text-wd-muted">Bearing 284°</span>
          <br />
          <span className="text-wd-muted">Range 2.4 km</span>
          <br />
          <span className="text-wd-gold/70">Signal // Nominal</span>
        </div>
      </div>

      {/* Bottom-left — transmit indicator */}
      <div className="absolute bottom-[clamp(32px,5vw,64px)] left-[clamp(24px,5vw,72px)] z-[2]">
        <div className="flex items-center gap-2.5">
          <motion.span
            className="block w-1.5 h-1.5 rounded-full bg-wd-gold"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold/80 leading-[1.8]">
            Transmit // Live
            <br />
            <span className="text-wd-muted">04:17:22 UTC</span>
          </div>
        </div>
      </div>

      {/* Bottom-right — coordinates */}
      <div className="absolute bottom-[clamp(32px,5vw,64px)] right-[clamp(24px,5vw,72px)] z-[2] text-right">
        <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold/80 leading-[1.8]">
          N 68°24&apos;18&quot;
          <br />
          <span className="text-wd-muted">W 133°29&apos;12&quot;</span>
        </div>
      </div>
    </section>
  );
}
