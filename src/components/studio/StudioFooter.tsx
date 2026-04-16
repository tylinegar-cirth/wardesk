"use client";

import Link from "next/link";

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
  return (
    <footer className="relative border-t border-wd-border mt-4">
      {/* ─── Nav columns ─── */}
      <div className="px-[clamp(20px,5vw,72px)] pt-[clamp(48px,7vw,88px)] pb-[clamp(32px,4vw,56px)] max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          {/* Brand block */}
          <div className="md:col-span-1">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2.5 mb-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-gold.png" alt="" className="h-7 w-auto" />
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

          {/* Nav columns — desktop/tablet only, hidden on mobile (use hamburger nav) */}
          {studioCols.map((col) => (
            <div key={col.label} className="hidden md:block">
              <div className="font-mono text-[9px] tracking-[0.35em] uppercase text-wd-gold/70 mb-4">
                {col.label}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("/") ||
                    link.href.startsWith("mailto:") ? (
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
      <div className="px-[clamp(20px,5vw,72px)] py-6 max-w-[1400px] mx-auto border-t border-wd-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-[10px] tracking-[0.15em] text-wd-muted">
            &copy; 2026 War Desk Studio
          </div>

          {/* El Segundo easter-egg payoff — coordinates from the hero finally named */}
          <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-muted text-center">
            <span className="text-wd-gold/70">
              N 33°55&apos;09&quot; W 118°24&apos;59&quot;
            </span>
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
