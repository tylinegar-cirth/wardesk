"use client";

import { useState, useEffect } from "react";
import Reveal from "@/components/ui/Reveal";
import CornerBrackets from "@/components/ui/CornerBrackets";
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

// 2 rows × 3 columns = 6 cards before expand
const INITIAL_COUNT = 6;

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
      className="relative pt-[clamp(20px,3vw,52px)] pb-[clamp(56px,9vw,110px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto"
    >
      <CornerBrackets size={24} inset={12} color="rgba(212,168,67,0.5)" strokeWidth={1} />

      <Reveal>
        <div className="relative mb-8 flex items-start justify-between gap-8">
          <div className="flex-1 max-w-[680px]">
            <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-4">
              The Sector
            </div>
            <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-normal text-wd-text leading-[1.02] tracking-[-0.01em] mb-3">
              Companies on our <span className="italic text-wd-gold/90">radar</span>.
            </h2>
            <p className="font-sans text-[clamp(14px,1.4vw,16px)] font-light text-wd-sub leading-[1.65] max-w-[560px]">
              The companies defining the future of civilisation.
            </p>
          </div>
          <div className="hidden md:block pt-1 text-right">
            <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-wd-muted leading-[1.8]">
              Section // 04
              <br />
              <span className="text-wd-gold/80">Intelligence</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Filter row — inline editorial, gold underline on active */}
      <Reveal delay={0.07}>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mb-12 pb-5 border-b border-wd-gold/20">
          {sectors.map((sector, idx) => {
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
                className="group relative font-mono text-[10px] tracking-[0.25em] uppercase transition-colors duration-300"
                style={{
                  color: isActive ? "rgb(212,168,67)" : "rgba(255,255,255,0.4)",
                }}
              >
                <span className="relative">
                  {sector}
                  <span
                    className="ml-1.5 opacity-50"
                    style={{ fontSize: "0.85em" }}
                  >
                    {count}
                  </span>
                  <span
                    className="absolute -bottom-1.5 left-0 right-0 h-px transition-transform duration-300 origin-left"
                    style={{
                      background: "rgb(212,168,67)",
                      transform: isActive ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </span>
                {idx < sectors.length - 1 && (
                  <span className="ml-5 text-wd-gold/20 select-none">/</span>
                )}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Company grid — typography only, no card chrome, hover halo defines unit */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 lg:gap-x-20">
        {visible.map((company, i) => (
          <Reveal key={company.name} delay={0.02 * Math.min(i, 6)}>
            <article className="relative py-7 border-t border-wd-gold/15 group h-full flex flex-col cursor-default isolate">
              {/* Hover halo — appears on hover to define each cell as a unit */}
              <span
                aria-hidden="true"
                className="absolute top-[1px] bottom-0 -left-4 -right-4 rounded-md bg-wd-gold/0 border border-wd-gold/0 group-hover:bg-wd-gold/[0.04] group-hover:border-wd-gold/25 transition-all duration-500 pointer-events-none -z-[1]"
              />

              {/* Name + sector */}
              <div className="mb-5">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-serif text-[clamp(18px,1.5vw,22px)] font-normal text-wd-text leading-[1.15] group-hover:text-wd-gold transition-colors duration-500">
                    {company.name}
                  </h3>
                  {company.trending && (
                    <svg
                      className="w-3.5 h-3.5 text-wd-gold flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22"
                      />
                    </svg>
                  )}
                </div>
                <div className="font-mono text-[9px] tracking-[0.35em] uppercase text-wd-gold/70 mt-1.5">
                  {company.sector}
                </div>
              </div>

              {/* Metrics — inline rows with mono labels */}
              <div className="space-y-1.5 mb-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-muted w-[52px] flex-shrink-0">
                    Raised
                  </span>
                  <span className="font-sans text-[13px] text-wd-text">
                    {company.funding}
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-muted w-[52px] flex-shrink-0">
                    Val
                  </span>
                  <span className="font-sans text-[13px] text-wd-text">
                    {company.valuation}
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-muted w-[52px] flex-shrink-0">
                    Team
                  </span>
                  <span className="font-sans text-[13px] text-wd-text">
                    {company.employees}
                  </span>
                </div>
              </div>

              {/* News — pushed to bottom of card via mt-auto */}
              <div className="flex items-start gap-2 mt-auto pt-4 border-t border-wd-border/40">
                <svg
                  className="w-3 h-3 text-wd-gold/80 flex-shrink-0 mt-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M11.3 1.046A1 1 0 0 0 9.552.871L6.7 5.318l-5.19.756a1 1 0 0 0-.554 1.705l3.756 3.66-.887 5.172a1 1 0 0 0 1.45 1.054L10 15.27l4.725 2.484a1 1 0 0 0 1.451-1.054l-.887-5.172 3.756-3.66a1 1 0 0 0-.554-1.705l-5.19-.756-2.852-4.272Z" />
                </svg>
                <span className="font-sans text-[12px] text-wd-sub leading-[1.55]">
                  {company.news}
                </span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Closing border on the company grid */}
      <div className="border-t border-wd-gold/15" />

      {/* Expand / Collapse — text-only editorial */}
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="font-mono text-[11px] tracking-[0.3em] uppercase text-wd-gold/80 hover:text-wd-gold transition-colors duration-300 py-2 group"
          >
            {expanded
              ? "Show less"
              : `Show all ${filtered.length} companies`}
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-y-0.5">
              {expanded ? "↑" : "↓"}
            </span>
          </button>
        </div>
      )}

      {/* Add your company — editorial, no card */}
      <Reveal delay={0.1}>
        <div className="mt-16 pt-10 border-t border-wd-gold/20">
          {addSubmitted ? (
            <div className="py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 mb-4 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h4 className="font-serif text-[clamp(22px,2.4vw,28px)] font-normal text-wd-text leading-[1.15] mb-2">
                Added to the radar.
              </h4>
              <p className="font-sans text-[14px] text-wd-sub leading-[1.6]">
                Your company is being researched and will appear shortly.
              </p>
            </div>
          ) : !showAddForm ? (
            <div className="flex items-end justify-between flex-wrap gap-6">
              <div className="max-w-[480px]">
                <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-wd-gold/70 mb-3">
                  {"// Submit"}
                </div>
                <h4 className="font-serif text-[clamp(22px,2.4vw,28px)] font-normal text-wd-text leading-[1.15] mb-2">
                  Not on the list?
                </h4>
                <p className="font-sans text-[14px] text-wd-sub leading-[1.6]">
                  If you&apos;re building in defense, aerospace, or hard tech, we want to know about you.
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="font-mono text-[11px] tracking-[0.15em] uppercase py-4 px-9 bg-transparent text-wd-text border border-wd-gold/60 font-bold rounded-lg transition-all duration-300 hover:bg-wd-gold/10 hover:border-wd-gold hover:-translate-y-px"
              >
                Add Your Company →
              </button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAddSubmitting(true);
                // Log the submission
                await supabase.from("company_submissions").insert({
                  company_name: addCompany.trim(),
                  contact_email: addEmail.trim(),
                });
                // Trigger Claude to research and populate the company
                try {
                  await fetch("/api/companies/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      company_name: addCompany.trim(),
                      contact_email: addEmail.trim(),
                    }),
                  });
                } catch {
                  // Still show success — submission is logged
                }
                setAddSubmitting(false);
                setAddSubmitted(true);
              }}
              className="space-y-7 max-w-[640px]"
            >
              <div className="flex items-end justify-between mb-2 gap-4">
                <div>
                  <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-wd-gold/80 mb-3">
                    {"// Submit"}
                  </div>
                  <h4 className="font-serif text-[clamp(22px,2.4vw,28px)] font-normal text-wd-text leading-[1.15]">
                    Add Your Company
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-wd-muted hover:text-wd-text transition-colors -mb-1"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                <div>
                  <label className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold/70 mb-3 block">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addCompany}
                    onChange={(e) => setAddCompany(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-wd-border text-wd-text font-sans text-[16px] py-3 px-0 focus:border-wd-gold/60 focus:outline-none transition-colors placeholder:text-wd-muted/50"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold/70 mb-3 block">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-wd-border text-wd-text font-sans text-[16px] py-3 px-0 focus:border-wd-gold/60 focus:outline-none transition-colors placeholder:text-wd-muted/50"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={addSubmitting}
                className="font-mono text-[11px] tracking-[0.15em] uppercase py-4 px-9 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {addSubmitting ? "Researching..." : "Add Company →"}
              </button>
            </form>
          )}
        </div>
      </Reveal>

      <p className="font-sans text-[11px] italic text-wd-muted mt-10 text-center">
        Company data is refreshed monthly and may not reflect the latest figures.
      </p>
    </section>
  );
}
