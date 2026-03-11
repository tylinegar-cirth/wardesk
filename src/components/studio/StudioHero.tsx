"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";

export default function StudioHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
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
    <section className="relative h-screen flex items-end overflow-hidden max-[768px]:h-[100svh]">
      {/* Video Background */}
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `scale(${1 + scrollY * 0.0002})` }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          className="w-full h-full object-cover pointer-events-none"
          src="https://res.cloudinary.com/dmj9mlo6o/video/upload/f_auto,q_90/Military_Proof_of_concept_i8axfn.mov"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg,rgba(var(--wd-bg),0.3) 0%,rgba(var(--wd-bg),0.1) 40%,rgba(var(--wd-bg),0.7) 70%,rgba(var(--wd-bg),1) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-[2] w-full px-[clamp(24px,5vw,72px)] pb-[clamp(48px,6vw,80px)] max-w-[800px] max-[768px]:max-w-full">
        <Reveal>
          <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-5">
            Strategic Production
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <h1 className="font-serif text-[clamp(36px,5.5vw,64px)] font-normal text-wd-text leading-[1.06] mb-5">
            Forging Your
            <br />
            Legend.
          </h1>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="font-sans text-[clamp(15px,1.6vw,18px)] font-light text-wd-text/75 leading-[1.65] max-w-[520px] mb-9">
            Strategic content and production for defense, aerospace, and hard
            tech. We build the campaigns, films, and experiences that position
            the companies advancing Western capability.
          </p>
        </Reveal>
        <Reveal delay={0.36}>
          <div className="flex gap-3.5 flex-wrap">
            <a
              href="#contact"
              className="font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-8 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98] inline-block"
            >
              Work With Us
            </a>
            <a
              href="#services"
              className="font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-8 bg-wd-overlay/[0.03] text-wd-sub border border-wd-border rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-[8px] hover:bg-wd-overlay/[0.07] hover:border-wd-border-hov hover:text-wd-text hover:-translate-y-px active:translate-y-0 active:scale-[0.98] inline-block"
            >
              View Our Work
            </a>
          </div>
        </Reveal>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 animate-wd-bounce">
        <div
          className="w-px h-8"
          style={{
            background: "linear-gradient(transparent, rgb(var(--wd-muted)))",
          }}
        />
      </div>
    </section>
  );
}
