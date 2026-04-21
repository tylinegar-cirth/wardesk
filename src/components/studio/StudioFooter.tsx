"use client";

import Link from "next/link";
import FlagStripes from "@/components/ui/FlagStripes";
import MarqueeTicker from "@/components/ui/MarqueeTicker";

const studioCols = [
  {
    label: "Studio",
    links: [
      { name: "Capabilities", href: "/studio#capabilities" },
      { name: "Team", href: "/studio#team" },
      { name: "Ecosystem", href: "/studio/ecosystem" },
      { name: "Essays", href: "/studio/essays" },
    ],
  },
  {
    label: "Capabilities",
    links: [
      { name: "Narrative & Voice", href: "/studio#capabilities" },
      { name: "Embedded Creative", href: "/studio#capabilities" },
      { name: "Campaigns & Films", href: "/studio#capabilities" },
      { name: "Roadshow & Live Events", href: "/studio#capabilities" },
    ],
  },
  {
    label: "Connect",
    links: [
      { name: "ty@thewardesk.com", href: "mailto:ty@thewardesk.com" },
      { name: "Client Portal →", href: "/studio/login" },
      { name: "The War Desk →", href: "/" },
    ],
  },
];

const footerTickerItems = [
  <span key="1" className="font-display text-wd-bone text-[clamp(40px,6vw,80px)] leading-none tracking-[-0.02em] uppercase">War Desk Studio</span>,
  <span key="2" className="font-serif italic text-wd-gold text-[clamp(40px,6vw,80px)] leading-none tracking-[-0.01em]">Business is War.</span>,
  <span key="3" className="font-display text-wd-bone/40 text-[clamp(40px,6vw,80px)] leading-none tracking-[-0.02em] uppercase">We Forge Your Legend</span>,
  <span key="4" className="font-serif italic text-wd-gold/70 text-[clamp(40px,6vw,80px)] leading-none tracking-[-0.01em]">For the companies advancing Western capability.</span>,
];

export default function StudioFooter() {
  return (
    <footer className="relative border-t border-wd-gold/40 mt-4 bg-wd-bg overflow-hidden">
      {/* Giant ticker banner */}
      <div className="py-6 border-b border-wd-gold/25">
        <MarqueeTicker items={footerTickerItems} speed="normal" divider="◆" />
      </div>

      {/* Main footer body */}
      <div className="px-[clamp(16px,4vw,72px)] pt-[clamp(48px,7vw,88px)] pb-[clamp(32px,4vw,56px)] max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand block */}
          <div className="md:col-span-5">
            <Link
              href="/studio"
              className="inline-flex items-center gap-3 mb-5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-gold.png" alt="" className="h-10 w-auto" />
              <span className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-wd-text leading-none">
                  War Desk
                </span>
                <span className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-wd-gold leading-none">
                  Studio
                </span>
              </span>
            </Link>
            <p className="font-sans text-[13px] text-wd-sub leading-[1.65] max-w-[380px]">
              The creative force behind Western capability. Campaigns, films,
              and experiences for the companies advancing hard tech, defense,
              and aerospace.
            </p>
          </div>

          {/* Nav columns */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {studioCols.map((col) => (
              <div key={col.label}>
                <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold/70 mb-4 pb-2 border-b border-wd-gold/20">
                  {col.label}
                </div>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      {link.href.startsWith("/") ||
                      link.href.startsWith("mailto:") ? (
                        <Link
                          href={link.href}
                          className="font-mono text-[11px] tracking-[0.08em] uppercase text-wd-sub hover:text-wd-gold transition-colors duration-300"
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="font-mono text-[11px] tracking-[0.08em] uppercase text-wd-sub hover:text-wd-gold transition-colors duration-300"
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
      </div>

      {/* Bottom legal strip */}
      <div className="px-[clamp(16px,4vw,72px)] py-5 border-t border-wd-gold/25 max-w-[1600px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-[10px] tracking-[0.2em] text-wd-muted uppercase">
            © 2026 War Desk Studio
          </div>

          <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-muted flex items-center gap-2">
            <FlagStripes className="w-6 h-3" variant="gold" />
            <span className="text-wd-gold/80">Made in USA</span>
          </div>

          <div className="font-mono text-[10px] tracking-[0.2em] text-wd-muted uppercase">
            A{" "}
            <Link
              href="/"
              className="text-wd-text hover:text-wd-gold transition-colors duration-300"
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
