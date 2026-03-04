"use client";

import { useState, KeyboardEvent } from "react";
import { updateProfile } from "@/lib/auth/actions";

const suggestedFocus = [
  "Defense Policy",
  "Acquisition & Procurement",
  "Logistics & Sustainment",
  "Indo-Pacific Strategy",
  "European Security",
  "Middle East & Africa",
  "Cyber Operations",
  "Space Operations",
  "Special Operations",
  "Intelligence & SIGINT",
  "Nuclear Policy & Deterrence",
  "NATO & Coalition Ops",
  "Army Modernization",
  "Naval Strategy",
  "Air & Missile Defense",
  "Autonomous Systems & AI",
  "Electronic Warfare",
  "JADC2 / C4ISR",
  "Defense Industrial Base",
  "Budget & PPBE Process",
  "International Arms Sales (FMS)",
  "Hypersonics",
  "Counter-terrorism",
  "Homeland Security",
];

export default function SetupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !selectedFocus.includes(trimmed)) {
      setSelectedFocus((prev) => [...prev, trimmed]);
    }
    setCustomTag("");
    setShowSuggestions(false);
  }

  function removeTag(tag: string) {
    setSelectedFocus((prev) => prev.filter((t) => t !== tag));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (customTag.trim()) addTag(customTag);
    } else if (e.key === "Backspace" && !customTag && selectedFocus.length > 0) {
      setSelectedFocus((prev) => prev.slice(0, -1));
    }
  }

  // Filter suggestions based on what's typed and not already selected
  const filteredSuggestions = suggestedFocus.filter(
    (s) =>
      !selectedFocus.includes(s) &&
      (!customTag || s.toLowerCase().includes(customTag.toLowerCase()))
  );

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
              className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
              placeholder="Jane Smith"
            />
          </div>

          {/* Title / Position */}
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
              Title / Position
            </label>
            <input
              name="title"
              type="text"
              className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
              placeholder="VP of Strategy, Founder, Program Manager..."
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
              className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
              placeholder="Your company name"
            />
          </div>

          {/* Focus areas — tag input with suggestions */}
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
              Focus areas
            </label>
            <p className="font-sans text-xs text-wd-muted mb-3">
              Select from suggestions or type your own. Press Enter to add.
            </p>

            {/* Selected tags */}
            {selectedFocus.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedFocus.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.05em] uppercase px-3 py-1.5 rounded-full bg-wd-gold-glow text-wd-gold border border-wd-gold/30"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-wd-gold/60 hover:text-wd-gold transition-colors bg-transparent border-none cursor-pointer text-sm leading-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Text input for custom tags */}
            <div className="relative">
              <input
                type="text"
                value={customTag}
                onChange={(e) => {
                  setCustomTag(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  // Delay to allow clicking suggestions
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
                placeholder="Type a focus area or select below..."
              />

              {/* Dropdown suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-wd-card border border-wd-border rounded-lg max-h-40 overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                  {filteredSuggestions.slice(0, 6).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addTag(suggestion);
                      }}
                      className="w-full text-left px-4 py-2.5 font-sans text-sm text-wd-sub hover:text-wd-text hover:bg-wd-overlay/[0.04] transition-colors bg-transparent border-none cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowSuggestions(false);
                    }}
                    className="w-full text-center px-4 py-2 font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-text border-t border-wd-border bg-transparent cursor-pointer transition-colors"
                  >
                    Close suggestions
                  </button>
                </div>
              )}
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
