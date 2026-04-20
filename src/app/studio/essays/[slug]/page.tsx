"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import StudioNav from "@/components/studio/StudioNav";
import StudioFooter from "@/components/studio/StudioFooter";
import StudioAmbient from "@/components/studio/StudioAmbient";
import Bracket from "@/components/ui/Bracket";
import FlagStripes from "@/components/ui/FlagStripes";
import { essayBySlug, essays } from "@/data/studio-essays";

export default function EssayPage({ params }: { params: { slug: string } }) {
  const essay = essayBySlug(params.slug);
  if (!essay) notFound();

  const idx = essays.findIndex((e) => e.slug === params.slug);
  const next = essays[(idx + 1) % essays.length];

  return (
    <div className="wd-app">
      <StudioAmbient />
      <StudioNav />

      <main className="relative">
        {/* ── Masthead ── */}
        <section className="relative bg-wd-bone text-wd-ink pt-[clamp(120px,14vw,180px)] pb-[clamp(48px,7vw,96px)] px-[clamp(20px,5vw,72px)] overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(rgba(18,18,20,0.35) 1px, transparent 1.2px)",
              backgroundSize: "6px 6px",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute -right-[6vw] top-[10%] font-display text-[clamp(160px,26vw,420px)] text-wd-ink/[0.06] uppercase leading-[0.82] tracking-[-0.04em] pointer-events-none select-none"
            aria-hidden="true"
          >
            {essay.bgWord}
          </div>

          <div className="relative max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-10 pb-4 border-b-2 border-wd-ink/40 flex-wrap gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  href="/studio/essays"
                  className="font-mono text-[10px] tracking-[0.22em] uppercase text-wd-ink/70 hover:text-wd-ink transition-colors flex items-center gap-2"
                >
                  ← All essays
                </Link>
                <Bracket variant="ink" size="sm">
                  ESSAY // No. {String(idx + 1).padStart(2, "0")}
                </Bracket>
              </div>
              <FlagStripes className="w-8 h-4 opacity-70" variant="ink" />
            </div>

            <div className="grid grid-cols-12 gap-6 items-end">
              <div className="col-span-12 lg:col-span-8">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-ink/60 mb-5">
                  {essay.kicker}
                </div>
                <h1 className="font-display text-[clamp(40px,6.5vw,112px)] uppercase leading-[0.88] tracking-[-0.03em] text-wd-ink mb-6">
                  {essay.title}
                </h1>
                <p className="font-serif italic text-[clamp(20px,2.4vw,32px)] leading-[1.25] text-wd-ink/75 max-w-[760px]">
                  {essay.summary}
                </p>
              </div>

              <div className="col-span-12 lg:col-span-4 lg:border-l-2 border-wd-ink/40 lg:pl-8">
                <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-ink/50 leading-[1.9]">
                  <div className="flex justify-between gap-3 border-b border-wd-ink/20 pb-2 mb-2">
                    <span>AUTHOR</span>
                    <span className="text-wd-ink">{essay.author}</span>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-wd-ink/20 pb-2 mb-2">
                    <span>FILED</span>
                    <span className="text-wd-ink">{essay.date}</span>
                  </div>
                  <div className="flex justify-between gap-3 border-b border-wd-ink/20 pb-2 mb-2">
                    <span>LENGTH</span>
                    <span className="text-wd-ink">{essay.readingTime}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>SERIES</span>
                    <span className="text-wd-blaze">War Desk Studio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Essay body ── */}
        <article className="relative bg-wd-bone text-wd-ink px-[clamp(20px,5vw,72px)] pb-[clamp(80px,10vw,140px)] overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(rgba(18,18,20,0.3) 1px, transparent 1.2px)",
              backgroundSize: "6px 6px",
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-[1400px] mx-auto grid grid-cols-12 gap-6 lg:gap-10 pt-12 border-t-2 border-wd-ink/30">
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {essay.blocks.map((block, i) => {
                if (block.type === "divider") {
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-4 py-4"
                      aria-hidden="true"
                    >
                      <div className="h-[1px] flex-1 bg-wd-ink/30" />
                      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-ink/40">
                        ◆
                      </span>
                      <div className="h-[1px] flex-1 bg-wd-ink/30" />
                    </div>
                  );
                }
                if (block.type === "h2") {
                  return (
                    <h2
                      key={i}
                      className="font-display text-[clamp(26px,3.4vw,42px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-ink pt-6"
                    >
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "pull") {
                  return (
                    <p
                      key={i}
                      className="font-display text-[clamp(22px,3vw,40px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-ink border-l-4 border-wd-blaze pl-6 my-4"
                    >
                      {block.text}
                    </p>
                  );
                }
                return (
                  <p
                    key={i}
                    className="font-sans text-[clamp(15px,1.3vw,17px)] leading-[1.7] text-wd-ink/85"
                  >
                    {block.text}
                  </p>
                );
              })}
            </div>

            {/* Sticky side column */}
            <aside className="hidden lg:block col-span-4">
              <div className="sticky top-[120px] space-y-6">
                <div className="border border-wd-ink/30 p-6 bg-wd-bone">
                  <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-ink/50 mb-3">
                    Pull Quote
                  </div>
                  <p className="font-serif italic text-[clamp(18px,1.6vw,22px)] leading-[1.3] text-wd-ink">
                    &ldquo;{essay.pullQuote}&rdquo;
                  </p>
                </div>

                <Link
                  href="/studio#contact"
                  className="group block border-2 border-wd-ink hover:bg-wd-ink hover:text-wd-bone transition-colors duration-500 p-6"
                >
                  <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-current/70 mb-2">
                    Work with the studio
                  </div>
                  <div className="font-display text-[clamp(20px,2vw,28px)] uppercase leading-[0.95] tracking-[-0.02em] text-current group-hover:translate-x-1 transition-transform">
                    Start a project →
                  </div>
                </Link>
              </div>
            </aside>
          </div>
        </article>

        {/* ── Author bio + next essay ── */}
        <section className="relative bg-wd-bone text-wd-ink px-[clamp(20px,5vw,72px)] pb-[clamp(72px,10vw,120px)] overflow-hidden">
          <div className="relative max-w-[1400px] mx-auto pt-10 border-t-2 border-wd-ink/30">
            <div className="grid grid-cols-12 gap-6 lg:gap-10">
              <div className="col-span-12 lg:col-span-6">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-ink/50 mb-4">
                  About the author
                </div>
                <p className="font-sans text-[14px] leading-[1.7] text-wd-ink/80 max-w-[520px]">
                  <strong className="text-wd-ink">{essay.author}</strong> is
                  Co-Founder and Executive Producer of War Desk Studio, the
                  creative arm of The War Desk \u2014 the national security
                  advisory powered by four-star generals. War Desk Studio
                  produces campaigns, films, roadshow experiences, and content
                  for defense, aerospace, and hard tech companies.
                </p>
                <div className="mt-4 font-mono text-[11px] tracking-[0.08em] text-wd-ink/70">
                  <a
                    href="mailto:ty@thewardesk.com"
                    className="hover:text-wd-blaze transition-colors"
                  >
                    ty@thewardesk.com
                  </a>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-6 lg:border-l-2 border-wd-ink/30 lg:pl-10">
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-ink/50 mb-4">
                  Next essay
                </div>
                <Link
                  href={`/studio/essays/${next.slug}`}
                  className="group block"
                >
                  <h3 className="font-display text-[clamp(24px,3.2vw,40px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-ink group-hover:text-wd-blaze transition-colors mb-3">
                    {next.title}
                  </h3>
                  <p className="font-serif italic text-[16px] leading-[1.4] text-wd-ink/70 mb-4 max-w-[480px]">
                    {next.summary}
                  </p>
                  <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase text-wd-ink border-b-2 border-wd-ink pb-1 group-hover:text-wd-blaze group-hover:border-wd-blaze transition-colors">
                    Read next →
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StudioFooter />
    </div>
  );
}
