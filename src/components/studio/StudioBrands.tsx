"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import Bracket from "@/components/ui/Bracket";
import StatusDot from "@/components/ui/StatusDot";

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

      {/* Overlays: dark + halftone + gold tint */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-wd-bg/65" />
      <div className="absolute inset-0 z-[1] pointer-events-none wd-halftone opacity-30" />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at center, rgba(0,0,0,0.4) 0%, transparent 75%)",
        }}
      />

      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-wd-gold/40 z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-wd-gold/40 z-[2]" />

      <Reveal>
        <div className="relative z-[2] py-[clamp(72px,9vw,120px)] px-[clamp(20px,5vw,72px)] max-w-[1400px] mx-auto">
          {/* Document-style header */}
          <div className="grid grid-cols-12 gap-6 items-start mb-10">
            <div className="col-span-12 md:col-span-8">
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <Bracket variant="gold" size="sm">
                  SECTION 03 // CREDITS
                </Bracket>
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-gold/70">
                  FIELD TESTED — PAST LIVES
                </span>
              </div>
              <h2
                className="font-display text-[clamp(36px,6vw,88px)] uppercase leading-[0.92] tracking-[-0.025em] text-wd-bone"
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
            <div className="col-span-12 md:col-span-4 md:text-right">
              <div className="inline-flex flex-col gap-2 md:items-end">
                <StatusDot label="CLEARED · ARCHIVE" tone="gold" />
                <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-muted leading-[1.8]">
                  <div>RECORD / 16 UNITS</div>
                  <div>CLASS / MAJOR BRAND</div>
                  <div className="text-wd-gold/90">
                    EST. 2014 — 2026
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Brand names grid — editorial, column-broken */}
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

          {/* Footer bar */}
          <div className="mt-10 pt-5 border-t border-wd-gold/30 flex items-center justify-between font-mono text-[9px] tracking-[0.24em] uppercase text-wd-muted">
            <span>{"// END CREDIT ARCHIVE"}</span>
            <span className="text-wd-gold/80">CONTINUOUS OPERATION ▸</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
