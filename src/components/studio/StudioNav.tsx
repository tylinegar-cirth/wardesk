"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import BoomUnderline from "@/components/transonic/BoomUnderline";
import ReelModal, { openReel } from "@/components/studio/ReelModal";

// Three words and a quiet portal link, in the text face (MJZ, Rattling Stick, Stink).
// The bar is clear over the hero's letterbox and takes the ink ground once scrolled.
// "Work" plays the reel with sound: the reel is the work.
const LINKS: { label: string; href?: string }[] = [
  { label: "Work" },
  { label: "Studio", href: "/studio#studio" },
  { label: "Contact", href: "/studio#contact" },
];

export default function StudioNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 40);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-[100] h-16 flex items-center justify-between px-[clamp(20px,5vw,72px)] transition-colors duration-300 ${
        scrolled ? "bg-wd-bg" : "bg-transparent"
      }`}
    >
      <Link href="/studio" className="flex items-center gap-3" aria-label="War Desk Studio, home">
        <Logo className="h-[26px] w-auto" />
        <span className="font-display font-semibold uppercase text-[14px] tracking-[0.04em] [word-spacing:0.22em] text-wd-bone">
          War Desk <span className="text-wd-bone/50">Studio</span>
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-9 font-sans text-[14px]">
        {LINKS.map((l) =>
          l.href ? (
            <Link key={l.label} href={l.href} className="text-wd-bone/75 hover:text-wd-bone transition-colors">
              <BoomUnderline variant="shaped" idle="none">{l.label}</BoomUnderline>
            </Link>
          ) : (
            <button key={l.label} type="button" onClick={openReel} className="text-wd-bone/75 hover:text-wd-bone transition-colors">
              <BoomUnderline variant="shaped" idle="none">{l.label}</BoomUnderline>
            </button>
          )
        )}
        <Link href="/studio/login" className="text-wd-bone/40 hover:text-wd-bone/80 transition-colors">
          <BoomUnderline variant="shaped" idle="none">Client portal</BoomUnderline>
        </Link>
      </nav>

      <button
        type="button"
        className="md:hidden font-sans text-[14px] text-wd-bone/85"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        Menu
      </button>

      {/* Portalled to <body> so the overlay never inherits the header's stacking or size */}
      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[200] bg-wd-bg px-6 pt-5 pb-10 flex flex-col">
            <div className="flex items-center justify-between h-11">
              <span className="font-display font-semibold uppercase text-[14px] tracking-[0.04em] [word-spacing:0.22em] text-wd-bone">
                War Desk <span className="text-wd-bone/50">Studio</span>
              </span>
              <button type="button" onClick={() => setOpen(false)} className="font-sans text-[14px] text-wd-bone/85">
                Close
              </button>
            </div>
            <nav className="mt-16 flex flex-col gap-6">
              {LINKS.map((l) =>
                l.href ? (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display uppercase text-[44px] leading-none tracking-[-0.03em] text-wd-bone"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <button
                    key={l.label}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      // after the menu has handed scrolling back, so the player restores it correctly
                      requestAnimationFrame(() => openReel());
                    }}
                    className="font-display uppercase text-left text-[44px] leading-none tracking-[-0.03em] text-wd-bone"
                  >
                    {l.label}
                  </button>
                )
              )}
              <Link href="/studio/essays" onClick={() => setOpen(false)} className="font-display uppercase text-[44px] leading-none tracking-[-0.03em] text-wd-bone">
                Essays
              </Link>
            </nav>
            <Link href="/studio/login" onClick={() => setOpen(false)} className="mt-auto font-sans text-[15px] text-wd-bone/50">
              Client portal
            </Link>
          </div>,
          document.body
        )}
      <ReelModal />
    </header>
  );
}
