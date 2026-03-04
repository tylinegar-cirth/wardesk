"use client";

import { useState, useMemo } from "react";
import { advisors, categories, Advisor } from "@/data/advisors";
import Stars from "@/components/ui/Stars";
import Reveal from "@/components/ui/Reveal";

export default function AdvisorGrid({
  onSelect,
}: {
  onSelect: (a: Advisor) => void;
}) {
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? advisors
        : advisors.filter((a) => a.category === filter || a.branch === filter),
    [filter]
  );
  const gridAdvisors = showAll ? filtered : filtered.slice(0, 8);

  return (
    <div>
      <Reveal>
        <div className="flex justify-between items-end mb-2 flex-wrap gap-4">
          <div>
            <h3 className="font-serif text-[clamp(22px,2.5vw,28px)] font-normal text-wd-text mb-1.5">
              Full network
            </h3>
            <p className="font-sans text-[13px] text-wd-muted">
              {filtered.length} advisors
              {filter !== "all" ? ` in ${filter}` : ""}
            </p>
          </div>
        </div>
      </Reveal>

      {/* Filters */}
      <div className="flex flex-wrap gap-1 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setFilter(cat.id);
              setShowAll(false);
            }}
            className={`font-mono text-[10px] tracking-[0.05em] py-[9px] px-[18px] border-none rounded-lg transition-all duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              filter === cat.id
                ? "bg-wd-text text-wd-bg shadow-[0_2px_12px_rgba(255,255,255,0.1)]"
                : "bg-white/[0.03] text-wd-muted hover:bg-white/[0.06] hover:text-wd-sub"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-x-5 gap-y-9 max-[1024px]:grid-cols-3 max-[768px]:grid-cols-2 max-[768px]:gap-x-3.5 max-[768px]:gap-y-6 max-[480px]:grid-cols-2 max-[480px]:gap-x-2.5 max-[480px]:gap-y-5">
        {gridAdvisors.map((a, i) => (
          <Reveal key={a.id} delay={0.06 + i * 0.07}>
            <div
              className="group cursor-pointer transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[5px]"
              onClick={() => onSelect(a)}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-wd-card mb-3.5 rounded-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] max-[480px]:rounded-[10px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.image}
                  alt={a.name}
                  className="w-full h-full object-cover grayscale brightness-[0.8] transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.04]"
                />
                {/* Border overlay */}
                <div className="absolute inset-0 rounded-[14px] border border-white/[0.04] pointer-events-none transition-[border-color] duration-300 group-hover:border-white/[0.08] max-[480px]:rounded-[10px]" />
                {/* Gold edge */}
                <div className="absolute bottom-0 left-1.5 right-1.5 h-0.5 bg-wd-gold rounded-sm scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_12px_rgba(212,168,67,0.15)] group-hover:scale-x-100" />
                {/* Stars badge */}
                {a.stars > 0 && (
                  <div className="absolute top-2.5 left-2.5">
                    <Stars count={a.stars} size={8} />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1">
                {a.branch}
              </div>
              <h3 className="font-serif text-[clamp(15px,1.5vw,18px)] font-normal text-wd-text mb-0.5 leading-tight">
                {a.name}
              </h3>
              <p className="font-sans text-xs text-wd-sub leading-snug line-clamp-2">
                {a.title}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* View all button */}
      {!showAll && filtered.length > 8 && (
        <Reveal>
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-8 bg-white/[0.03] text-wd-sub border border-wd-border rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-[8px] hover:bg-white/[0.07] hover:border-wd-border-hov hover:text-wd-text hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
            >
              View all {filtered.length} advisors
            </button>
          </div>
        </Reveal>
      )}
    </div>
  );
}
