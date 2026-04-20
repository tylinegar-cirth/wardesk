"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Bracket from "@/components/ui/Bracket";

interface Service {
  id: string;
  serial: string;
  label: string;
  title: string;
  description: string;
  tags: string[];
}

const services: Service[] = [
  {
    id: "narrative",
    serial: "SYS-01",
    label: "Narrative & Voice",
    title: "Narrative & Voice",
    description:
      "Brand architecture for companies whose story is already true. We shape the through-line — the way a mission lands in a sentence, a deck, a keynote, a room.",
    tags: ["Brand Narrative", "Voice Architecture", "Positioning", "Content Strategy"],
  },
  {
    id: "embedded",
    serial: "SYS-02",
    label: "Embedded Creative",
    title: "Embedded Creative",
    description:
      "A senior team plugged into your org chart. Creative direction, production, and content on retainer — built to move at the speed you build.",
    tags: ["Monthly Retainer", "Production Days", "Long & short form content", "Creative Direction"],
  },
  {
    id: "campaigns",
    serial: "SYS-03",
    label: "Campaigns & Films",
    title: "Campaigns & Films",
    description:
      "Launches, capability films, recruitment, investor narratives. Feature-grade production tuned for the specific audiences hard tech has to move.",
    tags: ["Launch Campaigns", "Recruitment Films", "Capability Films", "Investor Films", "Vodcasts"],
  },
  {
    id: "roadshow",
    serial: "SYS-04",
    label: "Roadshow & Live Events",
    title: "Roadshow & Live Events",
    description:
      "AUSA, SOFIC, Space Symposium, product launches. Stage, booth, premiere — every touchpoint engineered so the room remembers the work.",
    tags: ["AUSA", "SOFIC", "Space Symposium", "Launch Events"],
  },
];

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="relative border-t border-wd-gold/25 cursor-default overflow-hidden"
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
      transition={{
        duration: 1.0,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover fill: bone-on-ink reversal */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-wd-gold origin-left"
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />

      <div
        className="relative grid grid-cols-12 gap-4 md:gap-8 py-[clamp(22px,3vw,40px)] px-[clamp(16px,2vw,32px)]"
        style={{ color: hovered ? "rgb(18,18,20)" : undefined }}
      >
        {/* Serial column */}
        <div className="col-span-12 md:col-span-2">
          <motion.div
            className="font-mono text-[10px] tracking-[0.32em] uppercase"
            animate={{
              color: hovered ? "rgb(18,18,20)" : "rgba(212,168,67,0.7)",
            }}
            transition={{ duration: 0.45 }}
          >
            {service.serial}
          </motion.div>
          <motion.div
            className="hidden md:block mt-2 font-mono text-[9px] tracking-[0.22em] uppercase"
            animate={{
              color: hovered ? "rgba(18,18,20,0.6)" : "rgba(255,255,255,0.35)",
            }}
            transition={{ duration: 0.45 }}
          >
            MODULE / {String(index + 1).padStart(2, "0")}
          </motion.div>
        </div>

        {/* Title + description column */}
        <div className="col-span-12 md:col-span-7">
          <motion.h3
            className="font-display uppercase leading-[0.9] tracking-[-0.028em]"
            style={{ fontSize: "clamp(36px,6vw,88px)" }}
            animate={{
              color: hovered ? "rgb(18,18,20)" : "rgb(var(--wd-text))",
            }}
            transition={{ duration: 0.45 }}
          >
            {service.title}
          </motion.h3>

          <motion.p
            className="mt-4 max-w-[560px] font-sans text-[clamp(13px,1.3vw,15px)] leading-[1.7]"
            animate={{
              color: hovered ? "rgba(18,18,20,0.75)" : "rgba(245,241,232,0.6)",
            }}
            transition={{ duration: 0.45 }}
          >
            {service.description}
          </motion.p>
        </div>

        {/* Tags column */}
        <div className="col-span-12 md:col-span-3 flex flex-col gap-1.5 md:items-end">
          {service.tags.map((tag, i) => (
            <motion.span
              key={tag}
              className="font-mono text-[9px] tracking-[0.22em] uppercase py-[4px] px-[10px] border transition-all duration-400"
              style={{
                borderColor: hovered ? "rgba(18,18,20,0.45)" : "rgba(255,255,255,0.14)",
                color: hovered ? "rgb(18,18,20)" : "rgba(255,255,255,0.55)",
                background: hovered ? "rgba(18,18,20,0.05)" : "transparent",
                transitionDelay: `${i * 30}ms`,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function StudioServicesV3() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <section
      id="capabilities"
      className="relative pt-[clamp(80px,11vw,140px)] pb-[clamp(60px,8vw,100px)] px-[clamp(16px,4vw,72px)] overflow-hidden"
    >
      {/* Background document grid */}
      <div className="absolute inset-0 wd-grid opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-[1600px] mx-auto">
        {/* Header — classified memo header bar */}
        <motion.div
          ref={headerRef}
          className="mb-10 md:mb-14"
          initial={{ opacity: 0, y: 36 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Memo-style top bar */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-wd-gold/30">
            <div className="flex items-center gap-4 flex-wrap">
              <Bracket variant="gold" size="sm">
                SECTION 02 // CAPABILITIES
              </Bracket>
              <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-muted">
                DOSSIER — SYSTEMS & SERVICES
              </span>
            </div>
            <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-gold/80 hidden sm:inline">
              04 MODULES
            </span>
          </div>

          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-8">
              <h2 className="font-display text-[clamp(40px,6.5vw,88px)] uppercase leading-[0.92] tracking-[-0.025em] text-wd-text">
                The creative company for
                <br />
                <span className="text-wd-gold">defense</span> and{" "}
                <span className="text-wd-gold">hard tech</span>.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 font-mono text-[11px] tracking-[0.14em] uppercase text-wd-muted leading-[1.8]">
              <p className="max-w-[320px] text-[13px] font-sans normal-case tracking-normal text-wd-sub leading-[1.65]">
                Four operational modules. One embedded team. Built for companies
                whose story is already true and whose craft deserves better than
                a consumer-brand playbook.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Service rows */}
        <div>
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
          <div className="border-t border-wd-gold/25" />
        </div>

        {/* Closing strip */}
        <div className="mt-6 flex items-center justify-between font-mono text-[9px] tracking-[0.26em] uppercase text-wd-muted">
          <span>{"// END CAPABILITIES DOSSIER"}</span>
          <a
            href="#transmit"
            className="text-wd-gold hover:text-wd-text transition-colors flex items-center gap-2"
          >
            SCOPE A PROJECT → TRANSMIT
          </a>
        </div>
      </div>
    </section>
  );
}
