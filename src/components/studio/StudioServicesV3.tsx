"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Service data ─── */
interface Service {
  id: string;
  label: string;
  title: string;
  tags: string[];
  x: number; // % of container width
  y: number; // % of container height
}

/* 3+2 layout — top row at 28%, bottom row at 72%, mirrored L-R */
const services: Service[] = [
  {
    id: "films",
    label: "01",
    title: "Brand Films",
    tags: ["Recruitment", "Capability", "Founder Stories", "Commercials"],
    x: 20,
    y: 28,
  },
  {
    id: "content",
    label: "02",
    title: "Content Production",
    tags: ["Social", "Copywriting", "Video", "Podcasts"],
    x: 50,
    y: 28,
  },
  {
    id: "campaigns",
    label: "03",
    title: "Campaigns",
    tags: ["GTM", "Positioning", "Messaging", "Strategy"],
    x: 80,
    y: 28,
  },
  {
    id: "roadshow",
    label: "04",
    title: "Roadshow & Live Events",
    tags: ["AUSA", "SOFIC", "LED Volume", "Launch Events"],
    x: 33,
    y: 72,
  },
  {
    id: "investor",
    label: "05",
    title: "Investor Content",
    tags: ["Pitch Video", "Sizzle Reel", "Investor Materials"],
    x: 67,
    y: 72,
  },
];

/* The delivery loop: 01 → 02 → 03 → 05 → 04 → 01 */
const connections: [string, string][] = [
  ["films", "content"],
  ["content", "campaigns"],
  ["campaigns", "investor"],
  ["investor", "roadshow"],
  ["roadshow", "films"],
];

/* Clip a line segment so its ends sit outside the modules' bounding boxes.
   halfW / halfH in viewBox units (0-100). Returns null if the line
   is entirely inside the boxes. */
function clipLine(
  a: { x: number; y: number },
  b: { x: number; y: number },
  halfW: number,
  halfH: number
): { x1: number; y1: number; x2: number; y2: number } | null {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const tx = dx !== 0 ? halfW / Math.abs(dx) : Infinity;
  const ty = dy !== 0 ? halfH / Math.abs(dy) : Infinity;
  const t = Math.min(tx, ty);
  if (t >= 0.5) return null;
  return {
    x1: a.x + t * dx,
    y1: a.y + t * dy,
    x2: a.x + (1 - t) * dx,
    y2: a.y + (1 - t) * dy,
  };
}

/* ─── Service module — typography only, no box ─── */
function ServiceModule({
  service,
  index,
  isActive,
  isDimmed,
  inView,
  onHover,
  onLeave,
}: {
  service: Service;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  inView: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${service.x}%`,
        top: `${service.y}%`,
        transform: "translate(-50%, -50%)",
        width: "clamp(200px, 17vw, 260px)",
        zIndex: isActive ? 10 : 5,
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: 0.75,
        delay: 1.25 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className="relative cursor-default text-center transition-opacity duration-500"
        style={{ opacity: isDimmed ? 0.32 : 1 }}
      >
        <span
          className="font-mono text-[10px] tracking-[0.35em] block mb-3 transition-colors duration-500"
          style={{
            color: isActive ? "rgb(212,168,67)" : "rgba(212,168,67,0.55)",
          }}
        >
          {service.label}
        </span>
        <h3
          className="font-serif text-[clamp(20px,1.75vw,26px)] font-normal leading-[1.12] mb-4 transition-colors duration-500"
          style={{
            color: isActive ? "rgb(var(--wd-text))" : "rgba(255,255,255,0.92)",
          }}
        >
          {service.title}
        </h3>
        <div className="flex flex-wrap gap-1 justify-center">
          {service.tags.map((tag, i) => (
            <span
              key={tag}
              className="font-mono text-[8px] tracking-[0.12em] uppercase py-[3px] px-[7px] rounded border transition-all duration-500"
              style={{
                borderColor: isActive
                  ? "rgba(212,168,67,0.5)"
                  : "rgba(255,255,255,0.14)",
                color: isActive
                  ? "rgb(212,168,67)"
                  : "rgba(255,255,255,0.58)",
                background: isActive
                  ? "rgba(212,168,67,0.06)"
                  : "transparent",
                transitionDelay: `${i * 25}ms`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main ─── */
export default function StudioServicesV3() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const constellationRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const constellationInView = useInView(constellationRef, {
    once: true,
    amount: 0.2,
  });

  // Buffer around each module for line clipping (in viewBox units)
  const halfW = 11;
  const halfH = 14;

  return (
    <section
      id="services"
      className="relative py-[clamp(72px,11vw,130px)] px-[clamp(20px,5vw,72px)] max-w-[1400px] mx-auto overflow-hidden"
    >
      {/* Header */}
      <motion.div
        ref={headerRef}
        className="relative mb-16 flex items-start justify-between gap-8"
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative flex-1 max-w-[680px]">
          <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-4">
            Systems &amp; Services
          </div>
          <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-normal text-wd-text leading-[1.02] tracking-[-0.01em]">
            The creative company for
            <br />
            <span className="italic text-wd-gold/90">defense</span> and{" "}
            <span className="italic text-wd-gold/90">hard tech</span>.
          </h2>
        </div>
        <div className="hidden md:block pt-1 text-right">
          <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-wd-muted leading-[1.8]">
            Section // 02
            <br />
            <span className="text-wd-gold/80">Capabilities</span>
          </div>
        </div>
      </motion.div>

      {/* Desktop constellation (lg+) */}
      <div
        ref={constellationRef}
        className="relative hidden lg:block w-full aspect-[2/1] min-h-[480px] max-h-[680px]"
      >
        {/* Subtle grid dots */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(212,168,67,0.11) 1px, transparent 1px)",
            backgroundSize: "38px 38px",
            maskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.95) 35%, transparent 88%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.95) 35%, transparent 88%)",
          }}
        />

        {/* Connection graph */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {connections.map(([aId, bId], i) => {
            const a = services.find((s) => s.id === aId)!;
            const b = services.find((s) => s.id === bId)!;
            const clipped = clipLine(a, b, halfW, halfH);
            if (!clipped) return null;

            const d = `M ${clipped.x1} ${clipped.y1} L ${clipped.x2} ${clipped.y2}`;
            const isActive = activeId === aId || activeId === bId;
            const isDimmed = activeId !== null && !isActive;
            const baseDelay = 0.4 + i * 0.2;

            return (
              <g
                key={`${aId}-${bId}`}
                style={{
                  transition: "opacity 0.4s ease",
                  opacity: isDimmed ? 0.12 : 1,
                }}
              >
                {/* Outer glow */}
                <motion.path
                  d={d}
                  stroke={
                    isActive
                      ? "rgba(212,168,67,0.5)"
                      : "rgba(212,168,67,0.2)"
                  }
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: "stroke 0.4s ease" }}
                  initial={{ pathLength: 0 }}
                  animate={
                    constellationInView
                      ? { pathLength: 1 }
                      : { pathLength: 0 }
                  }
                  transition={{
                    duration: 1.3,
                    delay: baseDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
                {/* Mid glow */}
                <motion.path
                  d={d}
                  stroke={
                    isActive
                      ? "rgba(212,168,67,0.8)"
                      : "rgba(212,168,67,0.4)"
                  }
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: "stroke 0.4s ease" }}
                  initial={{ pathLength: 0 }}
                  animate={
                    constellationInView
                      ? { pathLength: 1 }
                      : { pathLength: 0 }
                  }
                  transition={{
                    duration: 1.3,
                    delay: baseDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
                {/* Core line */}
                <motion.path
                  d={d}
                  stroke={
                    isActive
                      ? "rgba(255,224,150,1)"
                      : "rgba(212,168,67,0.72)"
                  }
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: "stroke 0.4s ease" }}
                  initial={{ pathLength: 0 }}
                  animate={
                    constellationInView
                      ? { pathLength: 1 }
                      : { pathLength: 0 }
                  }
                  transition={{
                    duration: 1.3,
                    delay: baseDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Service modules */}
        {services.map((service, i) => (
          <ServiceModule
            key={service.id}
            service={service}
            index={i}
            isActive={activeId === service.id}
            isDimmed={activeId !== null && activeId !== service.id}
            inView={constellationInView}
            onHover={() => setActiveId(service.id)}
            onLeave={() => setActiveId(null)}
          />
        ))}
      </div>

      {/* Mobile + tablet — stacked centered list */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
        {services.map((service) => (
          <div key={service.id} className="text-center">
            <span className="font-mono text-[10px] tracking-[0.3em] text-wd-gold/65 block mb-2">
              {service.label}
            </span>
            <h3 className="font-serif text-[clamp(22px,3vw,26px)] text-wd-text leading-[1.15] mb-4">
              {service.title}
            </h3>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[8px] tracking-[0.15em] uppercase py-1 px-2 rounded border border-wd-border text-wd-sub"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
