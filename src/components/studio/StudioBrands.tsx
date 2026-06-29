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
    <section id="credits" className="relative overflow-hidden bg-wd-bg scroll-mt-[88px]">
      {/* ── Video background ── */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          poster="/brands-reel-poster.jpg"
          src="/brands-reel.mp4"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-[0]"
          style={{
            filter: "contrast(1.02) brightness(0.96) saturate(1)",
          }}
          onError={() => setVideoFailed(true)}
        />
      ) : (
        // Autoplay blocked (iOS Low Power Mode, data saver, etc) — show a strong still, never a tap-to-play button
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brands-reel-poster.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-[0]"
          style={{
            filter: "contrast(1.02) brightness(0.96) saturate(1)",
          }}
        />
      )}

      {/* Overlays: kept light so the showreel reads — text stays legible via the directional scrim + text-shadow halos */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "rgba(10,10,12,0.18)" }}
      />
      <div className="absolute inset-0 z-[1] pointer-events-none wd-halftone opacity-[0.14]" />
      {/* Readability scrim: anchors the headline (top-left) without darkening the whole reel */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, rgba(8,8,10,0.55) 0%, rgba(8,8,10,0.28) 34%, rgba(8,8,10,0.08) 60%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 72% 62% at center, transparent 58%, rgba(0,0,0,0.22) 100%)",
        }}
      />
      {/* Bottom scrim: buries burned-in legal captions (always at frame bottom) + seats the last brand row + eases into the next section */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.7) 14%, rgba(8,8,10,0.28) 24%, transparent 38%)",
        }}
      />

      {/* Top + bottom hairlines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-wd-gold/40 z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-wd-gold/40 z-[2]" />

      <Reveal>
        <div className="relative z-[2] py-[clamp(72px,9vw,120px)] px-[clamp(20px,5vw,72px)] max-w-[1400px] mx-auto">
          <div className="mb-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-wd-gold">
                03 / Credits
              </div>
              <div
                className="font-serif italic text-[clamp(12px,1.3vw,15px)] text-wd-bone/75 text-right leading-tight"
                style={{ textShadow: "0 1px 10px rgba(0,0,0,0.85)" }}
              >
                Some of our past work
              </div>
            </div>
            <h2
              className="font-display text-[clamp(34px,5.5vw,76px)] uppercase leading-[0.95] tracking-[-0.025em] text-wd-bone"
              style={{
                textShadow: "0 2px 22px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.7)",
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
              textShadow: "0 1px 16px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.78)",
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
