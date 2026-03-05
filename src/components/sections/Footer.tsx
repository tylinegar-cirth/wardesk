"use client";

import Link from "next/link";

const footerCols = [
  { t: "Platform", links: [
    { label: "Advisors", href: "#advisors" },
    { label: "Book a briefing", href: "#advisors" },
    { label: "Enterprise", href: "#enterprise" },
  ]},
  { t: "Media", links: [
    { label: "War Desk Live", href: "/live" },
    { label: "Newsletter", href: "#" },
  ]},
  { t: "Studio", links: [
    { label: "Services", href: "/studio#services" },
    { label: "Contact", href: "/studio#contact" },
  ]},
];

export default function Footer() {
  return (
    <footer className="py-12 px-[clamp(20px,5vw,72px)] pb-8 max-w-[1240px] mx-auto border-t border-wd-border mt-4">
      <div className="flex justify-between flex-wrap gap-8 mb-10 max-[480px]:gap-6">
        <div>
          <div className="font-mono text-xs font-bold tracking-[0.25em] uppercase text-wd-text mb-2 flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt=""
              className="h-[108px] w-auto -my-6 dark:invert max-[480px]:h-[72px] max-[480px]:-my-4"
            />
            War Desk
          </div>
          <p className="font-sans text-xs text-wd-muted leading-relaxed">
            El Segundo, California
          </p>
        </div>
        <div className="flex gap-[clamp(24px,4vw,48px)] flex-wrap">
          {footerCols.map((col, i) => (
            <div key={i}>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-2.5">
                {col.t}
              </div>
              {col.links.map((l, j) => (
                <Link
                  key={j}
                  href={l.href}
                  className="block font-sans text-[13px] text-wd-sub mb-2 transition-colors duration-200 hover:text-wd-text"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="font-mono text-[10px] text-wd-muted border-t border-wd-border pt-4">
        © 2026 War Desk
      </div>
    </footer>
  );
}
