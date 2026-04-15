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
  const textY = useTransform(scrollYProgress, [0, 1], ["20px", "-20px"]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 0]
  );

  return (
    <section
      ref={ref}
      className="relative h-[60vh] min-h-[460px] w-full overflow-hidden"
      aria-hidden="true"
    >
      {/* Parallax image */}
      <motion.div className="absolute inset-0 scale-110" style={{ y }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-radar.jpg"
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </motion.div>

      {/* Top + bottom fades into page background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgb(var(--wd-bg)) 0%, rgba(var(--wd-bg),0.4) 22%, rgba(var(--wd-bg),0.35) 78%, rgb(var(--wd-bg)) 100%)",
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      <CornerBrackets
        size={30}
        inset={20}
        color="rgba(212,168,67,0.7)"
        strokeWidth={1.25}
      />

      {/* Upper-left label */}
      <div className="absolute top-[clamp(32px,5vw,64px)] left-[clamp(24px,5vw,72px)] z-[2]">
        <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold/75 leading-[1.8]">
          Station // 04
          <br />
          <span className="text-wd-muted">Forward Observation</span>
        </div>
      </div>

      {/* Centered text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-[2] px-[clamp(20px,5vw,72px)]"
        style={{ opacity: textOpacity, y: textY }}
      >
        <div className="text-center max-w-[780px]">
          <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold/80 mb-5">
            {"// Field Notes"}
          </div>
          <p className="font-serif italic text-[clamp(22px,3vw,38px)] font-normal text-wd-text leading-[1.25] tracking-[-0.01em]">
            Western capability gets built at the edge of the map.
          </p>
          <div className="mt-6 w-12 h-px bg-wd-gold/50 mx-auto" />
        </div>
      </motion.div>

      {/* Lower-right coordinates */}
      <div className="absolute bottom-[clamp(32px,5vw,64px)] right-[clamp(24px,5vw,72px)] z-[2] text-right">
        <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold/75 leading-[1.8]">
          N 68°24&apos;18&quot;
          <br />
          <span className="text-wd-muted">W 133°29&apos;12&quot;</span>
        </div>
      </div>
    </section>
  );
}
