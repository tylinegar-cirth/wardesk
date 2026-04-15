"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function StudioInterstitial() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Absolute-pixel parallax so strip and extension move together
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  return (
    <section
      ref={ref}
      className="relative h-[clamp(260px,34vh,400px)] w-full"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      {/* ─── Dish column extension above the strip (desktop only) ─── */}
      <div
        className="absolute left-0 right-0 pointer-events-none hidden md:block overflow-hidden"
        style={{
          top: "-120px",
          height: "120px",
          maskImage:
            "radial-gradient(ellipse 14% 320% at 72% 100%, black 22%, rgba(0,0,0,0.92) 40%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 14% 320% at 72% 100%, black 22%, rgba(0,0,0,0.92) 40%, transparent 72%)",
        }}
      >
        <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-radar.jpg"
            alt=""
            className="absolute w-full"
            style={{
              height: "auto",
              top: "-155px",
              filter: "contrast(1.12) brightness(0.82) saturate(0.78)",
            }}
          />
        </motion.div>
        {/* Warm tint matching strip */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(212,168,67,0.07)",
            mixBlendMode: "multiply",
          }}
        />
        {/* Top fade — column disappears into the black at the top */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgb(var(--wd-bg)) 0%, rgba(var(--wd-bg),0.5) 28%, transparent 70%)",
          }}
        />
      </div>

      {/* ─── Main strip ─── */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div className="absolute inset-0 scale-105" style={{ y: parallaxY }}>
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

        {/* Warm gold multiply tint */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "rgba(212,168,67,0.07)",
            mixBlendMode: "multiply",
          }}
        />

        {/* Bottom fade only — no top fade so the column can reach cleanly above */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 78%, rgb(var(--wd-bg)) 100%)",
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
      </div>
    </section>
  );
}
