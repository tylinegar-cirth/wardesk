"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import CornerBrackets from "@/components/ui/CornerBrackets";

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
    <section className="relative h-screen flex items-end overflow-hidden max-[768px]:h-[100svh]">
      <CornerBrackets size={36} inset={24} color="rgba(212,168,67,0.85)" strokeWidth={1.25} />

      {/* Technical readout — upper right */}
      <div className="absolute top-[clamp(40px,5vw,72px)] right-[clamp(40px,5vw,80px)] z-[4] hidden md:block text-right">
        <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-wd-gold/70 leading-[1.8]">
          N 33°55&apos;09&quot;
          <br />
          W 118°24&apos;59&quot;
        </div>
        <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-wd-muted leading-[1.8] mt-3">
          Section // 01
          <br />
          <span className="text-wd-gold/80">Broadcast</span>
        </div>
      </div>
      {/* Video Background */}
      <div
        className="absolute inset-0 z-0"
        style={{ transform: `scale(${1 + scrollY * 0.0002})` }}
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
            War Desk Studio &mdash; EST. 2026
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <h1 className="font-serif text-[clamp(48px,8vw,104px)] font-normal text-wd-text leading-[0.92] mb-4 tracking-[-0.02em]">
            Business.
            <br />
            Is.
            <br />
            <span className="text-wd-gold">War.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <h2 className="font-serif italic text-[clamp(20px,2.4vw,30px)] font-normal text-wd-text/85 leading-[1.15] mb-6 tracking-[-0.01em]">
            We forge your legend.
          </h2>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="font-sans text-[clamp(15px,1.6vw,18px)] font-light text-wd-text/70 leading-[1.65] max-w-[520px] mb-9">
            The creative force behind Western capability. Campaigns, films,
            and experiences for the companies advancing hard tech, defense,
            and aerospace.
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
