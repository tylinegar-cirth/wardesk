"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

/* Brand list. Add `still: '/work-stills/<slug>.jpg'` per brand as
   actual stills become available. The hover-to-still interaction
   only fires for brands that have a `still` defined — brands without
   one fall back to the default gold color shift. Caption is optional. */
interface Brand {
  name: string;
  still?: string;
  caption?: string;
}

const brands: Brand[] = [
  { name: "Dept of War" },
  // DEMO: Boeing uses hero-radar.jpg as placeholder so the interaction is
  // visible. Replace with a real Boeing campaign still at /work-stills/boeing.jpg
  // and remove "Demo placeholder" caption.
  {
    name: "Boeing",
    still: "/hero-radar.jpg",
    caption: "Demo placeholder — replace with real still",
  },
  { name: "Starlink" },
  { name: "Viasat" },
  { name: "Toyota" },
  { name: "Ferrari" },
  { name: "Audi" },
  { name: "Sony Pictures" },
  { name: "Mercedes-Benz" },
  { name: "Netflix" },
  { name: "McDonald's" },
  { name: "Coca-Cola" },
  { name: "Shell" },
  { name: "GE" },
  { name: "Universal" },
  { name: "Warner Bros" },
];

export default function StudioBrands() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Brand | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative"
    >
      {/* Top + bottom dividers */}
      <div
        className="absolute top-0 left-[5%] right-[5%] h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,var(--wd-divider),transparent)",
        }}
      />
      <div
        className="absolute bottom-0 left-[5%] right-[5%] h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,var(--wd-divider),transparent)",
        }}
      />

      <Reveal>
        <section className="py-[clamp(44px,6vw,72px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto text-center">
          <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold/60 mb-6">
            Credits // Past Lives
          </div>
          <div className="font-serif text-[clamp(17px,1.7vw,22px)] font-normal text-wd-text/90 leading-[1.5] flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 max-w-[1080px] mx-auto">
            {brands.map((brand, i) => (
              <span
                key={brand.name}
                className="flex items-center gap-3"
              >
                <span
                  className="hover:text-wd-gold transition-colors duration-300 cursor-default"
                  onMouseEnter={() => setHovered(brand)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {brand.name}
                </span>
                {i < brands.length - 1 && (
                  <span className="text-wd-gold/50 text-[9px]">◆</span>
                )}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Floating still on hover — only renders when the hovered brand has a still
          defined. Position tracks the cursor with offset; clamps so it doesn't
          overflow the right edge. Hidden on mobile (no hover). */}
      <AnimatePresence>
        {hovered?.still && (
          <motion.div
            key={hovered.name}
            className="absolute pointer-events-none z-[20] hidden md:block"
            style={{
              left: Math.min(
                mousePos.x + 28,
                (containerRef.current?.clientWidth ?? 1200) - 300
              ),
              top: Math.max(mousePos.y - 230, 12),
              width: 280,
            }}
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-wd-gold/40 shadow-[0_12px_36px_rgba(0,0,0,0.7),0_0_0_1px_rgba(212,168,67,0.08)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hovered.still}
                alt={hovered.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3.5 right-3.5">
                <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold">
                  {hovered.name}
                </div>
                {hovered.caption && (
                  <div className="font-mono text-[8px] tracking-[0.25em] uppercase text-wd-muted/90 mt-1">
                    {hovered.caption}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
