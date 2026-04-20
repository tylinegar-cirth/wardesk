"use client";

import Link from "next/link";
import StudioNav from "@/components/studio/StudioNav";
import StudioFooter from "@/components/studio/StudioFooter";
import StudioAmbient from "@/components/studio/StudioAmbient";
import Bracket from "@/components/ui/Bracket";
import FlagStripes from "@/components/ui/FlagStripes";
import { essays } from "@/data/studio-essays";

export default function EssaysIndexPage() {
  return (
    <div className="wd-app">
      <StudioAmbient />
      <StudioNav />

      <main className="relative">
        {/* ── Hero / masthead ── */}
        <section className="relative bg-wd-bone text-wd-ink pt-[clamp(120px,14vw,180px)] pb-[clamp(60px,9vw,120px)] px-[clamp(20px,5vw,72px)] overflow-hidden">
          {/* Halftone background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(rgba(18,18,20,0.35) 1px, transparent 1.2px)",
              backgroundSize: "6px 6px",
            }}
            aria-hidden="true"
          />

          {/* Oversized bg wordmark */}
          <div
            className="absolute -right-[6vw] top-[10%] font-display text-[clamp(160px,26vw,420px)] text-wd-ink/[0.06] uppercase leading-[0.82] tracking-[-0.04em] pointer-events-none select-none"
            aria-hidden="true"
          >
            ESSAYS
          </div>

          <div className="relative max-w-[1400px] mx-auto">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b-2 border-wd-ink/40 flex-wrap gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <Bracket variant="ink" size="sm">
                  WAR DESK STUDIO // WRITING
                </Bracket>
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-ink/60">
                  LONG-FORM ESSAYS BY TY LINEGAR
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FlagStripes className="w-8 h-4 opacity-70" variant="ink" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 items-end">
              <div className="col-span-12 md:col-span-8">
                <h1 className="font-display text-[clamp(48px,8vw,128px)] uppercase leading-[0.9] tracking-[-0.03em] text-wd-ink">
                  Essays.
                </h1>
              </div>
              <div className="col-span-12 md:col-span-4 md:text-right">
                <p className="font-serif italic text-[clamp(18px,1.8vw,24px)] leading-[1.3] text-wd-ink/80 max-w-[360px] md:ml-auto">
                  Why hard-tech companies need the thinking layer, not just the
                  camera.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Essay list ── */}
        <section className="relative bg-wd-bone text-wd-ink px-[clamp(20px,5vw,72px)] pb-[clamp(80px,10vw,140px)] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(rgba(18,18,20,0.3) 1px, transparent 1.2px)",
              backgroundSize: "6px 6px",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-[1400px] mx-auto">
            {essays.map((essay, i) => (
              <Link
                key={essay.slug}
                href={`/studio/essays/${essay.slug}`}
                className="group block border-t-2 border-wd-ink/30 hover:border-wd-ink transition-colors duration-500 py-[clamp(32px,5vw,72px)]"
              >
                <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                  {/* Index */}
                  <div className="col-span-12 md:col-span-1 font-mono text-[11px] tracking-[0.28em] uppercase text-wd-ink/60 pt-2">
                    No. {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Meta column */}
                  <div className="col-span-12 md:col-span-3 font-mono text-[10px] tracking-[0.22em] uppercase text-wd-ink/60 leading-[1.9] space-y-1 pt-2">
                    <div className="text-wd-ink/90">{essay.date}</div>
                    <div>{essay.readingTime}</div>
                    <div className="text-wd-ink/50">By {essay.author}</div>
                  </div>

                  {/* Title + summary */}
                  <div className="col-span-12 md:col-span-8">
                    {essay.kicker && (
                      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-ink/60 mb-3">
                        {essay.kicker}
                      </div>
                    )}
                    <h2 className="font-display text-[clamp(32px,5vw,72px)] uppercase leading-[0.92] tracking-[-0.025em] text-wd-ink group-hover:text-wd-blaze transition-colors duration-500 mb-4">
                      {essay.title}
                    </h2>
                    <p className="font-serif italic text-[clamp(18px,2vw,26px)] leading-[1.3] text-wd-ink/75 max-w-[720px] mb-5">
                      {essay.summary}
                    </p>
                    <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-wd-ink border-b-2 border-wd-ink pb-1 group-hover:text-wd-blaze group-hover:border-wd-blaze transition-colors duration-500">
                      Read essay
                      <span className="text-[13px] group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            <div className="border-t-2 border-wd-ink/30" />

            {/* Footer strip */}
            <div className="mt-10 flex items-center justify-between flex-wrap gap-4 font-mono text-[9px] tracking-[0.24em] uppercase text-wd-ink/60">
              <span>{essays.length} Essays · More Coming</span>
              <Link
                href="/studio"
                className="hover:text-wd-blaze transition-colors flex items-center gap-2"
              >
                ← Back to Studio
              </Link>
            </div>
          </div>
        </section>
      </main>

      <StudioFooter />
    </div>
  );
}
