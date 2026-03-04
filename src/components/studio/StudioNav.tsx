"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "Advisors", href: "/" },
  { label: "Live", href: "/live" },
];

export default function StudioNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] h-[60px] flex justify-between items-center px-[clamp(20px,4vw,48px)] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "backdrop-blur-[24px] saturate-150 border-b border-wd-border"
            : ""
        }`}
        style={
          scrolled
            ? {
                background: "var(--wd-nav-bg)",
                boxShadow: "var(--wd-nav-shadow)",
              }
            : undefined
        }
      >
        <Link
          href="/studio"
          className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-wd-text flex items-center gap-2.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            className="h-[90px] w-auto -my-4 dark:invert"
          />
          <span>
            War Desk <span className="text-wd-gold">Studio</span>
          </span>
        </Link>
        <nav className="flex gap-7 items-center">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-text transition-colors hidden md:block"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-text transition-colors hidden md:block"
              >
                {link.label}
              </Link>
            )
          )}
          <ThemeToggle />
          <a
            href="#contact"
            className="font-mono text-[10px] tracking-[0.1em] uppercase py-[9px] px-[22px] bg-wd-overlay/[0.06] text-wd-text font-bold rounded-md border border-wd-border transition-all duration-250 hover:bg-wd-overlay/[0.12] hover:border-wd-border-hov hover:-translate-y-px hidden md:block"
          >
            Contact
          </a>
          <Link
            href="/studio-portal"
            className="font-mono text-[10px] tracking-[0.1em] uppercase py-[9px] px-[22px] bg-wd-gold text-wd-bg font-bold rounded-md transition-all duration-250 shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:shadow-[0_4px_20px_rgba(212,168,67,0.35)] hover:-translate-y-px max-[480px]:text-[9px] max-[480px]:py-[7px] max-[480px]:px-4 max-[480px]:rounded-[5px]"
          >
            Client Portal
          </Link>
          <button
            className="md:hidden bg-transparent border-none text-wd-text text-[22px] p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            ☰
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed top-[60px] left-0 right-0 z-[99] bg-wd-bg/95 backdrop-blur-[24px] border-b border-wd-border p-5 px-6 flex flex-col gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {navLinks.map((link) =>
            link.href.startsWith("#") ? (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-mono text-[13px] text-wd-sub tracking-[0.1em] uppercase"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-mono text-[13px] text-wd-sub tracking-[0.1em] uppercase"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </>
  );
}
