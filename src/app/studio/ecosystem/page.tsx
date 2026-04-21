"use client";

import { useState, useEffect } from "react";
import StudioNav from "@/components/studio/StudioNav";
import StudioFooter from "@/components/studio/StudioFooter";
import StudioAmbient from "@/components/studio/StudioAmbient";
import Bracket from "@/components/ui/Bracket";
import FlagStripes from "@/components/ui/FlagStripes";
import Reveal from "@/components/ui/Reveal";
import { createBrowserClient } from "@supabase/ssr";
import {
  studioCompanies as staticCompanies,
  sectors,
  type StudioCompany,
} from "@/data/studio-companies";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const INITIAL_COUNT = 6;

export default function EcosystemPage() {
  const [activeSector, setActiveSector] = useState("All Companies");
  const [expanded, setExpanded] = useState(false);
  const [companies, setCompanies] = useState<StudioCompany[]>(staticCompanies);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addSubmitted, setAddSubmitted] = useState(false);
  const [addCompany, setAddCompany] = useState("");
  const [addEmail, setAddEmail] = useState("");

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((result) => {
        if (result.data && result.data.length > 0) {
          setCompanies(result.data);
        }
      })
      .catch(() => {});
  }, []);

  const filtered =
    activeSector === "All Companies"
      ? companies
      : companies.filter((c) => c.sector === activeSector);

  const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);
  const hasMore = filtered.length > INITIAL_COUNT;

  return (
    <div className="wd-app">
      <StudioAmbient />
      <StudioNav />

      <main className="relative">
        {/* ── Masthead ── */}
        <section className="relative bg-wd-bone text-wd-ink pt-[clamp(120px,14vw,180px)] pb-[clamp(48px,7vw,96px)] px-[clamp(20px,5vw,72px)] overflow-hidden">
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
            RADAR
          </div>

          <div className="relative max-w-[1400px] mx-auto">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-10 pb-4 border-b-2 border-wd-ink/40 flex-wrap gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <Bracket variant="ink" size="sm">
                  WAR DESK STUDIO // ECOSYSTEM
                </Bracket>
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-ink/60">
                  TRACKING · {companies.length} COMPANIES
                </span>
              </div>
              <FlagStripes className="w-8 h-4 opacity-70" variant="ink" />
            </div>

            <div className="grid grid-cols-12 gap-6 items-end">
              <div className="col-span-12 md:col-span-8">
                <h1 className="font-display text-[clamp(48px,8vw,128px)] uppercase leading-[0.9] tracking-[-0.03em] text-wd-ink">
                  On Our Radar.
                </h1>
              </div>
              <div className="col-span-12 md:col-span-4 md:text-right">
                <p className="font-serif italic text-[clamp(18px,1.8vw,24px)] leading-[1.3] text-wd-ink/80 max-w-[360px] md:ml-auto">
                  The companies defining the future of civilisation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sector filter + grid ── */}
        <section className="relative bg-wd-bone text-wd-ink px-[clamp(20px,5vw,72px)] pb-[clamp(80px,10vw,140px)] overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(rgba(18,18,20,0.3) 1px, transparent 1.2px)",
              backgroundSize: "6px 6px",
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-[1400px] mx-auto pt-10 border-t-2 border-wd-ink/30">
            {/* Sector filter row */}
            <Reveal>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-10 pb-5 border-b border-wd-ink/25">
                {sectors.map((sector) => {
                  const count =
                    sector === "All Companies"
                      ? companies.length
                      : companies.filter((c) => c.sector === sector).length;
                  const isActive = activeSector === sector;
                  return (
                    <button
                      key={sector}
                      onClick={() => {
                        setActiveSector(sector);
                        setExpanded(false);
                      }}
                      className={`font-mono text-[10px] tracking-[0.2em] uppercase py-2 px-3 border transition-all duration-300 flex items-center gap-2 ${
                        isActive
                          ? "border-wd-ink bg-wd-ink text-wd-bone"
                          : "border-wd-ink/25 text-wd-ink/65 hover:border-wd-ink/70 hover:text-wd-ink"
                      }`}
                    >
                      {sector}
                      <span
                        className={`text-[8px] ${
                          isActive ? "text-wd-bone/70" : "text-wd-ink/50"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* Company grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {visible.map((company, i) => (
                <Reveal key={company.name} delay={0.02 * Math.min(i, 8)}>
                  <article className="group relative border border-wd-ink/25 hover:border-wd-ink/70 transition-all duration-500 bg-wd-bone h-full flex flex-col p-5">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-wd-ink/20">
                      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-ink/60">
                        {company.sector}
                      </span>
                    </div>

                    <h3 className="font-display text-[clamp(20px,2vw,26px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-ink group-hover:text-wd-blaze transition-colors duration-500 mb-3">
                      {company.name}
                    </h3>

                    <div className="space-y-1 mb-4 border-t border-b border-wd-ink/15 py-3">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-ink/55 w-[52px] flex-shrink-0">
                          Raised
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-wd-ink">
                          {company.funding}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-ink/55 w-[52px] flex-shrink-0">
                          Val
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-wd-ink">
                          {company.valuation}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-ink/55 w-[52px] flex-shrink-0">
                          Team
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-wd-ink">
                          {company.employees}
                        </span>
                      </div>
                    </div>

                    <p className="font-sans text-[12.5px] text-wd-ink/75 leading-[1.6] mt-auto">
                      {company.news}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* Empty state for filtered-to-zero */}
            {filtered.length === 0 && (
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-wd-ink/50 text-center py-12">
                No companies tracked in this sector yet.
              </p>
            )}

            {/* Expand / collapse */}
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="group font-mono text-[11px] tracking-[0.24em] uppercase py-3 px-8 border-2 border-wd-ink text-wd-ink hover:bg-wd-ink hover:text-wd-bone transition-all duration-300 flex items-center gap-3"
                >
                  {expanded
                    ? "Show less"
                    : `Show all ${filtered.length} companies`}
                  <span className="text-[14px] group-hover:translate-y-0.5 transition-transform">
                    {expanded ? "↑" : "↓"}
                  </span>
                </button>
              </div>
            )}

            {/* Add your company */}
            <Reveal delay={0.08}>
              <div className="mt-16 pt-10 border-t-2 border-wd-ink/30">
                {addSubmitted ? (
                  <div className="py-6">
                    <h4 className="font-display text-[clamp(26px,3.5vw,40px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-ink mb-3">
                      Added to the <span className="text-wd-blaze">radar</span>.
                    </h4>
                    <p className="font-sans text-[14px] text-wd-ink/75 leading-[1.6] max-w-[480px]">
                      Your company is being researched and will appear shortly.
                    </p>
                  </div>
                ) : !showAddForm ? (
                  <div className="flex items-end justify-between flex-wrap gap-6">
                    <div className="max-w-[560px]">
                      <h4 className="font-display text-[clamp(26px,3.5vw,40px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-ink mb-3">
                        Not on the list?
                      </h4>
                      <p className="font-sans text-[14px] text-wd-ink/75 leading-[1.6]">
                        If you&apos;re building in defense, aerospace, or hard
                        tech, we want to know about you.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="group font-mono text-[11px] tracking-[0.18em] uppercase py-4 px-8 bg-wd-ink text-wd-bone border-2 border-wd-ink font-bold transition-all duration-300 hover:bg-wd-bone hover:text-wd-ink flex items-center gap-3"
                    >
                      Add Your Company
                      <span className="text-[14px] group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setAddSubmitting(true);
                      await supabase.from("company_submissions").insert({
                        company_name: addCompany.trim(),
                        contact_email: addEmail.trim(),
                      });
                      try {
                        await fetch("/api/companies/add", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            company_name: addCompany.trim(),
                            contact_email: addEmail.trim(),
                          }),
                        });
                      } catch {}
                      setAddSubmitting(false);
                      setAddSubmitted(true);
                    }}
                    className="space-y-6 max-w-[680px]"
                  >
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <h4 className="font-display text-[clamp(22px,3vw,32px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-ink">
                        Add Your Company
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="text-wd-ink/60 hover:text-wd-ink transition-colors"
                        aria-label="Close"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <p className="font-sans text-[13px] text-wd-ink/70 leading-[1.6]">
                      We&apos;ll research and populate your company data
                      automatically.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-ink/65 mb-2 block">
                          Company Name
                        </label>
                        <input
                          type="text"
                          required
                          value={addCompany}
                          onChange={(e) => setAddCompany(e.target.value)}
                          className="w-full bg-transparent border border-wd-ink/30 text-wd-ink font-mono text-[14px] tracking-[0.04em] py-3 px-4 focus:border-wd-ink focus:outline-none transition-colors placeholder:text-wd-ink/30"
                          placeholder="Your company"
                        />
                      </div>
                      <div>
                        <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-ink/65 mb-2 block">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={addEmail}
                          onChange={(e) => setAddEmail(e.target.value)}
                          className="w-full bg-transparent border border-wd-ink/30 text-wd-ink font-mono text-[14px] tracking-[0.04em] py-3 px-4 focus:border-wd-ink focus:outline-none transition-colors placeholder:text-wd-ink/30"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={addSubmitting}
                      className="font-mono text-[11px] tracking-[0.18em] uppercase py-4 px-8 bg-wd-ink text-wd-bone border-2 border-wd-ink font-bold transition-all duration-300 hover:bg-wd-bone hover:text-wd-ink disabled:opacity-50 disabled:pointer-events-none flex items-center gap-3"
                    >
                      {addSubmitting ? "Researching..." : "Add Company →"}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>

            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-ink/50 mt-10 text-center">
              Company data refreshed monthly.
            </p>
          </div>
        </section>
      </main>

      <StudioFooter />
    </div>
  );
}
