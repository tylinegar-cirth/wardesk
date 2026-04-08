"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ─── Service data ─── */
const services = [
  {
    id: "films",
    label: "01",
    title: "Brand Films",
    tags: ["Recruitment", "Capability", "Founder Stories", "Commercials"],
  },
  {
    id: "content",
    label: "02",
    title: "Content Production",
    tags: ["Social", "Copywriting", "Video", "Podcasts"],
  },
  {
    id: "campaigns",
    label: "03",
    title: "Campaigns",
    tags: ["GTM", "Positioning", "Messaging", "Strategy"],
  },
  {
    id: "roadshow",
    label: "04",
    title: "Roadshow & Booth",
    tags: ["AUSA", "SOFIC", "Space Symposium", "Booth Design", "Video Walls"],
  },
  {
    id: "investor",
    label: "05",
    title: "Investor Content",
    tags: ["Pitch Video", "Sizzle Reel", "Investor Materials"],
  },
];

/* ─── CAD drawings ─── */
const cadDrawings: Record<string, JSX.Element> = {
  content: (
    <g>
      <circle cx="100" cy="100" r="60" strokeDasharray="4 8" />
      <circle cx="100" cy="100" r="40" />
      <circle cx="100" cy="100" r="20" strokeDasharray="2 6" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a} x1="100" y1="60" x2="100" y2="76" transform={`rotate(${a} 100 100)`} />
      ))}
      <line x1="100" y1="70" x2="100" y2="130" strokeDasharray="1 3" />
      <line x1="70" y1="100" x2="130" y2="100" strokeDasharray="1 3" />
    </g>
  ),
  films: (
    <g>
      <rect x="20" y="40" width="160" height="100" rx="2" />
      <rect x="32" y="50" width="136" height="80" rx="1" strokeDasharray="4 4" />
      <line x1="77" y1="50" x2="77" y2="130" strokeDasharray="2 6" />
      <line x1="123" y1="50" x2="123" y2="130" strokeDasharray="2 6" />
      <line x1="32" y1="77" x2="168" y2="77" strokeDasharray="2 6" />
      <line x1="32" y1="103" x2="168" y2="103" strokeDasharray="2 6" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={28 + i * 24} y="32" width="14" height="6" rx="1" />
      ))}
    </g>
  ),
  campaigns: (
    <g>
      <circle cx="100" cy="100" r="80" strokeDasharray="8 4" />
      <circle cx="100" cy="100" r="55" />
      <circle cx="100" cy="100" r="30" strokeDasharray="4 8" />
      <circle cx="100" cy="100" r="8" />
      <line x1="100" y1="10" x2="100" y2="190" strokeDasharray="2 6" />
      <line x1="10" y1="100" x2="190" y2="100" strokeDasharray="2 6" />
      <line x1="100" y1="100" x2="160" y2="55" />
      <circle cx="140" cy="70" r="3" />
      <circle cx="75" cy="60" r="2.5" />
    </g>
  ),
  roadshow: (
    <g>
      <rect x="20" y="20" width="160" height="140" rx="2" strokeDasharray="8 4" />
      <rect x="35" y="28" width="130" height="16" />
      <rect x="42" y="32" width="30" height="8" rx="1" strokeDasharray="2 2" />
      <rect x="82" y="32" width="50" height="8" rx="1" strokeDasharray="2 2" />
      <rect x="142" y="32" width="18" height="8" rx="1" strokeDasharray="2 2" />
      <circle cx="65" cy="95" r="16" strokeDasharray="4 4" />
      <circle cx="135" cy="95" r="16" strokeDasharray="4 4" />
      <rect x="72" y="125" width="56" height="24" rx="6" strokeDasharray="4 4" />
      <line x1="100" y1="175" x2="100" y2="160" />
      <line x1="96" y1="164" x2="100" y2="160" />
      <line x1="104" y1="164" x2="100" y2="160" />
    </g>
  ),
  investor: (
    <g>
      <line x1="30" y1="170" x2="30" y2="20" />
      <line x1="30" y1="170" x2="180" y2="170" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="30" y1={170 - i * 40} x2="180" y2={170 - i * 40} strokeDasharray="2 8" />
      ))}
      <path d="M 30 155 Q 65 148 85 130 T 135 70 T 175 30" fill="none" strokeWidth="1.5" />
      <circle cx="55" cy="148" r="2.5" />
      <circle cx="85" cy="130" r="2.5" />
      <circle cx="120" cy="90" r="2.5" />
      <circle cx="150" cy="55" r="3" />
      <circle cx="175" cy="30" r="3.5" />
    </g>
  ),
};

/* ─── Service card ─── */
function ServiceCard({
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
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="group relative cursor-default"
      onMouseEnter={onHover}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative rounded-lg border p-6 h-full overflow-hidden transition-all duration-500"
        style={{
          borderColor: isActive ? "rgba(212,168,67,0.2)" : "rgba(255,255,255,0.04)",
          background: isActive ? "rgba(212,168,67,0.03)" : "rgba(255,255,255,0.01)",
        }}
      >
        {/* CAD illustration — positioned in background */}
        <div
          className="absolute -right-4 -bottom-4 w-[180px] h-[180px] transition-opacity duration-600"
          style={{ opacity: isActive ? 0.35 : 0.08 }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <g
              stroke={isActive ? "rgba(212,168,67,0.7)" : "rgba(255,255,255,0.3)"}
              strokeWidth="0.8"
              fill="none"
              style={{ transition: "stroke 0.5s ease" }}
            >
              {cadDrawings[service.id]}
            </g>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-[1]">
          {/* Number */}
          <span
            className="font-mono text-[10px] tracking-[0.2em] block mb-3 transition-colors duration-400"
            style={{ color: isActive ? "rgb(212,168,67)" : "rgb(var(--wd-muted))" }}
          >
            {service.label}
          </span>

          {/* Title */}
          <h3
            className="font-serif text-[clamp(22px,2.5vw,28px)] font-normal leading-[1.15] mb-5 transition-colors duration-400"
            style={{ color: isActive ? "rgb(var(--wd-text))" : "rgb(var(--wd-muted))" }}
          >
            {service.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {service.tags.map((tag, i) => (
              <span
                key={tag}
                className="font-mono text-[8px] tracking-[0.15em] uppercase py-1 px-2.5 rounded border transition-all duration-400"
                style={{
                  borderColor: isActive ? "rgba(212,168,67,0.3)" : "rgba(255,255,255,0.06)",
                  color: isActive ? "rgb(212,168,67)" : "rgb(var(--wd-muted))",
                  background: isActive ? "rgba(212,168,67,0.08)" : "transparent",
                  transitionDelay: `${i * 25}ms`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─── */
export default function StudioServicesV2() {
  const [activeIndex, setActiveIndex] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <section
      id="services"
      className="relative py-[clamp(64px,10vw,120px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto overflow-hidden"
    >

      {/* Header */}
      <motion.div
        ref={headerRef}
        className="relative mb-12"
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          Systems &amp; Services
        </div>
        <h2 className="font-serif text-[clamp(28px,4vw,48px)] font-normal text-wd-text leading-[1.08] max-w-[600px]">
          The creative company for defense and hard tech
        </h2>
      </motion.div>

      {/* Grid — 3 top, 2 bottom centered */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.slice(0, 3).map((service, i) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={i}
            isActive={activeIndex === i}
            onHover={() => setActiveIndex(i)}
          />
        ))}
      </div>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 max-w-full md:max-w-[calc(66.666%-4px)] lg:max-w-[calc(66.666%+2px)] mx-auto">
        {services.slice(3).map((service, i) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={i + 3}
            isActive={activeIndex === i + 3}
            onHover={() => setActiveIndex(i + 3)}
          />
        ))}
      </div>
    </section>
  );
}
