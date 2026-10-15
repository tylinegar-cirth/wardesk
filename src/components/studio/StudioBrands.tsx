"use client";

import { useEffect, useRef, useState } from "react";
import ChromaticEcho from "@/components/ui/ChromaticEcho";
import ShockStations from "@/components/transonic/ShockStations";

// End credits. The brands run as a billing block over the credits reel, centred,
// with the studio line as the title card above it (Searchlight, Blink, Neon).
const brands = [
  "Starlink",
  "Ferrari",
  "Corvette",
  "Porsche",
  "Toyota",
  "Audi",
  "Silverado",
  "Mercedes-Benz",
  "Netflix",
  "Sony Pictures",
  "Spotify",
  "Coca-Cola",
];

export default function StudioBrands() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  // The loop is 7.7MB, so it waits until the section is close
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setNear(true);
    }, { rootMargin: "400px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!near || !v) return;
    v.play().catch(() => {});
    const onVis = () => {
      if (!document.hidden) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [near]);

  return (
    <section
      id="credits"
      data-transonic-band
      ref={sectionRef}
      aria-label="Credits"
      className="relative overflow-hidden bg-wd-bg scroll-mt-16"
    >
      <video
        ref={videoRef}
        src={near ? "/brands-reel.mp4" : undefined}
        poster="/brands-reel-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div
        aria-hidden="true"
        data-transonic-scrim
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 62% at center, rgba(10,10,12,0.62) 0%, rgba(10,10,12,0.42) 55%, rgba(10,10,12,0.7) 100%), linear-gradient(to bottom, rgb(10,10,12) 0%, transparent 16%, transparent 84%, rgb(10,10,12) 100%)",
        }}
      />

      <div className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-[clamp(20px,5vw,72px)] py-[clamp(96px,12vw,180px)]">
        {/* The title's shocks bend the reel behind it (its poster, until the reel is playing) */}
        <ShockStations trigger="view" field="title" firstMs={120} params={{ seams: 4 }}>
          <h2
            className="font-display uppercase leading-[0.92] tracking-[-0.03em] text-[clamp(36px,5.6vw,92px)] text-wd-bone"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.6)" }}
          >
            <span data-word>Defense discipline.</span>
            <br />
            <span data-word="payoff">
              <ChromaticEcho className="text-wd-gold">Consumer craft.</ChromaticEcho>
            </span>
          </h2>
        </ShockStations>

        <p className="font-sans text-[14px] md:text-[15px] text-wd-bone/70 mt-[clamp(40px,6vw,80px)] mb-6">
          Our team has shipped for
        </p>
        <ul
          className="max-w-[1100px] flex flex-wrap justify-center gap-x-[clamp(18px,2.4vw,40px)] gap-y-1"
          style={{ textShadow: "0 1px 18px rgba(0,0,0,0.75)" }}
        >
          {brands.map((b) => (
            <li
              key={b}
              className="font-display uppercase text-wd-bone leading-[1.15] tracking-[-0.02em] text-[clamp(22px,3vw,46px)]"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
