"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Nav() {
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
        style={scrolled ? { background: "var(--wd-nav-bg)", boxShadow: "var(--wd-nav-shadow)" } : undefined}
      >
        <Link href="/" className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-wd-text flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            className="h-[90px] w-auto -mt-[12px] -mb-[18px] dark:invert"
          />
          War Desk
        </Link>
        <nav className="flex gap-7 items-center">
          <a href="#advisors" className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-text transition-colors hidden md:block">
            Advisors
          </a>
          <Link href="/live" className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-text transition-colors hidden md:block">
            Live
          </Link>
          <Link href="/studio" className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-text transition-colors hidden md:block">
            Studio
          </Link>
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="font-mono text-[10px] tracking-[0.1em] uppercase py-[9px] px-[22px] bg-wd-overlay/[0.06] text-wd-text font-bold rounded-md border border-wd-border transition-all duration-250 hover:bg-wd-overlay/[0.12] hover:border-wd-border-hov hover:-translate-y-px hidden md:block"
          >
            Login
          </Link>
          <a
            href="#advisors"
            className="font-mono text-[10px] tracking-[0.1em] uppercase py-[9px] px-[22px] bg-wd-gold text-wd-bg font-bold rounded-md transition-all duration-250 shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:shadow-[0_4px_20px_rgba(212,168,67,0.35)] hover:-translate-y-px max-[480px]:text-[9px] max-[480px]:py-[7px] max-[480px]:px-4 max-[480px]:rounded-[5px]"
          >
            Book a briefing
          </a>
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
          <a href="#advisors" onClick={() => setMenuOpen(false)} className="font-mono text-[13px] text-wd-sub tracking-[0.1em] uppercase">
            Advisors
          </a>
          <Link href="/live" onClick={() => setMenuOpen(false)} className="font-mono text-[13px] text-wd-sub tracking-[0.1em] uppercase">
            Live
          </Link>
          <Link href="/studio" onClick={() => setMenuOpen(false)} className="font-mono text-[13px] text-wd-sub tracking-[0.1em] uppercase">
            Studio
          </Link>
          <Link
            href="/auth/login"
            onClick={() => setMenuOpen(false)}
            className="font-mono text-[13px] text-wd-gold tracking-[0.1em] uppercase"
          >
            Login
          </Link>
        </div>
      )}
    </>
  );
}
