"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";

const brands = [
  "Dept of War",
  "Boeing",
  "Starlink",
  "Viasat",
  "Toyota",
  "Ferrari",
  "Audi",
  "Sony Pictures",
  "Mercedes-Benz",
  "Netflix",
  "McDonald's",
  "Coca-Cola",
  "Shell",
  "GE",
  "Universal",
  "Warner Bros",
];

export default function StudioBrands() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => setVideoFailed(true));
    const handleVis = () => {
      if (!document.hidden) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, []);

  return (
    <section className="relative overflow-hidden bg-wd-bg">
      {/* ── Video background ── */}
      {!videoFailed && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          src="/brands-reel.mp4"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[0]"
          style={{
            filter: "contrast(1.08) brightness(0.58) saturate(0.72)",
          }}
          onError={() => setVideoFailed(true)}
        />
      )}

      {/* Overlays: dark + halftone */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-wd-bg/65" />
      <div className="absolute inset-0 z-[1] pointer-events-none wd-halftone opacity-25" />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at center, rgba(0,0,0,0.4) 0%, transparent 75%)",
        }}
      />

      {/* Top + bottom hairlines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-wd-gold/40 z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-wd-gold/40 z-[2]" />

      <Reveal>
        <div className="relative z-[2] py-[clamp(72px,9vw,120px)] px-[clamp(20px,5vw,72px)] max-w-[1400px] mx-auto">
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-wd-gold mb-4">
              03 / Credits
            </div>
            <h2
              className="font-display text-[clamp(34px,5.5vw,76px)] uppercase leading-[0.95] tracking-[-0.025em] text-wd-bone"
              style={{
                textShadow: "0 2px 18px rgba(0,0,0,0.8)",
              }}
            >
              Defense discipline.
              <br />
              <span className="text-wd-gold italic font-serif normal-case tracking-[-0.01em]">
                Consumer craft.
              </span>
            </h2>
          </div>

          {/* Brand list — numbered editorial grid */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-5 border-t border-wd-gold/30 pt-10"
            style={{
              textShadow: "0 2px 14px rgba(0,0,0,0.85)",
            }}
          >
            {brands.map((brand, i) => (
              <div
                key={brand}
                className="group flex items-start gap-3"
              >
                <span className="font-mono text-[9px] tracking-[0.26em] uppercase text-wd-gold/60 mt-2 w-6 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[clamp(18px,1.8vw,26px)] uppercase tracking-[-0.01em] leading-[1.1] text-wd-bone group-hover:text-wd-gold transition-colors cursor-default">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
