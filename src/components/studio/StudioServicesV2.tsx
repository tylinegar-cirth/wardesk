"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Service data ─── */
const services = [
  {
    id: "content",
    label: "01",
    title: "Content\nProduction",
    brief: "Ongoing video, social, and written content for LinkedIn, recruiting, and awareness.",
    tags: ["Social", "LinkedIn", "Video", "Recruiting", "Written"],
  },
  {
    id: "films",
    label: "02",
    title: "Brand\nFilms",
    brief: "Recruitment films, capability videos, founder stories, full-scale commercials. Cinematic work that matches the gravity of what you\u2019re building.",
    tags: ["Recruitment", "Capability", "Founder Stories", "Commercials"],
  },
  {
    id: "campaigns",
    label: "03",
    title: "Campaigns",
    brief: "Go-to-market positioning, messaging, and content strategy built for defense buyers.",
    tags: ["GTM", "Positioning", "Messaging", "Strategy"],
  },
  {
    id: "roadshow",
    label: "04",
    title: "Roadshow &\nBooth Production",
    brief: "AUSA. SOFIC. Space Symposium. Full booth experiences, video walls, demo environments, and on-site support.",
    tags: ["AUSA", "SOFIC", "Space Symposium", "Booth Design", "Video Walls"],
  },
  {
    id: "investor",
    label: "05",
    title: "Investor\nContent",
    brief: "Pitch videos, sizzle reels, and investor materials that communicate traction and vision.",
    tags: ["Pitch Video", "Sizzle Reel", "Investor Materials"],
  },
];

/* ─── Technical SVG drawings per service ─── */
const cadDrawings: Record<string, JSX.Element> = {
  content: (
    <g>
      {/* Lens / aperture wireframe */}
      <circle cx="200" cy="200" r="120" strokeDasharray="4 8" />
      <circle cx="200" cy="200" r="80" />
      <circle cx="200" cy="200" r="40" strokeDasharray="2 6" />
      {/* Aperture blades */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={angle}
          x1="200"
          y1="120"
          x2="200"
          y2="160"
          transform={`rotate(${angle} 200 200)`}
        />
      ))}
      {/* Dimension lines */}
      <line x1="60" y1="340" x2="340" y2="340" strokeDasharray="2 4" />
      <line x1="60" y1="335" x2="60" y2="345" />
      <line x1="340" y1="335" x2="340" y2="345" />
      {/* Crosshair */}
      <line x1="200" y1="150" x2="200" y2="250" strokeDasharray="1 3" />
      <line x1="150" y1="200" x2="250" y2="200" strokeDasharray="1 3" />
    </g>
  ),
  films: (
    <g>
      {/* Film frame / viewport */}
      <rect x="80" y="100" width="240" height="160" rx="2" />
      <rect x="100" y="120" width="200" height="120" rx="1" strokeDasharray="4 4" />
      {/* Rule of thirds */}
      <line x1="167" y1="120" x2="167" y2="240" strokeDasharray="2 6" />
      <line x1="233" y1="120" x2="233" y2="240" strokeDasharray="2 6" />
      <line x1="100" y1="160" x2="300" y2="160" strokeDasharray="2 6" />
      <line x1="100" y1="200" x2="300" y2="200" strokeDasharray="2 6" />
      {/* Sprocket holes */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x={92 + i * 28} y="88" width="12" height="8" rx="1" />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={`b${i}`} x={92 + i * 28} y="264" width="12" height="8" rx="1" />
      ))}
      {/* Focal length annotation */}
      <line x1="60" y1="100" x2="60" y2="260" strokeDasharray="2 4" />
      <line x1="55" y1="100" x2="65" y2="100" />
      <line x1="55" y1="260" x2="65" y2="260" />
    </g>
  ),
  campaigns: (
    <g>
      {/* Radar / targeting system */}
      <circle cx="200" cy="200" r="140" strokeDasharray="8 4" />
      <circle cx="200" cy="200" r="100" />
      <circle cx="200" cy="200" r="60" strokeDasharray="4 8" />
      <circle cx="200" cy="200" r="20" />
      {/* Crosshairs */}
      <line x1="200" y1="40" x2="200" y2="360" strokeDasharray="2 6" />
      <line x1="40" y1="200" x2="360" y2="200" strokeDasharray="2 6" />
      {/* Sweep line */}
      <line x1="200" y1="200" x2="320" y2="120" />
      {/* Target blips */}
      <circle cx="260" cy="160" r="4" />
      <circle cx="160" cy="140" r="3" />
      <circle cx="240" cy="260" r="3" />
      {/* Angle markers */}
      <path d="M 200 180 A 20 20 0 0 1 216 188" fill="none" />
    </g>
  ),
  roadshow: (
    <g>
      {/* Booth floor plan - top down */}
      <rect x="80" y="80" width="240" height="200" rx="2" strokeDasharray="8 4" />
      {/* Main display wall */}
      <rect x="100" y="90" width="200" height="20" />
      {/* Video wall panels */}
      <rect x="110" y="94" width="40" height="12" rx="1" strokeDasharray="2 2" />
      <rect x="160" y="94" width="80" height="12" rx="1" strokeDasharray="2 2" />
      <rect x="250" y="94" width="40" height="12" rx="1" strokeDasharray="2 2" />
      {/* Demo stations */}
      <circle cx="140" cy="180" r="20" strokeDasharray="4 4" />
      <circle cx="260" cy="180" r="20" strokeDasharray="4 4" />
      {/* Meeting area */}
      <rect x="160" y="220" width="80" height="40" rx="8" strokeDasharray="4 4" />
      {/* Entry arrows */}
      <line x1="200" y1="300" x2="200" y2="280" />
      <line x1="195" y1="285" x2="200" y2="280" />
      <line x1="205" y1="285" x2="200" y2="280" />
      {/* Dimension annotations */}
      <line x1="80" y1="310" x2="320" y2="310" strokeDasharray="2 4" />
      <line x1="80" y1="305" x2="80" y2="315" />
      <line x1="320" y1="305" x2="320" y2="315" />
      <line x1="350" y1="80" x2="350" y2="280" strokeDasharray="2 4" />
      <line x1="345" y1="80" x2="355" y2="80" />
      <line x1="345" y1="280" x2="355" y2="280" />
    </g>
  ),
  investor: (
    <g>
      {/* Growth chart frame */}
      <line x1="80" y1="300" x2="80" y2="60" />
      <line x1="80" y1="300" x2="340" y2="300" />
      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`h${i}`}
          x1="80"
          y1={300 - i * 60}
          x2="340"
          y2={300 - i * 60}
          strokeDasharray="2 8"
        />
      ))}
      {/* Growth curve */}
      <path
        d="M 80 280 Q 140 270 180 240 T 260 160 T 330 80"
        fill="none"
        strokeWidth="2"
      />
      {/* Data points */}
      <circle cx="120" cy="268" r="3" />
      <circle cx="180" cy="240" r="3" />
      <circle cx="230" cy="200" r="3" />
      <circle cx="280" cy="140" r="3" />
      <circle cx="330" cy="80" r="4" />
      {/* Projection zone */}
      <path
        d="M 280 140 L 330 80 L 340 100 L 290 160 Z"
        fill="none"
        strokeDasharray="3 3"
      />
      {/* Axis labels */}
      <line x1="75" y1="300" x2="85" y2="300" />
      <line x1="75" y1="240" x2="85" y2="240" />
      <line x1="75" y1="180" x2="85" y2="180" />
      <line x1="75" y1="120" x2="85" y2="120" />
    </g>
  ),
};

/* ─── Grid background component ─── */
function TechGrid({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.15]">
        <defs>
          <pattern
            id="dotgrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="20" r="0.8" fill="rgb(var(--wd-muted))" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>
      {/* Mouse glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] pointer-events-none transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle, rgba(212,168,67,0.4) 0%, transparent 70%)",
          left: mouseX - 300,
          top: mouseY - 300,
        }}
      />
    </div>
  );
}

/* ─── Animated CAD SVG ─── */
function CadIllustration({
  serviceId,
  isActive,
}: {
  serviceId: string;
  isActive: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="w-full h-full"
      initial={false}
    >
      <g
        stroke={isActive ? "rgba(212,168,67,0.6)" : "rgba(255,255,255,0.12)"}
        strokeWidth="1"
        fill="none"
        style={{
          transition: "stroke 0.6s ease, opacity 0.6s ease",
          opacity: isActive ? 1 : 0.5,
        }}
      >
        {cadDrawings[serviceId]}
      </g>
    </motion.svg>
  );
}

/* ─── Service row ─── */
function ServiceRow({
  service,
  index,
  isActive,
  onHover,
}: {
  service: (typeof services)[0];
  index: number;
  isActive: boolean;
  onHover: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="group relative grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-16 items-center py-12 lg:py-16 cursor-default"
      onMouseEnter={onHover}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Separator line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: isActive
            ? "linear-gradient(90deg, transparent, rgba(212,168,67,0.3), transparent)"
            : "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          transition: "background 0.6s ease",
        }}
      />

      {/* Text content */}
      <div className="relative">
        {/* Service number */}
        <motion.span
          className="font-mono text-[11px] tracking-[0.2em] block mb-4"
          style={{
            color: isActive ? "rgb(212,168,67)" : "rgb(var(--wd-muted))",
            transition: "color 0.4s ease",
          }}
        >
          {service.label}
        </motion.span>

        {/* Title */}
        <h3
          className="font-serif text-[clamp(32px,4vw,52px)] font-normal leading-[1.05] mb-5 whitespace-pre-line"
          style={{
            color: isActive ? "rgb(var(--wd-text))" : "rgb(var(--wd-muted))",
            transition: "color 0.4s ease",
          }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <motion.p
          className="font-sans text-[15px] leading-[1.7] max-w-[480px] mb-6"
          style={{
            color: isActive ? "rgb(var(--wd-sub))" : "rgb(var(--wd-muted))",
            opacity: isActive ? 1 : 0.5,
            transition: "color 0.4s ease, opacity 0.4s ease",
          }}
        >
          {service.brief}
        </motion.p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {service.tags.map((tag, i) => (
            <motion.span
              key={tag}
              className="font-mono text-[9px] tracking-[0.15em] uppercase py-1.5 px-3 rounded border"
              style={{
                borderColor: isActive
                  ? "rgba(212,168,67,0.25)"
                  : "rgba(255,255,255,0.06)",
                color: isActive ? "rgb(212,168,67)" : "rgb(var(--wd-muted))",
                background: isActive
                  ? "rgba(212,168,67,0.06)"
                  : "transparent",
                transition: "all 0.4s ease",
                transitionDelay: `${i * 30}ms`,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* CAD illustration */}
      <div className="hidden lg:block relative w-full aspect-square max-w-[320px] justify-self-end">
        <CadIllustration serviceId={service.id} isActive={isActive} />
        {/* Technical annotations */}
        <motion.div
          className="absolute bottom-2 right-2 font-mono text-[8px] tracking-[0.2em] uppercase"
          style={{
            color: isActive ? "rgba(212,168,67,0.4)" : "rgba(255,255,255,0.08)",
            transition: "color 0.6s ease",
          }}
        >
          WD-{service.label} {"//"} {service.id.toUpperCase()}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─── */
export default function StudioServicesV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-[clamp(80px,12vw,140px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto overflow-hidden"
    >
      <TechGrid mouseX={mousePos.x} mouseY={mousePos.y} />

      {/* Header */}
      <motion.div
        ref={headerRef}
        className="relative mb-16 lg:mb-24"
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-4">
          Systems &amp; Services
        </div>
        <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-normal text-wd-text leading-[1.05] mb-5 max-w-[700px]">
          The creative company for defense and hard tech
        </h2>
        <p className="font-sans text-[clamp(14px,1.4vw,16px)] font-light text-wd-sub leading-[1.7] max-w-[560px]">
          We embed as your creative department. Strategy, production, and content
          from a team that already knows your buyers and your mission.
        </p>
      </motion.div>

      {/* Services */}
      <div className="relative">
        {services.map((service, i) => (
          <ServiceRow
            key={service.id}
            service={service}
            index={i}
            isActive={activeIndex === i}
            onHover={() => setActiveIndex(i)}
          />
        ))}
        {/* Bottom line */}
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
          }}
        />
      </div>
    </section>
  );
}
