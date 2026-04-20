"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import Bracket from "@/components/ui/Bracket";
import StatusDot from "@/components/ui/StatusDot";

export default function StudioHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);
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

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-[80px]">
      {/* ── Video background ── */}
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `scale(${1 + scrollY * 0.00015})` }}
      >
        {videoFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="https://res.cloudinary.com/dmj9mlo6o/video/upload/so_2,w_1920,q_80,f_auto/Military_Proof_of_concept_i8axfn.jpg"
            alt=""
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            poster="https://res.cloudinary.com/dmj9mlo6o/video/upload/so_2,w_1920,q_80,f_auto/Military_Proof_of_concept_i8axfn.jpg"
            className="w-full h-full object-cover pointer-events-none"
            src="https://res.cloudinary.com/dmj9mlo6o/video/upload/f_auto,q_90/Military_Proof_of_concept_i8axfn.mov"
          />
        )}
        {/* Gradient: right-heavy darken so typography reads on left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgb(var(--wd-bg) / 0.88) 0%, rgb(var(--wd-bg) / 0.55) 42%, rgb(var(--wd-bg) / 0.35) 62%, rgb(var(--wd-bg) / 0.55) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, transparent 55%, rgb(var(--wd-bg) / 0.65) 82%, rgb(var(--wd-bg)) 100%)",
          }}
        />
        {/* Halftone overlay to give the video document-print feel */}
        <div className="absolute inset-0 wd-halftone-white opacity-30 mix-blend-overlay" aria-hidden="true" />
      </div>

      {/* ── Frame ticks: crosshair registration marks on every corner ── */}
      <FrameTicks />

      {/* ── Upper-right tech readout dossier ── */}
      <div className="absolute top-[100px] right-[clamp(16px,4vw,48px)] z-[4] hidden md:block">
        <div className="bg-wd-bg/70 backdrop-blur-md border border-wd-gold/40 px-4 py-3 min-w-[220px]">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-wd-gold/30">
            <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-gold">
              [ WAR DESK // STUDIO ]
            </span>
            <StatusDot label="ACTIVE" tone="gold" className="text-[8px]" />
          </div>
          <div className="font-mono text-[9px] tracking-[0.2em] uppercase leading-[1.9] text-wd-muted">
            <div className="flex justify-between gap-4">
              <span>MISSION</span>
              <span className="text-wd-text">CREATIVE OPS</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>SCOPE</span>
              <span className="text-wd-text">DEFENSE / HARD TECH</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>UNIT</span>
              <span className="text-wd-text">STUDIO — 01</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>CLEARANCE</span>
              <span className="text-wd-gold">FIELD TESTED</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content block ── */}
      <div className="relative z-[2] flex-1 w-full flex items-end">
        <div className="w-full px-[clamp(20px,5vw,72px)] pb-[clamp(48px,7vw,96px)] pt-8 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6 items-end">
            {/* Main headline block */}
            <div className="col-span-12 lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <Bracket variant="gold" size="sm">
                    TRANSMISSION 01 // BROADCAST
                  </Bracket>
                  <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-muted">
                    EST. 2026 / EL SEGUNDO, CA
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <h1 className="font-display text-[clamp(60px,11vw,152px)] font-normal text-wd-text leading-[0.86] tracking-[-0.03em] uppercase">
                  Business.
                  <br />
                  <span className="relative inline-block">
                    Is.
                  </span>{" "}
                  <span className="text-wd-gold">War.</span>
                </h1>
              </Reveal>

              <Reveal delay={0.22}>
                <div className="mt-6 mb-8 flex items-end gap-4 flex-wrap">
                  <h2 className="font-serif italic text-[clamp(24px,3vw,38px)] font-normal text-wd-text/90 leading-[1.1] tracking-[-0.01em]">
                    We forge your legend.
                  </h2>
                  <div className="h-[1px] flex-1 bg-wd-gold/40 mb-3 min-w-[80px] hidden sm:block" />
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <p className="font-sans text-[clamp(15px,1.5vw,18px)] font-light text-wd-text/75 leading-[1.65] max-w-[580px] mb-9">
                  The creative force behind Western capability. Campaigns, films,
                  and experiences for the companies advancing hard tech, defense,
                  and aerospace.
                </p>
              </Reveal>

              <Reveal delay={0.38}>
                <div className="flex gap-4 flex-wrap items-center">
                  <a
                    href="#transmit"
                    className="group font-mono text-[11px] tracking-[0.18em] uppercase py-4 px-9 bg-wd-gold text-wd-ink border-none font-bold rounded-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-wd-text inline-flex items-center gap-3"
                  >
                    Work With Us
                    <span className="text-[14px] group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  <a
                    href="#capabilities"
                    className="font-mono text-[11px] tracking-[0.18em] uppercase py-4 px-9 bg-transparent text-wd-text border border-wd-gold/50 font-bold rounded-none transition-all duration-300 hover:border-wd-gold hover:bg-wd-gold/10"
                  >
                    View Capabilities
                  </a>
                  <div className="font-mono text-[9px] tracking-[0.28em] uppercase text-wd-muted hidden md:block">
                    {"/// SCROLL TO ENGAGE"}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right column: vertical spec rail */}
            <div className="hidden lg:flex col-span-4 flex-col items-end text-right">
              <Reveal delay={0.5}>
                <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-muted leading-[1.9] mb-8">
                  <div className="text-wd-gold/80 mb-2">{"// FIELD OPS"}</div>
                  <div>— BOEING</div>
                  <div>— STARLINK</div>
                  <div>— VIASAT</div>
                  <div>— DEPT OF WAR</div>
                  <div className="text-wd-gold mt-2">+ 12 MORE</div>
                </div>
              </Reveal>
              <Reveal delay={0.58}>
                <div className="font-display text-[clamp(32px,4vw,54px)] text-wd-gold/25 leading-[0.86] uppercase tracking-[-0.02em] text-right">
                  T-01
                  <br />
                  STUDIO
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom rule: ticker-style divider ── */}
      <div className="relative z-[3] border-t border-wd-gold/25">
        <div className="h-[22px] px-[clamp(16px,4vw,48px)] flex items-center justify-between font-mono text-[9px] tracking-[0.26em] uppercase text-wd-muted">
          <span className="flex items-center gap-2">
            <span className="h-[1px] w-4 bg-wd-gold/60" />
            01 / HERO — BROADCAST
          </span>
          <motion.span
            className="text-wd-gold flex items-center gap-2"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            ▼ DESCEND
          </motion.span>
        </div>
      </div>
    </section>
  );
}

/* ── Corner registration ticks — crosshairs at each corner ── */
function FrameTicks() {
  return (
    <>
      {/* Top-left */}
      <svg className="absolute top-[90px] left-5 z-[3] w-4 h-4 text-wd-gold/80 hidden md:block" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M0 0 L8 0 M0 0 L0 8" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="0" cy="0" r="2.5" stroke="currentColor" strokeWidth="1" />
      </svg>
      {/* Top-right is dossier */}
      {/* Bottom-left */}
      <svg className="absolute bottom-[28px] left-5 z-[3] w-4 h-4 text-wd-gold/60 hidden md:block" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M0 16 L8 16 M0 8 L0 16" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="0" cy="16" r="2.5" stroke="currentColor" strokeWidth="1" />
      </svg>
      {/* Bottom-right */}
      <svg className="absolute bottom-[28px] right-5 z-[3] w-4 h-4 text-wd-gold/60 hidden md:block" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 16 L16 16 M16 8 L16 16" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="16" cy="16" r="2.5" stroke="currentColor" strokeWidth="1" />
      </svg>
    </>
  );
}
