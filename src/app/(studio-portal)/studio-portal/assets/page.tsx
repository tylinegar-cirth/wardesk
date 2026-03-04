"use client";

import { useState } from "react";
import { mockAssets, mockProjects } from "@/data/studio-mock";

const typeFilters = ["All", "Video", "Image", "Document"];

const typeIcons: Record<string, React.ReactNode> = {
  Video: (
    <svg className="w-8 h-8 text-wd-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  ),
  Image: (
    <svg className="w-8 h-8 text-wd-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  ),
  Document: (
    <svg className="w-8 h-8 text-wd-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
};

export default function StudioAssetsPage() {
  const [projectFilter, setProjectFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered = mockAssets.filter((a) => {
    if (projectFilter !== "All" && a.projectId !== projectFilter) return false;
    if (typeFilter !== "All" && a.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-2">
          Assets
        </p>
        <h1 className="font-serif text-3xl text-wd-text">
          Production Assets
        </h1>
        <p className="font-sans text-sm text-wd-sub mt-1">
          Everything we&apos;ve delivered, in one place.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-8">
        {/* Project filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setProjectFilter("All")}
            className={`font-mono text-[10px] tracking-[0.05em] uppercase py-2 px-3 rounded-lg border transition-all duration-200 ${
              projectFilter === "All"
                ? "border-wd-gold bg-wd-gold-glow text-wd-gold"
                : "border-wd-border bg-wd-overlay/[0.02] text-wd-muted hover:border-wd-border-hov hover:text-wd-sub"
            }`}
          >
            All Projects
          </button>
          {mockProjects.map((p) => (
            <button
              key={p.id}
              onClick={() => setProjectFilter(p.id)}
              className={`font-mono text-[10px] tracking-[0.05em] uppercase py-2 px-3 rounded-lg border transition-all duration-200 ${
                projectFilter === p.id
                  ? "border-wd-gold bg-wd-gold-glow text-wd-gold"
                  : "border-wd-border bg-wd-overlay/[0.02] text-wd-muted hover:border-wd-border-hov hover:text-wd-sub"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap gap-1.5">
          {typeFilters.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`font-mono text-[10px] tracking-[0.05em] uppercase py-2 px-3 rounded-lg border transition-all duration-200 ${
                typeFilter === t
                  ? "border-wd-gold bg-wd-gold-glow text-wd-gold"
                  : "border-wd-border bg-wd-overlay/[0.02] text-wd-muted hover:border-wd-border-hov hover:text-wd-sub"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="bg-wd-card border border-wd-border rounded-[14px] overflow-hidden hover:border-wd-border-hov transition-colors group"
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-wd-overlay/[0.03] flex items-center justify-center">
              {typeIcons[asset.type] || (
                <span className="text-3xl">{asset.thumbnail}</span>
              )}
            </div>
            {/* Info */}
            <div className="p-4">
              <p className="font-sans text-sm text-wd-text truncate mb-0.5 group-hover:text-wd-gold transition-colors">
                {asset.name}
              </p>
              <p className="font-mono text-[9px] text-wd-muted mb-2">
                {asset.project}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] text-wd-muted">
                  {asset.date} · {asset.size}
                </span>
                <button className="font-mono text-[9px] text-wd-gold hover:text-wd-text transition-colors bg-transparent border-none p-0">
                  ↓
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-wd-card border border-wd-border rounded-[14px] p-10 text-center">
          <p className="font-sans text-sm text-wd-muted">
            No assets match the selected filters.
          </p>
        </div>
      )}
    </div>
  );
}
