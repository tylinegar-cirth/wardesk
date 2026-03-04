"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { updateAdvisorProfile } from "@/lib/actions/advisor";

const FOCUS_OPTIONS = [
  "Defense Strategy",
  "Acquisition",
  "Cybersecurity",
  "Space Systems",
  "AI/ML",
  "Special Operations",
  "Intelligence",
  "Joint Operations",
  "Naval Warfare",
  "Air Dominance",
  "Ground Combat",
  "Policy & Legislation",
];

export default function AdvisorProfilePage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "available" | "limited" | "unavailable"
  >("available");
  const [imageUrl, setImageUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [stars, setStars] = useState(0);
  const [yearsService, setYearsService] = useState(0);
  const [clearance, setClearance] = useState("");
  const [rate, setRate] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const loadProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: advisor } = await supabase
      .from("advisors")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (advisor) {
      setName(advisor.name || "");
      setTitle(advisor.title || "");
      setBio(advisor.bio || "");
      setFocus(advisor.focus || []);
      setAvailabilityStatus(advisor.availability_status || "available");
      setImageUrl(advisor.image_url || "");
      setBranch(advisor.branch || "");
      setStars(advisor.stars || 0);
      setYearsService(advisor.years_service || 0);
      setClearance(advisor.clearance || "");
      setRate(advisor.rate || 0);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function toggleFocus(area: string) {
    setFocus((prev) =>
      prev.includes(area) ? prev.filter((f) => f !== area) : [...prev, area]
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const result = await updateAdvisorProfile({
      title,
      bio,
      focus,
      availability_status: availabilityStatus,
      image_url: imageUrl,
    });

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Profile updated!" });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="p-8 md:p-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 bg-wd-card border border-wd-border rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-3xl">
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          Profile Settings
        </p>
        <h1 className="font-serif text-3xl text-wd-text mb-1">Your Profile</h1>
        <p className="font-sans text-sm text-wd-sub">
          Manage how clients see you on the platform.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-3 rounded-lg font-sans text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Read-only fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
              Name
            </label>
            <div className="bg-white/[0.02] border border-wd-border rounded-lg text-wd-sub font-sans text-sm px-4 py-3">
              {name}
            </div>
            <p className="font-mono text-[8px] text-wd-muted mt-1">
              Contact admin to change
            </p>
          </div>
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
              Branch
            </label>
            <div className="bg-white/[0.02] border border-wd-border rounded-lg text-wd-sub font-sans text-sm px-4 py-3">
              {branch}
            </div>
          </div>
        </div>

        {/* Read-only stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-wd-card border border-wd-border rounded-xl p-4 text-center">
            <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted mb-1">
              Stars
            </p>
            <p className="font-serif text-xl text-wd-text">
              {"★".repeat(stars)}
            </p>
          </div>
          <div className="bg-wd-card border border-wd-border rounded-xl p-4 text-center">
            <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted mb-1">
              Service
            </p>
            <p className="font-serif text-xl text-wd-text">{yearsService}yr</p>
          </div>
          <div className="bg-wd-card border border-wd-border rounded-xl p-4 text-center">
            <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted mb-1">
              Clearance
            </p>
            <p className="font-serif text-lg text-wd-text">{clearance}</p>
          </div>
        </div>

        {/* Editable: Title */}
        <div>
          <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
          />
        </div>

        {/* Editable: Bio */}
        <div>
          <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors resize-none"
            placeholder="Tell clients about your experience and expertise..."
          />
        </div>

        {/* Editable: Focus Areas */}
        <div>
          <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-3">
            Focus Areas
          </label>
          <div className="flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => toggleFocus(area)}
                className={`font-mono text-[10px] tracking-[0.05em] py-1.5 px-3 rounded-full border transition-all duration-200 ${
                  focus.includes(area)
                    ? "bg-wd-gold/10 border-wd-gold/30 text-wd-gold"
                    : "bg-transparent border-wd-border text-wd-muted hover:text-wd-sub hover:border-wd-sub/30"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Editable: Availability Status */}
        <div>
          <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
            Availability Status
          </label>
          <select
            value={availabilityStatus}
            onChange={(e) =>
              setAvailabilityStatus(
                e.target.value as "available" | "limited" | "unavailable"
              )
            }
            className="bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
          >
            <option value="available">Available</option>
            <option value="limited">Limited</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        {/* Editable: Hourly Rate (display only) */}
        <div>
          <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
            Hourly Rate
          </label>
          <div className="bg-white/[0.02] border border-wd-border rounded-lg text-wd-sub font-sans text-sm px-4 py-3">
            ${rate}/hr
          </div>
          <p className="font-mono text-[8px] text-wd-muted mt-1">
            Contact admin to change rate
          </p>
        </div>

        {/* Editable: Image URL */}
        <div>
          <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
            Profile Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
          />
          {imageUrl && (
            <div className="mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-wd-border"
              />
            </div>
          )}
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-10 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(212,168,67,0.35)] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
