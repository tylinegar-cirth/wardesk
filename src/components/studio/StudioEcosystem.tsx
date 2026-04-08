"use client";

import { useState, useEffect } from "react";
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

const sectorOptions = sectors.filter((s) => s !== "All Companies");

// 2 rows × 3 columns = 6 cards before expand
const INITIAL_COUNT = 6;

export default function StudioEcosystem() {
  const [activeSector, setActiveSector] = useState("All Companies");
  const [expanded, setExpanded] = useState(false);
  const [companies, setCompanies] = useState<StudioCompany[]>(staticCompanies);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addSubmitted, setAddSubmitted] = useState(false);
  const [addForm, setAddForm] = useState({
    company_name: "",
    sector: "",
    website: "",
    contact_email: "",
    description: "",
  });

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
      className="py-[clamp(56px,9vw,110px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto"
    >
      <Reveal>
        <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          The Sector
        </div>
        <h2 className="font-serif text-[clamp(28px,3.8vw,42px)] font-normal text-wd-text leading-[1.1] mb-3">
          Companies On Our Radar
        </h2>
        <p className="font-sans text-[clamp(14px,1.4vw,16px)] font-light text-wd-sub leading-[1.65] max-w-[560px] mb-8">
          The companies defining the future of civilisation.
        </p>
      </Reveal>

      {/* Filter tabs */}
      <Reveal delay={0.07}>
        <div className="flex flex-wrap gap-2 mb-8">
          {sectors.map((sector) => {
            const count =
              sector === "All Companies"
                ? companies.length
                : companies.filter((c) => c.sector === sector).length;
            return (
              <button
                key={sector}
                onClick={() => {
                  setActiveSector(sector);
                  setExpanded(false);
                }}
                className={`font-mono text-[10px] tracking-[0.05em] uppercase py-2 px-3.5 rounded-lg border transition-all duration-200 ${
                  activeSector === sector
                    ? "border-wd-gold bg-wd-gold-glow text-wd-gold"
                    : "border-wd-border bg-wd-overlay/[0.02] text-wd-muted hover:border-wd-border-hov hover:text-wd-sub"
                }`}
              >
                {sector}{" "}
                <span className="opacity-50 ml-1">{count}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Company grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((company, i) => (
          <Reveal key={company.name} delay={0.02 * Math.min(i, 6)}>
            <div className="bg-wd-card border border-wd-border rounded-[14px] p-5 hover:border-wd-border-hov transition-colors h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-wd-overlay/[0.06] flex items-center justify-center font-mono text-xs font-bold text-wd-text">
                  {company.abbr}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm text-wd-text truncate">
                      {company.name}
                    </span>
                    {company.trending && (
                      <svg
                        className="w-3.5 h-3.5 text-wd-gold flex-shrink-0"
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
                  <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-wd-muted">
                    {company.sector}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <div className="font-mono text-[8px] tracking-[0.15em] uppercase text-wd-muted mb-0.5">
                    Raised
                  </div>
                  <div className="font-sans text-xs text-wd-text">
                    {company.funding}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[8px] tracking-[0.15em] uppercase text-wd-muted mb-0.5">
                    Valuation
                  </div>
                  <div className="font-sans text-xs text-wd-text">
                    {company.valuation}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[8px] tracking-[0.15em] uppercase text-wd-muted mb-0.5">
                    Team
                  </div>
                  <div className="font-sans text-xs text-wd-text">
                    {company.employees}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 text-wd-gold flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M11.3 1.046A1 1 0 0 0 9.552.871L6.7 5.318l-5.19.756a1 1 0 0 0-.554 1.705l3.756 3.66-.887 5.172a1 1 0 0 0 1.45 1.054L10 15.27l4.725 2.484a1 1 0 0 0 1.451-1.054l-.887-5.172 3.756-3.66a1 1 0 0 0-.554-1.705l-5.19-.756-2.852-4.272Z" />
                </svg>
                <span className="font-sans text-xs text-wd-sub truncate">
                  {company.news}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Expand / Collapse */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="font-mono text-[11px] tracking-[0.1em] uppercase py-3 px-8 bg-wd-overlay/[0.03] text-wd-sub border border-wd-border rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-[8px] hover:bg-wd-overlay/[0.07] hover:border-wd-border-hov hover:text-wd-text hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
          >
            {expanded
              ? "Show less"
              : `Show all ${filtered.length} companies ↓`}
          </button>
        </div>
      )}

      {/* Add your company */}
      <Reveal delay={0.1}>
        <div className="mt-8 bg-wd-card border border-dashed border-wd-border rounded-[14px] p-6">
          {addSubmitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 mx-auto mb-3 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h4 className="font-serif text-lg text-wd-text mb-1">Submitted</h4>
              <p className="font-sans text-xs text-wd-sub">We&apos;ll review and add your company to the radar.</p>
            </div>
          ) : !showAddForm ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-sans text-sm text-wd-text mb-1">
                  Not on the list?
                </p>
                <p className="font-sans text-xs text-wd-sub">
                  If you&apos;re building in defense, aerospace, or hard tech, we want to know about you.
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="font-mono text-[10px] tracking-[0.1em] uppercase py-2.5 px-6 bg-wd-gold/10 text-wd-gold border border-wd-gold/20 rounded-lg hover:bg-wd-gold/20 transition-all cursor-pointer"
              >
                Add your company &rarr;
              </button>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAddSubmitting(true);
                await supabase.from("company_submissions").insert({
                  company_name: addForm.company_name.trim(),
                  sector: addForm.sector,
                  website: addForm.website.trim(),
                  contact_email: addForm.contact_email.trim(),
                  description: addForm.description.trim(),
                });
                setAddSubmitting(false);
                setAddSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-serif text-lg text-wd-text">Add Your Company</h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-wd-muted hover:text-wd-text transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1.5 block">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.company_name}
                    onChange={(e) => setAddForm({ ...addForm, company_name: e.target.value })}
                    className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors placeholder:text-wd-sub"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1.5 block">
                    Sector
                  </label>
                  <select
                    required
                    value={addForm.sector}
                    onChange={(e) => setAddForm({ ...addForm, sector: e.target.value })}
                    className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors appearance-none"
                  >
                    <option value="" disabled className="bg-[#0a0a0a] text-wd-sub">Select sector</option>
                    {sectorOptions.map((s) => (
                      <option key={s} value={s} className="bg-[#0a0a0a] text-wd-text">{s}</option>
                    ))}
                    <option value="Other" className="bg-[#0a0a0a] text-wd-text">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1.5 block">
                    Website
                  </label>
                  <input
                    type="url"
                    value={addForm.website}
                    onChange={(e) => setAddForm({ ...addForm, website: e.target.value })}
                    className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors placeholder:text-wd-sub"
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1.5 block">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={addForm.contact_email}
                    onChange={(e) => setAddForm({ ...addForm, contact_email: e.target.value })}
                    className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors placeholder:text-wd-sub"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1.5 block">
                  What are you building?
                </label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors placeholder:text-wd-sub resize-none h-20"
                  placeholder="Brief description of your company and product..."
                />
              </div>
              <button
                type="submit"
                disabled={addSubmitting}
                className="w-full font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {addSubmitting ? "Submitting..." : "Submit Company"}
              </button>
            </form>
          )}
        </div>
      </Reveal>

      <p className="font-sans text-[11px] italic text-wd-muted mt-6 text-center">
        Company data is refreshed monthly and may not reflect the latest figures.
      </p>
    </section>
  );
}
