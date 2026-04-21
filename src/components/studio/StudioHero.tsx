"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

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
        {/* Video overlays hardcoded dark — video section stays cinematic in both themes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,10,12,0.8) 0%, rgba(10,10,12,0.5) 42%, rgba(10,10,12,0.3) 62%, rgba(10,10,12,0.5) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, transparent 55%, rgba(10,10,12,0.65) 82%, rgb(var(--wd-bg)) 100%)",
          }}
        />
        {/* Halftone overlay to give the video document-print feel */}
        <div className="absolute inset-0 wd-halftone-white opacity-20 mix-blend-overlay" aria-hidden="true" />
      </div>

      {/* ── Content block ── */}
      <div className="relative z-[2] flex-1 w-full flex items-end">
        <div className="w-full px-[clamp(20px,5vw,72px)] pb-[clamp(48px,7vw,96px)] pt-16 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6 items-end">
            {/* Main headline block */}
            <div className="col-span-12 lg:col-span-10">
              <Reveal>
                <h1 className="font-display text-[clamp(60px,11vw,152px)] font-normal text-wd-bone leading-[0.86] tracking-[-0.03em] uppercase">
                  Business.
                  <br />
                  <span className="relative inline-block">
                    Is.
                  </span>{" "}
                  <span className="text-wd-gold">War.</span>
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-6 mb-8 flex items-end gap-4 flex-wrap">
                  <h2 className="font-serif italic text-[clamp(24px,3vw,38px)] font-normal text-wd-bone/90 leading-[1.1] tracking-[-0.01em]">
                    We forge your legend.
                  </h2>
                  <div className="h-[1px] flex-1 bg-wd-gold/40 mb-3 min-w-[80px] hidden sm:block" />
                </div>
              </Reveal>

              <Reveal delay={0.28}>
                <p className="font-sans text-[clamp(15px,1.5vw,18px)] font-light text-wd-bone/75 leading-[1.65] max-w-[580px] mb-9">
                  The creative force behind Western capability. Campaigns, films,
                  and experiences for the companies advancing hard tech, defense,
                  and aerospace.
                </p>
              </Reveal>

              <Reveal delay={0.36}>
                <div className="flex gap-4 flex-wrap items-center">
                  <a
                    href="#contact"
                    className="group font-mono text-[11px] tracking-[0.18em] uppercase py-4 px-9 bg-wd-gold text-wd-ink border-none font-bold rounded-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-wd-text inline-flex items-center gap-3"
                  >
                    Work With Us
                    <span className="text-[14px] group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  <a
                    href="#capabilities"
                    className="font-mono text-[11px] tracking-[0.18em] uppercase py-4 px-9 bg-transparent text-wd-text border border-wd-gold/50 font-bold rounded-none transition-all duration-300 hover:border-wd-gold hover:bg-wd-gold/10"
                  >
                    Capabilities
                  </a>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3] pointer-events-none transition-opacity duration-500"
        style={{ opacity: Math.max(0, 1 - scrollY / 180) }}
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.svg
          width="14"
          height="36"
          viewBox="0 0 14 36"
          fill="none"
          className="text-wd-gold"
          animate={{ opacity: [1, 0.45, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <line x1="7" y1="1" x2="7" y2="26" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          <path d="M1 26L7 33L13 26" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
