"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

/* ─── Footer nav data ─── */
const studioCols = [
  {
    label: "Studio",
    links: [
      { name: "Manifesto", href: "/studio/manifesto" },
      { name: "Team", href: "#team" },
      { name: "Companies", href: "#ecosystem" },
    ],
  },
  {
    label: "Capabilities",
    links: [
      { name: "Brand Films", href: "#services" },
      { name: "Content Production", href: "#services" },
      { name: "Campaigns", href: "#services" },
      { name: "Roadshow & Live Events", href: "#services" },
      { name: "Investor Content", href: "#services" },
    ],
  },
  {
    label: "Connect",
    links: [
      { name: "ty@thewardesk.com", href: "mailto:ty@thewardesk.com" },
      { name: "Client Portal", href: "/studio/login" },
      { name: "The War Desk →", href: "/" },
    ],
  },
];

export default function StudioFooter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <footer
      ref={ref}
      className="relative border-t border-wd-gold/20 mt-8 overflow-hidden"
    >
      {/* ─── Closing cinematic moment — bookends the hero ─── */}
      <div className="relative px-[clamp(20px,5vw,72px)] pt-[clamp(64px,9vw,128px)] pb-[clamp(48px,6vw,80px)] max-w-[1400px] mx-auto">
        {/* Faint gold glow from below */}
        <div
          className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(212,168,67,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Logo + closing statement */}
        <motion.div
          className="relative flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow */}
          <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-wd-gold mb-6">
            {"// Forge"}
          </div>

          {/* Logo — large, gold, with subtle glow */}
          <div className="w-[clamp(96px,11vw,144px)] aspect-square mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-gold.png"
              alt="War Desk Studio"
              className="w-full h-full object-contain"
              style={{ filter: "drop-shadow(0 0 24px rgba(212,168,67,0.25))" }}
            />
          </div>

          {/* Bookend pillar — echoes the hero's "We forge your legend." */}
          <h2 className="font-serif text-[clamp(36px,5.5vw,76px)] font-normal leading-[1.05] tracking-[-0.02em] text-wd-text">
            We forge your{" "}
            <span className="italic text-wd-gold/90">legend</span>.
          </h2>

          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-muted mt-7">
            Twelve seats at the round table
          </p>

          <a
            href="#contact"
            className="mt-9 font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-9 bg-wd-gold text-wd-bg font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98]"
          >
            Work With Us
          </a>
        </motion.div>
      </div>

      {/* ─── Nav columns ─── */}
      <div className="relative px-[clamp(20px,5vw,72px)] py-[clamp(36px,5vw,64px)] max-w-[1400px] mx-auto border-t border-wd-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand block */}
          <div className="md:col-span-1">
            <Link href="/studio" className="inline-flex items-center gap-2.5 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-gold.png"
                alt=""
                className="h-7 w-auto"
              />
              <span className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-wd-text">
                War Desk{" "}
                <span className="text-wd-gold">Studio</span>
              </span>
            </Link>
            <p className="font-sans text-[12px] text-wd-sub leading-[1.65] max-w-[260px]">
              The creative force behind Western capability. Campaigns, films,
              and experiences for the companies advancing hard tech, defense,
              and aerospace.
            </p>
          </div>

          {/* Nav columns */}
          {studioCols.map((col) => (
            <div key={col.label}>
              <div className="font-mono text-[9px] tracking-[0.35em] uppercase text-wd-gold/70 mb-4">
                {col.label}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("/") || link.href.startsWith("mailto:") ? (
                      <Link
                        href={link.href}
                        className="font-sans text-[13px] text-wd-sub hover:text-wd-gold transition-colors duration-300"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="font-sans text-[13px] text-wd-sub hover:text-wd-gold transition-colors duration-300"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Bottom row — copyright, coordinates payoff, parent connection ─── */}
      <div className="relative px-[clamp(20px,5vw,72px)] py-6 max-w-[1400px] mx-auto border-t border-wd-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-[10px] tracking-[0.15em] text-wd-muted">
            &copy; 2026 War Desk Studio
          </div>

          {/* El Segundo easter-egg payoff — coordinates from the hero finally named */}
          <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-muted text-center">
            <span className="text-wd-gold/70">N 33°55&apos;09&quot; W 118°24&apos;59&quot;</span>
            <span className="mx-2 text-wd-gold/30">·</span>
            El Segundo, CA
          </div>

          <div className="font-mono text-[10px] tracking-[0.15em] text-wd-muted">
            A{" "}
            <Link
              href="/"
              className="text-wd-text hover:text-wd-gold transition-colors duration-300 underline-offset-4 hover:underline"
            >
              War Desk
            </Link>{" "}
            company
          </div>
        </div>
      </div>
    </footer>
  );
}
