"use client";

import { useState } from "react";
import Link from "next/link";

interface Recommendation {
  advisor_id: string;
  name: string;
  reason: string;
  advisor: {
    id: string;
    name: string;
    title: string;
    branch: string;
    stars: number;
    focus: string[];
    rate: number;
    image_url: string | null;
  } | null;
}

interface MatchResult {
  recommendations: Recommendation[];
  summary: string;
}

export default function MissionBrief() {
  const [mission, setMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mission.trim() || mission.trim().length < 10) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission: mission.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-wd-card border border-wd-border rounded-[14px] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-wd-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-wd-gold-glow flex items-center justify-center text-wd-gold text-sm">
            &#9733;
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold">
              Mission Brief
            </p>
            <p className="font-sans text-xs text-wd-muted">
              AI-powered advisor matching
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-6">
        <textarea
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          placeholder="Describe your goals, challenges, or what you need help with. For example: &quot;We're building an autonomous logistics system and need help navigating Army acquisition channels and SOCOM procurement...&quot;"
          className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors resize-none h-28 placeholder:text-wd-muted/40"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || mission.trim().length < 10}
          className="mt-3 w-full font-mono text-[11px] tracking-[0.1em] uppercase py-3 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98] disabled:opacity-40 disabled:translate-y-0 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 border-2 border-wd-bg/30 border-t-wd-bg rounded-full animate-spin" />
              Analyzing mission...
            </span>
          ) : (
            "Find advisors"
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="px-6 pb-6">
          <p className="font-sans text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="border-t border-wd-border">
          {/* Summary */}
          <div className="px-6 pt-5 pb-3">
            <p className="font-sans text-sm text-wd-sub italic">
              {result.summary}
            </p>
          </div>

          {/* Advisor cards */}
          <div className="px-6 pb-6 space-y-3">
            {result.recommendations.map((rec, i) => (
              <Link
                key={rec.advisor_id}
                href={`/portal/advisor/${rec.advisor_id}`}
                className="flex items-start gap-4 bg-white/[0.02] border border-wd-border rounded-xl p-4 hover:border-wd-gold/30 transition-all group"
              >
                <div className="flex-shrink-0 relative">
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-wd-gold text-wd-bg text-[10px] font-bold flex items-center justify-center z-10">
                    {i + 1}
                  </span>
                  {rec.advisor?.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={rec.advisor.image_url}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-wd-border" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-sans text-sm text-wd-text group-hover:text-wd-gold transition-colors truncate">
                      {rec.name}
                    </p>
                    {rec.advisor?.stars && rec.advisor.stars > 0 && (
                      <div className="flex gap-px flex-shrink-0">
                        {Array.from({ length: rec.advisor.stars }).map((_, j) => (
                          <svg key={j} className="w-2.5 h-2.5 text-wd-gold" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.5L10 13.68 5.06 16.1 6 10.6l-4-3.9 5.61-.87L10 1z" />
                          </svg>
                        ))}
                      </div>
                    )}
                  </div>
                  {rec.advisor && (
                    <p className="font-mono text-[10px] text-wd-muted mb-1.5 truncate">
                      {rec.advisor.title}
                    </p>
                  )}
                  <p className="font-sans text-xs text-wd-sub leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-wd-gold flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Book &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
