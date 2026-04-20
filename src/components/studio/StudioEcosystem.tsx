"use client";

import { useState, useEffect } from "react";
import Reveal from "@/components/ui/Reveal";
import Bracket from "@/components/ui/Bracket";
import StatusDot from "@/components/ui/StatusDot";
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

const INITIAL_COUNT = 9;

export default function StudioEcosystem() {
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
    <section
      id="ecosystem"
      className="relative pt-[clamp(80px,11vw,130px)] pb-[clamp(80px,10vw,130px)] px-[clamp(16px,4vw,72px)] overflow-hidden"
    >
      {/* Faint radar-sweep background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(circle at 82% 18%, rgba(212,168,67,0.12) 0%, transparent 45%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1600px] mx-auto">
        <Reveal>
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-wd-gold/30 flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <Bracket variant="gold" size="sm">
                  SECTION 05 // INTEL
                </Bracket>
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-muted">
                  THE RADAR — COMPANIES IN SCOPE
                </span>
              </div>
              <StatusDot label={`TRACKING · ${companies.length} UNITS`} tone="gold" />
            </div>

            <div className="grid grid-cols-12 gap-6 items-end">
              <div className="col-span-12 md:col-span-8">
                <h2 className="font-display text-[clamp(40px,6.5vw,88px)] uppercase leading-[0.92] tracking-[-0.025em] text-wd-text">
                  Companies on the <span className="text-wd-gold">radar</span>.
                </h2>
              </div>
              <div className="col-span-12 md:col-span-4">
                <p className="font-sans text-[13px] text-wd-sub leading-[1.65] max-w-[360px]">
                  The companies defining the future of civilisation. Energy,
                  defense, space, infrastructure. The work we want to help
                  amplify.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Sector filter row */}
        <Reveal delay={0.05}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-10 pb-4 border-b border-wd-gold/20">
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
                      ? "border-wd-gold text-wd-ink bg-wd-gold"
                      : "border-wd-border text-wd-muted hover:border-wd-gold/50 hover:text-wd-text"
                  }`}
                >
                  {sector}
                  <span
                    className={`text-[8px] ${
                      isActive ? "text-wd-ink/70" : "text-wd-gold/60"
                    }`}
                  >
                    [{count}]
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Company grid — tactical cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {visible.map((company, i) => (
            <Reveal key={company.name} delay={0.02 * Math.min(i, 8)}>
              <article className="group relative border border-wd-border hover:border-wd-gold/50 transition-all duration-500 bg-wd-surface/20 backdrop-blur-sm h-full flex flex-col p-5">
                {/* Top strip: index + sector + trending */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-wd-border/80">
                  <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-gold/70">
                    TGT-{String(i + 1).padStart(3, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    {company.trending && (
                      <span className="flex items-center gap-1 font-mono text-[8px] tracking-[0.22em] uppercase text-wd-blaze">
                        <span className="h-1 w-1 rounded-full bg-wd-blaze wd-blink" />
                        RISING
                      </span>
                    )}
                    <span className="font-mono text-[8px] tracking-[0.22em] uppercase text-wd-muted">
                      {company.sector}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-[clamp(20px,2vw,26px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-text group-hover:text-wd-gold transition-colors duration-500 mb-3">
                  {company.name}
                </h3>

                {/* Stats table */}
                <div className="space-y-1 mb-4 border-t border-b border-wd-border/60 py-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-muted w-[52px] flex-shrink-0">
                      Raised
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-wd-text">
                      {company.funding}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-muted w-[52px] flex-shrink-0">
                      Val
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-wd-text">
                      {company.valuation}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-muted w-[52px] flex-shrink-0">
                      Team
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-wd-text">
                      {company.employees}
                    </span>
                  </div>
                </div>

                <p className="font-sans text-[12px] text-wd-sub leading-[1.6] mt-auto">
                  {company.news}
                </p>

                {/* Bottom hairline */}
                <div className="mt-4 pt-3 border-t border-wd-border/60 flex items-center justify-between">
                  <span className="font-mono text-[8px] tracking-[0.22em] uppercase text-wd-muted">
                    {"// OBS"}
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.22em] uppercase text-wd-gold/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    ▸ TRACKING
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Expand / collapse */}
        {hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="group font-mono text-[11px] tracking-[0.24em] uppercase py-3 px-8 border border-wd-gold/50 text-wd-gold hover:bg-wd-gold hover:text-wd-ink transition-all duration-300 flex items-center gap-3"
            >
              {expanded
                ? "Collapse Roster"
                : `Expand · ${filtered.length} Units`}
              <span className="text-[14px] group-hover:translate-y-0.5 transition-transform">
                {expanded ? "▲" : "▼"}
              </span>
            </button>
          </div>
        )}

        {/* Add your company */}
        <Reveal delay={0.08}>
          <div className="mt-20 pt-10 border-t-2 border-wd-gold/30">
            {addSubmitted ? (
              <div className="py-6 flex flex-col items-start">
                <StatusDot label="ADDED · RESEARCHING" tone="emerald" className="mb-4" />
                <h4 className="font-display text-[clamp(28px,4vw,48px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-text mb-3">
                  Added to the <span className="text-wd-gold">radar</span>.
                </h4>
                <p className="font-sans text-[14px] text-wd-sub leading-[1.6] max-w-[480px]">
                  Your company is being researched and will appear shortly.
                </p>
              </div>
            ) : !showAddForm ? (
              <div className="flex items-end justify-between flex-wrap gap-6">
                <div className="max-w-[560px]">
                  <Bracket variant="gold" size="xs" className="mb-4">
                    SUBMIT / REQUEST
                  </Bracket>
                  <h4 className="font-display text-[clamp(28px,4vw,48px)] uppercase leading-[0.94] tracking-[-0.02em] text-wd-text mb-3">
                    Not on the list?
                  </h4>
                  <p className="font-sans text-[14px] text-wd-sub leading-[1.6]">
                    If you&apos;re building in defense, aerospace, or hard tech,
                    we want to know about you.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="group font-mono text-[11px] tracking-[0.18em] uppercase py-4 px-8 bg-transparent text-wd-text border border-wd-gold/60 font-bold transition-all duration-300 hover:bg-wd-gold hover:text-wd-ink flex items-center gap-3"
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
                  <div>
                    <Bracket variant="gold" size="xs" className="mb-3">
                      SUBMIT / REQUEST
                    </Bracket>
                    <h4 className="font-display text-[clamp(24px,3vw,36px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-text">
                      Add Your Company
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-wd-muted hover:text-wd-text transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="font-sans text-[13px] text-wd-sub leading-[1.6]">
                  We&apos;ll research and populate your company data automatically.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-gold/70 mb-2 block">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={addCompany}
                      onChange={(e) => setAddCompany(e.target.value)}
                      className="w-full bg-transparent border border-wd-border text-wd-text font-mono text-[14px] tracking-[0.04em] py-3 px-4 focus:border-wd-gold focus:outline-none transition-colors placeholder:text-wd-muted/50 uppercase"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-gold/70 mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={addEmail}
                      onChange={(e) => setAddEmail(e.target.value)}
                      className="w-full bg-transparent border border-wd-border text-wd-text font-mono text-[14px] tracking-[0.04em] py-3 px-4 focus:border-wd-gold focus:outline-none transition-colors placeholder:text-wd-muted/50"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="font-mono text-[11px] tracking-[0.18em] uppercase py-4 px-8 bg-wd-gold text-wd-ink border-none font-bold transition-all duration-300 hover:bg-wd-text disabled:opacity-50 disabled:pointer-events-none flex items-center gap-3"
                >
                  {addSubmitting ? "Researching..." : "Add Company →"}
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-muted mt-10 text-center">
          {"// COMPANY DATA REFRESHED MONTHLY — MAY NOT REFLECT LATEST FIGURES"}
        </p>
      </div>
    </section>
  );
}
