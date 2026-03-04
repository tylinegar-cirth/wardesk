"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  updateAvailability,
  addBlockedDate,
  removeBlockedDate,
} from "@/lib/actions/advisor";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const h = String(i).padStart(2, "0");
  return [`${h}:00`, `${h}:30`];
}).flat();

interface SlotState {
  enabled: boolean;
  start_time: string;
  end_time: string;
}

interface BlockedDate {
  id: string;
  date: string;
  reason: string | null;
}

export default function AdvisorSchedulePage() {
  const [slots, setSlots] = useState<SlotState[]>(
    DAYS.map(() => ({ enabled: false, start_time: "09:00", end_time: "17:00" }))
  );
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [newBlockedReason, setNewBlockedReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingBlocked, setAddingBlocked] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const loadData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: advisor } = await supabase
      .from("advisors")
      .select("id")
      .eq("user_id", user.id)
      .single();
    if (!advisor) return;

    // Load availability
    const { data: avail } = await supabase
      .from("availability")
      .select("*")
      .eq("advisor_id", advisor.id);

    if (avail) {
      const newSlots = DAYS.map((_, i) => {
        const match = avail.find((a) => a.day_of_week === i);
        return match
          ? {
              enabled: true,
              start_time: match.start_time.slice(0, 5),
              end_time: match.end_time.slice(0, 5),
            }
          : { enabled: false, start_time: "09:00", end_time: "17:00" };
      });
      setSlots(newSlots);
    }

    // Load blocked dates
    const { data: blocked } = await supabase
      .from("blocked_dates")
      .select("*")
      .eq("advisor_id", advisor.id)
      .order("date", { ascending: true });

    if (blocked) setBlockedDates(blocked);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleSaveAvailability() {
    setSaving(true);
    setMessage(null);

    const enabledSlots = slots
      .map((slot, i) => ({
        day_of_week: i,
        start_time: slot.start_time,
        end_time: slot.end_time,
        timezone: "America/New_York",
      }))
      .filter((_, i) => slots[i].enabled);

    const result = await updateAvailability(enabledSlots);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Availability saved!" });
    }
    setSaving(false);
  }

  async function handleAddBlockedDate() {
    if (!newBlockedDate) return;
    setAddingBlocked(true);

    const result = await addBlockedDate(
      newBlockedDate,
      newBlockedReason || undefined
    );
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setNewBlockedDate("");
      setNewBlockedReason("");
      loadData();
    }
    setAddingBlocked(false);
  }

  async function handleRemoveBlockedDate(id: string) {
    const result = await removeBlockedDate(id);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setBlockedDates((prev) => prev.filter((b) => b.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="p-8 md:p-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-wd-card border border-wd-border rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 max-w-4xl">
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          Schedule Management
        </p>
        <h1 className="font-serif text-3xl text-wd-text mb-1">
          Availability
        </h1>
        <p className="font-sans text-sm text-wd-sub">
          Set your weekly availability and block specific dates.
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

      {/* Weekly Availability */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-wd-muted mb-4">
          Weekly Hours
        </p>
        <div className="space-y-3">
          {DAYS.map((day, i) => (
            <div
              key={day}
              className="bg-wd-card border border-wd-border rounded-xl p-4 flex items-center gap-4 flex-wrap"
            >
              <label className="flex items-center gap-3 min-w-[140px]">
                <input
                  type="checkbox"
                  checked={slots[i].enabled}
                  onChange={(e) => {
                    const copy = [...slots];
                    copy[i] = { ...copy[i], enabled: e.target.checked };
                    setSlots(copy);
                  }}
                  className="w-4 h-4 accent-[#D4A843] rounded"
                />
                <span
                  className={`font-mono text-[11px] tracking-[0.05em] uppercase ${
                    slots[i].enabled ? "text-wd-text" : "text-wd-muted"
                  }`}
                >
                  {day}
                </span>
              </label>

              {slots[i].enabled && (
                <div className="flex items-center gap-2">
                  <select
                    value={slots[i].start_time}
                    onChange={(e) => {
                      const copy = [...slots];
                      copy[i] = { ...copy[i], start_time: e.target.value };
                      setSlots(copy);
                    }}
                    className="bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-mono text-xs px-3 py-2 focus:border-wd-gold/50 outline-none"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span className="text-wd-muted text-xs">to</span>
                  <select
                    value={slots[i].end_time}
                    onChange={(e) => {
                      const copy = [...slots];
                      copy[i] = { ...copy[i], end_time: e.target.value };
                      setSlots(copy);
                    }}
                    className="bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-mono text-xs px-3 py-2 focus:border-wd-gold/50 outline-none"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveAvailability}
          disabled={saving}
          className="mt-5 font-mono text-[11px] tracking-[0.1em] uppercase py-3 px-8 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(212,168,67,0.35)] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Availability"}
        </button>
      </div>

      {/* Blocked Dates */}
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-wd-muted mb-4">
          Blocked Dates
        </p>

        {/* Add new */}
        <div className="bg-wd-card border border-wd-border rounded-xl p-4 mb-4 flex gap-3 flex-wrap items-end">
          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-3 py-2 focus:border-wd-gold/50 outline-none"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-1.5">
              Reason (optional)
            </label>
            <input
              type="text"
              value={newBlockedReason}
              onChange={(e) => setNewBlockedReason(e.target.value)}
              placeholder="e.g. Conference travel"
              className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-3 py-2 focus:border-wd-gold/50 outline-none"
            />
          </div>
          <button
            onClick={handleAddBlockedDate}
            disabled={addingBlocked || !newBlockedDate}
            className="font-mono text-[10px] tracking-[0.1em] uppercase py-2 px-5 bg-wd-overlay/[0.05] text-wd-text border border-wd-border font-bold rounded-lg transition-all duration-300 hover:bg-wd-overlay/[0.08] disabled:opacity-50"
          >
            {addingBlocked ? "..." : "Add"}
          </button>
        </div>

        {/* List */}
        {blockedDates.length > 0 ? (
          <div className="space-y-2">
            {blockedDates.map((bd) => (
              <div
                key={bd.id}
                className="bg-wd-card border border-wd-border rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <span className="font-mono text-xs text-wd-text">
                    {new Date(bd.date + "T00:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </span>
                  {bd.reason && (
                    <span className="text-wd-muted text-xs ml-3">
                      {bd.reason}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveBlockedDate(bd.id)}
                  className="font-mono text-[9px] text-red-400 hover:text-red-300 bg-transparent border-none"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-wd-muted">
            No blocked dates set.
          </p>
        )}
      </div>
    </div>
  );
}
