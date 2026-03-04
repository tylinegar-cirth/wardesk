"use client";

import { exitDemo } from "@/lib/auth/demo-actions";

export default function DemoBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-8 bg-wd-gold/10 border-b border-wd-gold/20 flex items-center justify-center gap-4 px-4">
      <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-gold">
        Demo Mode — Viewing sample data
      </span>
      <form action={exitDemo}>
        <button
          type="submit"
          className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-gold/70 hover:text-wd-gold transition-colors bg-transparent border border-wd-gold/20 rounded px-2 py-0.5 hover:border-wd-gold/40"
        >
          Exit
        </button>
      </form>
    </div>
  );
}
