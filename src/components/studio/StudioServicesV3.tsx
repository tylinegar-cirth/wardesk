"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Service {
  id: string;
  label: string;
  title: string;
  tags: string[];
}

const services: Service[] = [
  {
    id: "narrative",
    label: "01",
    title: "Narrative & Voice",
    tags: ["Brand Narrative", "Voice Architecture", "Positioning", "Content Strategy"],
  },
  {
    id: "embedded",
    label: "02",
    title: "Embedded Creative",
    tags: ["Monthly Retainer", "Production Days", "Long & short form content", "Creative Direction"],
  },
  {
    id: "campaigns",
    label: "03",
    title: "Campaigns & Films",
    tags: ["Launch Campaigns", "Recruitment Films", "Capability Films", "Investor Films", "Vodcasts"],
  },
  {
    id: "roadshow",
    label: "04",
    title: "Roadshow & Live Events",
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
      {/* Hover fill: ink-on-gold reversal */}
      <motion.div
        className="absolute inset-0 pointer-events-none bg-wd-gold origin-left"
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />

      <div
        className="relative grid grid-cols-12 gap-x-4 md:gap-x-8 gap-y-4 py-[clamp(22px,3vw,40px)] px-[clamp(16px,2vw,32px)]"
        style={{ color: hovered ? "rgb(18,18,20)" : undefined }}
      >
        {/* Index column */}
        <div className="col-span-2 md:col-span-1 pt-2">
          <motion.div
            className="font-mono text-[10px] tracking-[0.32em] uppercase"
            animate={{
              color: hovered ? "rgb(18,18,20)" : "rgba(212,168,67,0.7)",
            }}
            transition={{ duration: 0.45 }}
          >
            {service.label}
          </motion.div>
        </div>

        {/* Title + tags column (stacked) */}
        <div className="col-span-10 md:col-span-11">
          <motion.h3
            className="font-display uppercase leading-[0.95] tracking-[-0.025em]"
            style={{ fontSize: "clamp(30px,4.5vw,64px)" }}
            animate={{
              color: hovered ? "rgb(18,18,20)" : "rgb(var(--wd-text))",
            }}
            transition={{ duration: 0.45 }}
          >
            {service.title}
          </motion.h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {service.tags.map((tag, i) => (
              <motion.span
                key={tag}
                className="font-mono text-[10px] tracking-[0.24em] uppercase py-[6px] px-[13px] border transition-all duration-400"
                style={{
                  borderColor: hovered ? "rgba(18,18,20,0.6)" : "rgba(212,168,67,0.35)",
                  color: hovered ? "rgb(18,18,20)" : "rgba(212,168,67,0.95)",
                  background: hovered ? "rgba(18,18,20,0.08)" : "rgba(212,168,67,0.04)",
                  transitionDelay: `${i * 30}ms`,
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
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
      className="relative pt-[clamp(72px,10vw,120px)] pb-[clamp(56px,7vw,90px)] px-[clamp(16px,4vw,72px)] overflow-hidden"
    >
      {/* Background document grid */}
      <div className="absolute inset-0 wd-grid opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-[1600px] mx-auto">
        <motion.div
          ref={headerRef}
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 36 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-wd-gold mb-4">
            02 / Capabilities
          </div>
          <h2 className="font-display text-[clamp(36px,5.5vw,76px)] uppercase leading-[0.95] tracking-[-0.025em] text-wd-text max-w-[1100px]">
            The creative company for <span className="text-wd-gold">defense</span> and{" "}
            <span className="text-wd-gold">hard tech</span>.
          </h2>
        </motion.div>

        {/* Service rows */}
        <div>
          {services.map((service, i) => (
            <ServiceRow key={service.id} service={service} index={i} />
          ))}
          <div className="border-t border-wd-gold/25" />
        </div>
      </div>
    </section>
  );
}
