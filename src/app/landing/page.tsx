"use client";

import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
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
    <div className="wd-app">
      <div className="relative h-screen flex flex-col overflow-hidden max-[768px]:h-[100svh]">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
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
                "linear-gradient(180deg,rgba(var(--wd-bg),0.5) 0%,rgba(var(--wd-bg),0.2) 30%,rgba(var(--wd-bg),0.2) 60%,rgba(var(--wd-bg),0.7) 100%)",
            }}
          />
        </div>

        {/* Top bar: logo + wordmark */}
        <header className="relative z-[2] flex items-center justify-between px-[clamp(20px,4vw,48px)] h-[60px] flex-shrink-0">
          <div className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-wd-text flex items-center gap-2.5 max-[480px]:text-[10px] max-[480px]:tracking-[0.15em] max-[480px]:gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt=""
              className="h-[90px] w-auto -mt-[12px] -mb-[18px] dark:invert max-[480px]:h-[56px] max-[480px]:-mt-[6px] max-[480px]:-mb-[10px]"
            />
            War Desk
          </div>
          <a
            href="/studio"
            className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-gold transition-colors"
          >
            Studio
          </a>
        </header>

        {/* Center content */}
        <div className="relative z-[2] flex-1 flex flex-col items-center justify-center text-center px-6">
          <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-5 max-[480px]:text-[9px] max-[480px]:tracking-[0.25em]">
            Advisory ・ Media ・ Studio
          </div>
          <h1 className="font-serif text-[clamp(32px,5vw,56px)] font-normal text-wd-text leading-[1.1] mb-8">
            The back channel
            <br />
            for defense tech.
          </h1>
          <div className="font-mono text-sm tracking-[0.35em] uppercase text-wd-gold font-bold max-[480px]:text-xs max-[480px]:tracking-[0.25em]">
            Coming Soon
          </div>
        </div>

        {/* Subtle bottom fade */}
        <div className="relative z-[2] h-8 flex-shrink-0" />
      </div>
    </div>
  );
}
