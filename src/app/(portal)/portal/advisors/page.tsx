"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { DbAdvisor } from "@/lib/types/database";

const categories = [
  { id: "all", name: "All" },
  { id: "Army", name: "Army" },
  { id: "Navy", name: "Navy" },
  { id: "Air Force", name: "Air Force" },
  { id: "Space Force", name: "Space" },
  { id: "SOF", name: "SOF" },
  { id: "Intel", name: "Intel" },
  { id: "Cyber", name: "Cyber" },
  { id: "OSD", name: "OSD" },
];

const statusDot: Record<string, string> = {
  available: "bg-emerald-400",
  limited: "bg-amber-400",
  unavailable: "bg-red-400",
};

export default function AdvisorsPage() {
  const [advisors, setAdvisors] = useState<DbAdvisor[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("advisors")
        .select("*")
        .order("stars", { ascending: false });
      setAdvisors(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = advisors.filter((a) => {
    const matchesCategory = filter === "all" || a.category === filter;
    const matchesSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.focus.some((f) => f.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-2">
          Advisors
        </p>
        <h1 className="font-serif text-3xl text-wd-text">Browse advisors</h1>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, title, or focus area..."
          className="w-full max-w-md bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors placeholder:text-wd-muted/50"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`font-mono text-[10px] tracking-[0.1em] uppercase px-4 py-2 rounded-full border transition-all duration-200 ${
              filter === cat.id
                ? "bg-wd-gold-glow text-wd-gold border-wd-gold/30"
                : "bg-transparent text-wd-muted border-wd-border hover:text-wd-sub hover:border-wd-sub/30"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-wd-card border border-wd-border rounded-[14px] p-5 h-48 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-sans text-sm text-wd-muted">
            No advisors match your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((advisor) => (
            <Link
              key={advisor.id}
              href={`/portal/advisor/${advisor.id}`}
              className="bg-wd-card border border-wd-border rounded-[14px] p-5 hover:border-wd-gold/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-3 mb-4">
                {advisor.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={advisor.image_url}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-sans text-sm text-wd-text group-hover:text-wd-gold transition-colors truncate">
                      {advisor.name}
                    </p>
                    <span
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        statusDot[advisor.availability_status] || "bg-gray-500"
                      }`}
                    />
                  </div>
                  <p className="font-mono text-[10px] text-wd-muted truncate">
                    {advisor.title}
                  </p>
                </div>
              </div>

              {/* Stars */}
              {advisor.stars > 0 && (
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: advisor.stars }).map((_, i) => (
                    <svg key={i} className="w-3 h-3 text-wd-gold" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.5L10 13.68 5.06 16.1 6 10.6l-4-3.9 5.61-.87L10 1z" />
                    </svg>
                  ))}
                </div>
              )}

              {/* Focus tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {advisor.focus.slice(0, 2).map((f) => (
                  <span
                    key={f}
                    className="font-mono text-[8px] tracking-[0.05em] uppercase text-wd-muted bg-white/[0.04] px-2 py-0.5 rounded"
                  >
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-wd-muted">
                  {advisor.branch}
                </span>
                <span className="font-mono text-[11px] text-wd-gold">
                  ${advisor.rate.toLocaleString()}/hr
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
