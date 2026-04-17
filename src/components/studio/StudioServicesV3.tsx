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
}

const services: Service[] = [
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
    title: "Roadshow & Live Events",
    tags: ["AUSA", "SOFIC", "LED Volume", "Launch Events"],
  },
  {
    id: "investor",
    label: "05",
    title: "Investor Content",
    tags: ["Pitch Video", "Sizzle Reel", "Investor Materials"],
  },
];

/* ─── Row ─── */
function ServiceRow({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="relative border-t border-wd-gold/25 cursor-default"
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
      transition={{
        duration: 1.1,
        delay: index * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover gradient sweep — slides in from left */}
      <motion.div
        className="absolute inset-0 pointer-events-none origin-left"
        style={{
          background:
            "linear-gradient(90deg, rgba(212,168,67,0.07) 0%, rgba(212,168,67,0.02) 60%, transparent 100%)",
        }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="relative grid grid-cols-[auto_1fr] items-baseline gap-4 md:gap-7 py-[clamp(14px,2vw,28px)]">
        {/* Number column — smaller, more marginal */}
        <motion.span
          className="font-mono text-[clamp(10px,0.85vw,12px)] tracking-[0.35em] self-start pt-[clamp(10px,1.1vw,18px)]"
          animate={{
            color: hovered ? "rgb(212,168,67)" : "rgba(212,168,67,0.55)",
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {service.label}
        </motion.span>

        {/* Title + tags column */}
        <motion.div animate={{ x: hovered ? 14 : 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <motion.h3
            className="font-serif font-normal leading-[0.94] tracking-[-0.02em]"
            style={{ fontSize: "clamp(40px,5.6vw,76px)" }}
            animate={{
              color: hovered ? "rgb(212,168,67)" : "rgb(var(--wd-text))",
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {service.title}
          </motion.h3>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {service.tags.map((tag, i) => (
              <span
                key={tag}
                className="font-mono text-[9px] tracking-[0.2em] uppercase py-[4px] px-[9px] rounded border transition-all duration-500"
                style={{
                  borderColor: hovered
                    ? "rgba(212,168,67,0.5)"
                    : "rgba(255,255,255,0.14)",
                  color: hovered
                    ? "rgb(212,168,67)"
                    : "rgba(255,255,255,0.58)",
                  background: hovered
                    ? "rgba(212,168,67,0.06)"
                    : "transparent",
                  transitionDelay: `${i * 30}ms`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Main ─── */
export default function StudioServicesV3() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <section
      id="services"
      className="relative pt-[clamp(72px,11vw,130px)] pb-[clamp(36px,5vw,64px)] px-[clamp(20px,5vw,72px)] max-w-[1400px] mx-auto overflow-hidden"
    >
      <CornerBrackets
        size={24}
        inset={12}
        color="rgba(212,168,67,0.35)"
        strokeWidth={1}
      />

      {/* Header — tighter margin so it connects to the first row */}
      <motion.div
        ref={headerRef}
        className="relative mb-8 md:mb-10 flex items-start justify-between gap-8"
        initial={{ opacity: 0, y: 36 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
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

      {/* Service list with vertical left rail */}
      <div className="relative">
        {/* Left rail wordmark — desktop only, anchors the list */}
        <div
          className="absolute -left-2 top-0 bottom-0 hidden lg:flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="font-mono text-[clamp(13px,1.05vw,15px)] tracking-[0.45em] uppercase font-bold text-wd-gold/55 whitespace-nowrap"
            style={{ writingMode: "vertical-rl" }}
          >
            {"// 02 \u2014 Capabilities"}
          </div>
        </div>

        {/* Rows — pushed right to make room for the rail on lg+ */}
        <div className="lg:pl-14">
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
          <div className="border-t border-wd-gold/25" />
        </div>
      </div>
    </section>
  );
}
