"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
            ? "bg-[rgba(8,8,10,0.72)] backdrop-blur-[24px] saturate-150 border-b border-wd-border shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : ""
        }`}
      >
        <Link href="/" className="font-mono text-xs font-bold tracking-[0.3em] uppercase text-wd-text flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/dmj9mlo6o/image/upload/v1772585999/Gemini_Generated_Image_t0cq9dt0cq9dt0cq_h7woad.png"
            alt=""
            className="h-7 w-auto"
            style={{ mixBlendMode: "screen" }}
          />
          War Desk
        </Link>
        <nav className="flex gap-7 items-center">
          <a href="#advisors" className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-text transition-colors hidden md:block">
            Advisors
          </a>
          <a href="#show" className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-text transition-colors hidden md:block">
            Show
          </a>
          <a href="#studio" className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-text transition-colors hidden md:block">
            Studio
          </a>
          <Link
            href="/auth/login"
            className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-text transition-colors hidden md:block"
          >
            Client Login
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
          >
            ☰
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed top-[60px] left-0 right-0 z-[99] bg-[rgba(8,8,10,0.95)] backdrop-blur-[24px] border-b border-wd-border p-5 px-6 flex flex-col gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {["Advisors", "Show", "Studio"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-[13px] text-wd-sub tracking-[0.1em] uppercase"
            >
              {l}
            </a>
          ))}
          <Link
            href="/auth/login"
            onClick={() => setMenuOpen(false)}
            className="font-mono text-[13px] text-wd-gold tracking-[0.1em] uppercase"
          >
            Client Login
          </Link>
        </div>
      )}
    </>
  );
}
