"use client";

import Link from "next/link";

export default function StudioFooter() {
  return (
    <footer className="py-12 px-[clamp(20px,5vw,72px)] pb-8 max-w-[1240px] mx-auto border-t border-wd-border mt-4">
      <div className="flex justify-between items-center flex-wrap gap-6 mb-6">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            className="h-[48px] w-auto -my-2 dark:invert"
          />
          <span className="font-mono text-xs font-bold tracking-[0.25em] uppercase text-wd-text">
            War Desk <span className="text-wd-gold">Studio</span>
          </span>
        </div>
        <Link
          href="/"
          className="font-mono text-[10px] tracking-[0.05em] text-wd-muted hover:text-wd-text transition-colors"
        >
          The War Desk &rarr;
        </Link>
      </div>
      <div className="font-mono text-[10px] text-wd-muted border-t border-wd-border pt-4">
        &copy; 2026 War Desk Studio
      </div>
    </footer>
  );
}
