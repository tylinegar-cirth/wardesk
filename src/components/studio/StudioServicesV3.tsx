"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import CornerBrackets from "@/components/ui/CornerBrackets";

/* ─── Service data ─── */
interface Service {
  id: string;
  label: string;
  title: string;
  tags: string[];
  x: number; // percent of container width
  y: number; // percent of container height
}

const services: Service[] = [
  {
    id: "films",
    label: "01",
    title: "Brand Films",
    tags: ["Recruitment", "Capability", "Founder Stories", "Commercials"],
    x: 22,
    y: 18,
  },
  {
    id: "content",
    label: "02",
    title: "Content Production",
    tags: ["Social", "Copywriting", "Video", "Podcasts"],
    x: 78,
    y: 14,
  },
  {
    id: "campaigns",
    label: "03",
    title: "Campaigns",
    tags: ["GTM", "Positioning", "Messaging", "Strategy"],
    x: 86,
    y: 62,
  },
  {
    id: "roadshow",
    label: "04",
    title: "Roadshow & Live Events",
    tags: ["AUSA", "SOFIC", "LED Volume", "Keynote", "Launch"],
    x: 50,
    y: 86,
  },
  {
    id: "investor",
    label: "05",
    title: "Investor Content",
    tags: ["Pitch Video", "Sizzle Reel", "Investor Materials"],
    x: 14,
    y: 58,
  },
];

/* ─── Connection graph ─── */
const connections: [string, string][] = [
  // Pentagon ring — the delivery loop
  ["films", "content"],
  ["content", "campaigns"],
  ["campaigns", "roadshow"],
  ["roadshow", "investor"],
  ["investor", "films"],
  // Cross-diagonals — the cross-feed synergies
  ["films", "campaigns"],
  ["content", "investor"],
];

/* ─── Node card ─── */
function ServiceNode({
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
        width: "clamp(190px, 17vw, 240px)",
        zIndex: isActive ? 10 : 5,
      }}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
      transition={{
        duration: 0.8,
        delay: 1.35 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div
        className="relative rounded-lg border p-4 cursor-default transition-all duration-500"
        style={{
          borderColor: isActive
            ? "rgba(212,168,67,0.7)"
            : "rgba(212,168,67,0.22)",
          background: isActive
            ? "rgba(22,16,6,0.92)"
            : "rgba(10,10,10,0.88)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: isActive
            ? "0 0 52px rgba(212,168,67,0.32), 0 6px 24px rgba(0,0,0,0.7)"
            : "0 0 22px rgba(0,0,0,0.55), 0 2px 12px rgba(0,0,0,0.4)",
          opacity: isDimmed ? 0.38 : 1,
        }}
      >
        {/* Tiny corner ticks — node feels like a component, not a box */}
        <span
          className="absolute top-1 left-1 w-1.5 h-1.5 border-l border-t"
          style={{
            borderColor: isActive
              ? "rgba(212,168,67,0.8)"
              : "rgba(212,168,67,0.4)",
          }}
        />
        <span
          className="absolute top-1 right-1 w-1.5 h-1.5 border-r border-t"
          style={{
            borderColor: isActive
              ? "rgba(212,168,67,0.8)"
              : "rgba(212,168,67,0.4)",
          }}
        />
        <span
          className="absolute bottom-1 left-1 w-1.5 h-1.5 border-l border-b"
          style={{
            borderColor: isActive
              ? "rgba(212,168,67,0.8)"
              : "rgba(212,168,67,0.4)",
          }}
        />
        <span
          className="absolute bottom-1 right-1 w-1.5 h-1.5 border-r border-b"
          style={{
            borderColor: isActive
              ? "rgba(212,168,67,0.8)"
              : "rgba(212,168,67,0.4)",
          }}
        />

        <span
          className="font-mono text-[9px] tracking-[0.3em] block mb-2 transition-colors duration-500"
          style={{
            color: isActive ? "rgb(212,168,67)" : "rgba(212,168,67,0.65)",
          }}
        >
          S // {service.label}
        </span>
        <h3
          className="font-serif text-[clamp(16px,1.35vw,20px)] font-normal leading-[1.12] mb-3 transition-colors duration-500"
          style={{
            color: isActive
              ? "rgb(var(--wd-text))"
              : "rgba(255,255,255,0.9)",
          }}
        >
          {service.title}
        </h3>
        <div className="flex flex-wrap gap-1">
          {service.tags.slice(0, 4).map((tag, i) => (
            <span
              key={tag}
              className="font-mono text-[7px] tracking-[0.12em] uppercase py-[3px] px-[6px] rounded border transition-all duration-500"
              style={{
                borderColor: isActive
                  ? "rgba(212,168,67,0.5)"
                  : "rgba(255,255,255,0.13)",
                color: isActive
                  ? "rgb(212,168,67)"
                  : "rgba(255,255,255,0.62)",
                background: isActive
                  ? "rgba(212,168,67,0.07)"
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

/* ─── Main component ─── */
export default function StudioServicesV3() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const constellationRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const constellationInView = useInView(constellationRef, {
    once: true,
    amount: 0.2,
  });

  return (
    <section
      id="services"
      className="relative py-[clamp(72px,11vw,130px)] px-[clamp(20px,5vw,72px)] max-w-[1400px] mx-auto overflow-hidden"
    >
      <CornerBrackets
        size={24}
        inset={12}
        color="rgba(212,168,67,0.35)"
        strokeWidth={1}
      />

      {/* Header */}
      <motion.div
        ref={headerRef}
        className="relative mb-14 flex items-start justify-between gap-8"
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

      {/* Desktop constellation */}
      <div
        ref={constellationRef}
        className="relative hidden md:block w-full aspect-[16/9] min-h-[540px] max-h-[760px]"
      >
        {/* Grid dot background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(212,168,67,0.1) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 40%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 40%, transparent 85%)",
          }}
        />

        {/* Quadrant crosshair — very subtle */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(212,168,67,0.08) 20%, rgba(212,168,67,0.08) 80%, transparent 100%)",
          }}
        />
        <div
          className="absolute top-1/2 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.08) 20%, rgba(212,168,67,0.08) 80%, transparent 100%)",
          }}
        />

        {/* Corner coordinate labels — ops board feel */}
        <div className="absolute top-2 left-2 font-mono text-[8px] tracking-[0.25em] uppercase text-wd-gold/45 pointer-events-none">
          Ops // Matrix
        </div>
        <div className="absolute top-2 right-2 font-mono text-[8px] tracking-[0.25em] uppercase text-wd-gold/45 pointer-events-none text-right">
          07 Links
          <br />
          <span className="text-wd-muted">05 Nodes</span>
        </div>
        <div className="absolute bottom-2 left-2 font-mono text-[8px] tracking-[0.25em] uppercase text-wd-gold/45 pointer-events-none">
          Delivery System
        </div>
        <div className="absolute bottom-2 right-2 font-mono text-[8px] tracking-[0.25em] uppercase text-wd-gold/45 pointer-events-none text-right">
          V // 3.0
        </div>

        {/* SVG connection graph */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {connections.map(([aId, bId], i) => {
            const a = services.find((s) => s.id === aId)!;
            const b = services.find((s) => s.id === bId)!;
            const d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
            const isActive =
              activeId === aId || activeId === bId;
            const isDimmed = activeId !== null && !isActive;
            const baseDelay = 0.35 + i * 0.17;

            return (
              <g
                key={`${aId}-${bId}`}
                style={{
                  transition: "opacity 0.4s ease",
                  opacity: isDimmed ? 0.14 : 1,
                }}
              >
                {/* Outer glow */}
                <motion.path
                  d={d}
                  stroke={
                    isActive
                      ? "rgba(212,168,67,0.4)"
                      : "rgba(212,168,67,0.15)"
                  }
                  strokeWidth="4"
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
                    duration: 1.4,
                    delay: baseDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
                {/* Mid glow */}
                <motion.path
                  d={d}
                  stroke={
                    isActive
                      ? "rgba(212,168,67,0.65)"
                      : "rgba(212,168,67,0.32)"
                  }
                  strokeWidth="2"
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
                    duration: 1.4,
                    delay: baseDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
                {/* Core line */}
                <motion.path
                  d={d}
                  stroke={
                    isActive
                      ? "rgba(255,220,140,1)"
                      : "rgba(212,168,67,0.7)"
                  }
                  strokeWidth="1"
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
                    duration: 1.4,
                    delay: baseDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </g>
            );
          })}

          {/* Node center dots — breathing */}
          {services.map((service, i) => (
            <motion.circle
              key={service.id}
              cx={service.x}
              cy={service.y}
              r="0.6"
              fill="rgba(255,220,140,0.95)"
              vectorEffect="non-scaling-stroke"
              initial={{ scale: 0, opacity: 0 }}
              animate={
                constellationInView
                  ? {
                      scale: [0, 1, 1.25, 1],
                      opacity: [0, 1, 0.6, 1],
                    }
                  : { scale: 0, opacity: 0 }
              }
              transition={{
                scale: {
                  duration: 2.8,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: 1.8 + i * 0.25,
                  times: [0, 0.2, 0.6, 1],
                },
                opacity: {
                  duration: 2.8,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: 1.8 + i * 0.25,
                  times: [0, 0.2, 0.6, 1],
                },
              }}
            />
          ))}
        </svg>

        {/* Service nodes — HTML cards */}
        {services.map((service, i) => (
          <ServiceNode
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

      {/* Mobile — stacked cards, no constellation */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="relative rounded-lg border border-wd-border bg-wd-card/60 p-5"
          >
            <span className="font-mono text-[9px] tracking-[0.25em] text-wd-gold/70 block mb-2">
              S // {service.label}
            </span>
            <h3 className="font-serif text-[20px] text-wd-text leading-[1.15] mb-3">
              {service.title}
            </h3>
            <div className="flex flex-wrap gap-1.5">
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
