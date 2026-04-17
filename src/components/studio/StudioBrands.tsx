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
    <div className="relative overflow-hidden">
      {/* Top + bottom hairlines — frame the strip as an intercept window */}
      <div
        className="absolute top-0 left-[5%] right-[5%] h-px z-[3]"
        style={{
          background:
            "linear-gradient(90deg,transparent,var(--wd-divider),transparent)",
        }}
      />
      <div
        className="absolute bottom-0 left-[5%] right-[5%] h-px z-[3]"
        style={{
          background:
            "linear-gradient(90deg,transparent,var(--wd-divider),transparent)",
        }}
      />

      {/* Background reel — desktop only. Continuous proof of the credits. */}
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
          className="absolute inset-0 w-full h-full object-cover pointer-events-none hidden md:block z-[0]"
          style={{
            filter: "contrast(1.05) brightness(0.55) saturate(0.78)",
          }}
          onError={() => setVideoFailed(true)}
        />
      )}

      {/* Heavy darkening overlay so brand names stay readable */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none hidden md:block"
        style={{
          background: "rgba(0,0,0,0.55)",
        }}
      />
      {/* Warm gold multiply tint matching the rest of the page */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none hidden md:block"
        style={{
          background: "rgba(212,168,67,0.05)",
          mixBlendMode: "multiply",
        }}
      />
      {/* Center vignette pulling extra darkness behind the names row */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at center, rgba(0,0,0,0.5) 0%, transparent 80%)",
        }}
      />

      <Reveal>
        <section className="relative z-[2] py-[clamp(48px,6.5vw,80px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto text-center">
          <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold/85 mb-6">
            Credits // Past Lives
          </div>
          <div
            className="font-serif text-[clamp(17px,1.7vw,22px)] font-normal text-wd-text leading-[1.5] flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 max-w-[1080px] mx-auto"
            style={{
              textShadow:
                "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.7)",
            }}
          >
            {brands.map((brand, i) => (
              <span key={brand} className="flex items-center gap-3">
                <span className="hover:text-wd-gold transition-colors duration-300 cursor-default">
                  {brand}
                </span>
                {i < brands.length - 1 && (
                  <span className="text-wd-gold/70 text-[9px]">◆</span>
                )}
              </span>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
