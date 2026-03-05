"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cancelBooking, updateBookingNotes } from "@/lib/actions/bookings";
import StatusBadge from "@/components/shared/StatusBadge";
import type { DbBooking } from "@/lib/types/database";
import { demoAllUpcoming, demoAllPast } from "@/data/demo-advisory-mock";

type Tab = "upcoming" | "past";

export default function SessionsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [sessions, setSessions] = useState<DbBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Demo mode — use mock data
      if (document.cookie.includes("wd-demo=1")) {
        setSessions(
          (tab === "upcoming" ? demoAllUpcoming : demoAllPast) as unknown as DbBooking[]
        );
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const now = new Date().toISOString();
      if (tab === "upcoming") {
        const { data } = await supabase
          .from("bookings")
          .select("*, advisor:advisors(*)")
          .eq("user_id", user.id)
          .in("status", ["confirmed"])
          .gte("scheduled_at", now)
          .order("scheduled_at", { ascending: true });
        setSessions(data || []);
      } else {
        const { data } = await supabase
          .from("bookings")
          .select("*, advisor:advisors(*)")
          .eq("user_id", user.id)
          .in("status", ["completed", "cancelled", "no-show"])
          .order("scheduled_at", { ascending: false });
        setSessions(data || []);
      }
      setLoading(false);
    }
    load();
  }, [tab]);

  async function handleCancel(bookingId: string) {
    const result = await cancelBooking(bookingId);
    if (!result.error) {
      setSessions((prev) => prev.filter((s) => s.id !== bookingId));
    }
  }

  async function handleSaveNotes(bookingId: string) {
    const result = await updateBookingNotes(bookingId, noteText);
    if (!result.error) {
      setSessions((prev) =>
        prev.map((s) => (s.id === bookingId ? { ...s, notes: noteText } : s))
      );
      setExpandedId(null);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-2">
          Sessions
        </p>
        <h1 className="font-serif text-3xl text-wd-text">Your sessions</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-wd-card border border-wd-border rounded-lg p-1 w-fit">
        {(["upcoming", "past"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setExpandedId(null);
            }}
            className={`font-mono text-[10px] tracking-[0.1em] uppercase px-5 py-2 rounded-md transition-all ${
              tab === t
                ? "bg-wd-gold-glow text-wd-gold"
                : "text-wd-muted hover:text-wd-sub"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-wd-card border border-wd-border rounded-[14px] p-5 h-20 animate-pulse"
            />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-wd-card border border-wd-border rounded-[14px] p-8 text-center">
          <p className="font-sans text-sm text-wd-muted">
            {tab === "upcoming"
              ? "No upcoming sessions"
              : "No past sessions yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-wd-card border border-wd-border rounded-[14px] overflow-hidden"
            >
              <div className="p-5 flex items-center gap-4 max-[480px]:flex-wrap">
                {session.advisor?.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.advisor.image_url}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-wd-text truncate">
                    {session.advisor?.name}
                  </p>
                  <p className="font-mono text-[10px] text-wd-muted">
                    {new Date(session.scheduled_at).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    &middot;{" "}
                    {new Date(session.scheduled_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    &middot; {session.duration_minutes}min
                  </p>
                </div>

                <StatusBadge status={session.status} />

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0 max-[480px]:w-full max-[480px]:pt-1 max-[480px]:border-t max-[480px]:border-wd-border">
                  {tab === "upcoming" && session.meeting_link && (
                    <a
                      href={session.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-gold hover:text-wd-text transition-colors"
                    >
                      Join
                    </a>
                  )}
                  {tab === "upcoming" && (
                    <button
                      onClick={() => handleCancel(session.id)}
                      className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted hover:text-red-400 transition-colors bg-transparent border-none"
                    >
                      Cancel
                    </button>
                  )}
                  {tab === "past" && (
                    <button
                      onClick={() => {
                        if (expandedId === session.id) {
                          setExpandedId(null);
                        } else {
                          setExpandedId(session.id);
                          setNoteText(session.notes || "");
                        }
                      }}
                      className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-sub transition-colors bg-transparent border-none"
                    >
                      Notes
                    </button>
                  )}
                </div>
              </div>

              {/* Expandable notes */}
              {expandedId === session.id && (
                <div className="px-5 pb-5 border-t border-wd-border pt-4">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add notes about this session..."
                    className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors resize-none h-24"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => handleSaveNotes(session.id)}
                      className="font-mono text-[10px] tracking-[0.1em] uppercase px-4 py-2 bg-wd-gold text-wd-bg font-bold rounded-lg"
                    >
                      Save notes
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
