"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/ui/Logo";
import StatusDot from "@/components/ui/StatusDot";
import { LiveClock } from "@/components/ui/TechReadout";

const navLinks = [
  { label: "Advisors", href: "/", soon: true },
  { label: "Live", href: "/live", soon: true },
];

export default function StudioNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* ── Status strip — always visible, above nav ── */}
      <div className="fixed top-0 left-0 right-0 z-[101] h-[22px] bg-wd-bg/95 backdrop-blur-xl border-b border-wd-border">
        <div className="h-full px-[clamp(16px,4vw,48px)] flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.24em]">
          <div className="flex items-center gap-5 text-wd-muted">
            <StatusDot label="BROADCAST ACTIVE" tone="gold" />
            <span className="hidden md:inline">
              N 33°55&apos;09&quot; W 118°24&apos;59&quot;
            </span>
            <span className="hidden lg:inline text-wd-gold/70">
              / EL SEGUNDO, CA
            </span>
          </div>
          <div className="flex items-center gap-5 text-wd-muted">
            <span className="hidden sm:inline">OP //
              <span className="text-wd-gold ml-1.5">WD-2026-01</span>
            </span>
            <LiveClock className="text-wd-gold" />
          </div>
        </div>
      </div>

      {/* ── Main navigation ── */}
      <header
        className={`fixed top-[22px] left-0 right-0 z-[100] h-[58px] flex justify-between items-center px-[clamp(16px,4vw,48px)] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "backdrop-blur-[24px] saturate-150 border-b border-wd-border"
            : "border-b border-transparent"
        }`}
        style={
          scrolled
            ? {
                background: "var(--wd-nav-bg)",
                boxShadow: "var(--wd-nav-shadow)",
              }
            : { background: "rgba(10,10,12,0.4)" }
        }
      >
        <Link
          href="/studio"
          className="flex items-center gap-3 group"
        >
          <Logo className="h-[30px] w-auto max-[480px]:h-[24px]" />
          <span className="flex items-center gap-2 max-[640px]:hidden">
            <span className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-wd-text leading-none">
              War Desk
            </span>
            <span className="font-mono text-[11px] font-bold tracking-[0.3em] uppercase text-wd-gold leading-none">
              Studio
            </span>
          </span>
          <span className="hidden md:flex font-mono text-[9px] tracking-[0.22em] uppercase text-wd-muted border-l border-wd-border pl-3 ml-1 leading-[1.3]">
            EST / 2026
            <br />
            CA · USA
          </span>
        </Link>

        <nav className="flex gap-6 items-center">
          {navLinks.map((link) => {
            const inner = (
              <span className="flex items-center gap-1.5">
                {link.label}
                {link.soon && (
                  <span className="font-mono text-[7px] tracking-[0.08em] uppercase text-wd-gold/80 border border-wd-gold/30 rounded-sm px-1 py-px leading-none">
                    Soon
                  </span>
                )}
              </span>
            );
            return (
              <Link
                key={link.label}
                href={link.href}
                className="font-mono text-[10px] tracking-[0.16em] uppercase text-wd-muted hover:text-wd-text transition-colors hidden md:block"
              >
                {inner}
              </Link>
            );
          })}
          <span className="hidden md:block">
            <ThemeToggle />
          </span>
          <a
            href="#transmit"
            className="font-mono text-[10px] tracking-[0.14em] uppercase py-[8px] px-[18px] bg-transparent text-wd-text font-bold rounded-none border border-wd-border transition-all duration-250 hover:border-wd-gold hover:text-wd-gold hidden md:inline-flex items-center gap-2"
          >
            <span aria-hidden="true" className="h-1 w-1 bg-wd-gold rounded-full" />
            Contact
          </a>
          <Link
            href="/studio/login"
            className="font-mono text-[10px] tracking-[0.14em] uppercase py-[8px] px-[18px] bg-wd-gold text-wd-ink font-bold rounded-none transition-all duration-250 hover:bg-wd-text hidden md:inline-flex items-center gap-2"
          >
            Portal
            <span aria-hidden="true" className="text-[11px]">→</span>
          </Link>
          <button
            className="md:hidden bg-transparent border border-wd-border text-wd-text p-2 font-mono text-[9px] tracking-[0.2em] uppercase"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed top-[80px] left-0 right-0 bottom-0 z-[99] bg-wd-bg border-t border-wd-gold/30 py-8 px-6 flex flex-col gap-5 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-[28px] text-wd-text hover:text-wd-gold transition-colors uppercase leading-none tracking-tight flex items-center gap-3"
            >
              {link.label}
              {link.soon && (
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-gold/80 border border-wd-gold/30 rounded-sm px-2 py-[3px] leading-none">
                  Soon
                </span>
              )}
            </Link>
          ))}
          <a
            href="#transmit"
            onClick={() => setMenuOpen(false)}
            className="font-display text-[28px] text-wd-text hover:text-wd-gold transition-colors uppercase leading-none tracking-tight"
          >
            Contact
          </a>
          <Link
            href="/studio/login"
            onClick={() => setMenuOpen(false)}
            className="font-display text-[28px] text-wd-gold hover:text-wd-text transition-colors uppercase leading-none tracking-tight"
          >
            Portal →
          </Link>
          <div className="pt-4 border-t border-wd-border flex items-center justify-between">
            <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-muted">
              N 33°55&apos;09&quot; W 118°24&apos;59&quot;
            </div>
            <ThemeToggle />
          </div>
        </div>
      )}
    </>
  );
}
