"use client";

import { useEffect, useRef, useState } from "react";
import DiamondTrain from "@/components/transonic/DiamondTrain";

// The roll call. Film titles over a letterboxed picture that changes with the title
// (Biscuit, A24, Division). The list advances on its own every few seconds so phones
// see every film too; hovering or focusing a title takes over and holds it.
// Clips live in /public/work/<id>.mp4 (2.39:1, textless, cut from clean sources).
// Titles are the campaign names from the source files; confirm before shipping.
const FILMS = [
  { id: "corvette-2026", title: "Corvette 2026", client: "Chevrolet" },
  { id: "long-haul", title: "Long Haul", client: "Chevrolet Silverado" },
  { id: "taycan-arcade", title: "Taycan Arcade", client: "Porsche" },
  { id: "inspired-by-diamonds", title: "Inspired by Diamonds", client: "Toyota" },
  { id: "open-haus", title: "Open Haus", client: "Audi" },
  { id: "to-haul-and-back", title: "To Haul and Back", client: "Freightliner" },
  { id: "creature-comfort", title: "Creature Comfort", client: "MG" },
  { id: "proxis", title: "Proxis", client: "Samsonite" },
  { id: "unordinary", title: "Unordinary", client: "Unloan" },
  { id: "starlink", title: "Starlink", client: "Airtel" },
];
const ADVANCE_MS = 3600;

export default function StudioWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());

  // Load nothing until the section is close to the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Fetch the active clip and the next one
  useEffect(() => {
    if (!inView) return;
    const following = (active + 1) % FILMS.length;
    setLoaded((prev) => {
      if (prev.has(active) && prev.has(following)) return prev;
      const next = new Set(prev);
      next.add(active);
      next.add(following);
      return next;
    });
  }, [active, inView]);

  // Each title starts its clip from the top
  useEffect(() => {
    const v = videoRefs.current[active];
    if (v && v.readyState > 0) v.currentTime = 0;
  }, [active]);

  // Play only the active clip
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && inView) v.play().catch(() => {});
      else v.pause();
    });
  }, [active, inView, loaded]);

  // Advance on its own unless someone is choosing
  useEffect(() => {
    if (!inView || held) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % FILMS.length), ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [active, held, inView]);

  return (
    <section
      id="work"
      ref={sectionRef}
      aria-label="Work"
      className="relative bg-wd-bg scroll-mt-16 md:py-[clamp(48px,8vw,120px)]"
    >
      {/* The picture */}
      <div className="relative w-full aspect-[16/10] md:aspect-[2.39/1] overflow-hidden">
        {FILMS.map((f, i) => (
          <video
            key={f.id}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={loaded.has(i) ? `/work/${f.id}.mp4` : undefined}
            poster={loaded.has(i) ? `/work/${f.id}.jpg` : undefined}
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(10,10,12,0.82) 0%, rgba(10,10,12,0.55) 34%, rgba(10,10,12,0.08) 62%, transparent 100%)",
          }}
        />

        {/* Desktop: the titles sit on the picture */}
        <div className="absolute inset-y-0 left-[clamp(20px,5vw,72px)] hidden md:flex flex-col justify-center">
          <p className="font-sans text-[14px] text-wd-bone/55 mb-5">Films our team has made</p>
          <ul onMouseLeave={() => setHeld(false)}>
            {FILMS.map((f, i) => (
              <li
                key={f.id}
                tabIndex={0}
                onMouseEnter={() => {
                  setHeld(true);
                  setActive(i);
                }}
                onFocus={() => {
                  setHeld(true);
                  setActive(i);
                }}
                onBlur={() => setHeld(false)}
                className="flex items-baseline gap-4 cursor-default outline-none"
              >
                <span
                  className={`font-display uppercase leading-[1.13] tracking-[-0.025em] text-[clamp(22px,2.7vw,44px)] transition-colors duration-300 ${
                    i === active ? "text-wd-gold" : "text-wd-bone/35"
                  }`}
                >
                  {f.title}
                </span>
                <span
                  className={`font-sans text-[14px] transition-opacity duration-300 ${
                    i === active ? "text-wd-bone/80 opacity-100" : "opacity-0"
                  }`}
                >
                  for {f.client}
                </span>
                {i === active && (
                  <DiamondTrain key={`d-${active}-${held ? "h" : "r"}`} durationMs={ADVANCE_MS} running={!held} className="text-wd-gold self-center ml-1" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Phones: the titles run under the picture */}
      <div className="md:hidden px-5 pt-6 pb-16">
        <p className="font-sans text-[13px] text-wd-bone/55 mb-4">Films our team has made</p>
        <ul>
          {FILMS.map((f, i) => (
            <li key={f.id} className="flex items-baseline justify-between gap-4 py-[7px] border-t border-wd-bone/10">
              <button
                type="button"
                onClick={() => {
                  setHeld(true);
                  setActive(i);
                }}
                className={`font-display uppercase text-left leading-[1.05] tracking-[-0.02em] text-[22px] transition-colors ${
                  i === active ? "text-wd-gold" : "text-wd-bone/45"
                }`}
              >
                {f.title}
              </button>
              <span className="font-sans text-[12px] text-wd-bone/45 shrink-0">{f.client}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
