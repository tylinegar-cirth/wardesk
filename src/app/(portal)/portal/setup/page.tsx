"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/auth/actions";

const focusOptions = [
  "Defense Policy",
  "Acquisition",
  "Logistics",
  "Indo-Pacific",
  "Cyber Operations",
  "Space Operations",
  "Special Operations",
  "Intelligence",
  "Nuclear Policy",
  "NATO/Coalition",
  "Army Modernization",
  "Naval Strategy",
];

export default function SetupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);

  function toggleFocus(area: string) {
    setSelectedFocus((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("focus_areas", selectedFocus.join(","));
    const result = await updateProfile(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-2">
          Profile Setup
        </p>
        <h1 className="font-serif text-3xl text-wd-text mb-2">
          Complete your profile
        </h1>
        <p className="font-sans text-sm text-wd-sub">
          Help us match you with the right advisors.
        </p>
      </div>

      <form action={handleSubmit}>
        <div className="bg-wd-card border border-wd-border rounded-[14px] p-6 md:p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
              Full name
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
              placeholder="Jane Smith"
            />
          </div>

          {/* Company */}
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
              Company
            </label>
            <input
              name="company"
              type="text"
              className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
              placeholder="Your company name"
            />
          </div>

          {/* Focus areas */}
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-3">
              Focus areas
            </label>
            <p className="font-sans text-xs text-wd-muted mb-3">
              Select areas you&apos;re interested in to get better advisor
              recommendations.
            </p>
            <div className="flex flex-wrap gap-2">
              {focusOptions.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleFocus(area)}
                  className={`font-mono text-[9px] tracking-[0.05em] uppercase px-3 py-1.5 rounded-full border transition-all ${
                    selectedFocus.includes(area)
                      ? "bg-wd-gold-glow text-wd-gold border-wd-gold/30"
                      : "bg-transparent text-wd-muted border-wd-border hover:text-wd-sub hover:border-wd-sub/30"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="font-sans text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0"
          >
            {loading ? "Saving..." : "Save & continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
