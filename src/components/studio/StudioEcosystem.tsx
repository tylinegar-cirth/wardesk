"use client";

import { useState, useEffect } from "react";
import Reveal from "@/components/ui/Reveal";
import {
  studioCompanies as staticCompanies,
  sectors,
  type StudioCompany,
} from "@/data/studio-companies";

// 2 rows × 3 columns = 6 cards before expand
const INITIAL_COUNT = 6;

export default function StudioEcosystem() {
  const [activeSector, setActiveSector] = useState("All Companies");
  const [expanded, setExpanded] = useState(false);
  const [companies, setCompanies] = useState<StudioCompany[]>(staticCompanies);

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
        <div className="mt-8 bg-wd-card border border-dashed border-wd-border rounded-[14px] p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-sans text-sm text-wd-text mb-1">
              Not on the list?
            </p>
            <p className="font-sans text-xs text-wd-sub">
              If you&apos;re building in defense, aerospace, or hard tech, we want to know about you.
            </p>
          </div>
          <a
            href="#contact"
            className="font-mono text-[10px] tracking-[0.1em] uppercase py-2.5 px-6 bg-wd-gold/10 text-wd-gold border border-wd-gold/20 rounded-lg hover:bg-wd-gold/20 transition-all"
          >
            Add your company &rarr;
          </a>
        </div>
      </Reveal>

      <p className="font-sans text-[11px] italic text-wd-muted mt-6 text-center">
        Company data is refreshed monthly and may not reflect the latest figures.
      </p>
    </section>
  );
}
