"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  updateMeetingLink,
  markSessionCompleted,
} from "@/lib/actions/advisor";

type Tab = "upcoming" | "past";

interface SessionRow {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  price: number;
  meeting_link: string | null;
  notes: string | null;
  user: { name: string | null; company: string | null; email: string } | null;
}

export default function AdvisorSessionsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [linkValue, setLinkValue] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const loadSessions = useCallback(async () => {
    setLoading(true);
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

    const now = new Date().toISOString();

    if (tab === "upcoming") {
      const { data } = await supabase
        .from("bookings")
        .select("*, user:users(name, company, email)")
        .eq("advisor_id", advisor.id)
        .eq("status", "confirmed")
        .gte("scheduled_at", now)
        .order("scheduled_at", { ascending: true });
      setSessions((data as SessionRow[]) || []);
    } else {
      const { data } = await supabase
        .from("bookings")
        .select("*, user:users(name, company, email)")
        .eq("advisor_id", advisor.id)
        .in("status", ["completed", "cancelled", "no-show"])
        .order("scheduled_at", { ascending: false })
        .limit(20);
      setSessions((data as SessionRow[]) || []);
    }
    setLoading(false);
  }, [supabase, tab]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  async function handleSaveLink(bookingId: string) {
    const result = await updateMeetingLink(bookingId, linkValue);
    if (!result.error) {
      setEditingLink(null);
      setLinkValue("");
      loadSessions();
    }
  }

  async function handleComplete(bookingId: string) {
    const result = await markSessionCompleted(bookingId);
    if (!result.error) {
      loadSessions();
    }
  }

  return (
    <div className="p-8 md:p-12 max-w-5xl">
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          Session Management
        </p>
        <h1 className="font-serif text-3xl text-wd-text">Sessions</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-wd-card border border-wd-border rounded-lg p-1 w-fit">
        {(["upcoming", "past"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-[10px] tracking-[0.1em] uppercase px-5 py-2 rounded-md transition-all duration-200 ${
              tab === t
                ? "bg-wd-gold text-wd-bg font-bold"
                : "text-wd-muted hover:text-wd-sub bg-transparent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-wd-card border border-wd-border rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-wd-card border border-wd-border rounded-xl p-8 text-center">
          <p className="font-sans text-sm text-wd-muted">
            {tab === "upcoming"
              ? "No upcoming sessions scheduled."
              : "No past sessions yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const dt = new Date(session.scheduled_at);
            return (
              <div
                key={session.id}
                className="bg-wd-card border border-wd-border rounded-xl p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-sans text-sm text-wd-text font-medium">
                      {session.user?.name || session.user?.email || "Client"}
                    </p>
                    {session.user?.company && (
                      <p className="font-sans text-xs text-wd-muted">
                        {session.user.company}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={session.status} />
                </div>

                <div className="flex items-center gap-4 text-wd-sub font-mono text-[10px] mb-3">
                  <span>
                    {dt.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span>
                    {dt.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <span>{session.duration_minutes}min</span>
                  <span>${(session.price / 100).toLocaleString()}</span>
                </div>

                {/* Actions for upcoming */}
                {tab === "upcoming" && (
                  <div className="flex gap-2 items-center flex-wrap">
                    {editingLink === session.id ? (
                      <div className="flex gap-2 items-center">
                        <input
                          type="url"
                          value={linkValue}
                          onChange={(e) => setLinkValue(e.target.value)}
                          placeholder="https://zoom.us/j/..."
                          className="bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-xs px-3 py-1.5 focus:border-wd-gold/50 outline-none w-64"
                        />
                        <button
                          onClick={() => handleSaveLink(session.id)}
                          className="font-mono text-[9px] uppercase text-emerald-400 hover:text-emerald-300 bg-transparent border-none"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingLink(null);
                            setLinkValue("");
                          }}
                          className="font-mono text-[9px] uppercase text-wd-muted hover:text-wd-sub bg-transparent border-none"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingLink(session.id);
                            setLinkValue(session.meeting_link || "");
                          }}
                          className="font-mono text-[9px] tracking-[0.05em] uppercase py-1.5 px-3 bg-wd-overlay/[0.05] text-wd-text border border-wd-border rounded-md hover:bg-wd-overlay/[0.08] transition-colors"
                        >
                          {session.meeting_link
                            ? "Edit Link"
                            : "Add Meeting Link"}
                        </button>
                        <button
                          onClick={() => handleComplete(session.id)}
                          className="font-mono text-[9px] tracking-[0.05em] uppercase py-1.5 px-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md hover:bg-emerald-500/20 transition-colors"
                        >
                          Mark Completed
                        </button>
                      </>
                    )}

                    {session.meeting_link && editingLink !== session.id && (
                      <a
                        href={session.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[9px] text-wd-gold hover:text-wd-text transition-colors"
                      >
                        Join →
                      </a>
                    )}
                  </div>
                )}

                {/* Notes for past */}
                {tab === "past" && session.notes && (
                  <p className="font-sans text-xs text-wd-sub mt-2 italic">
                    &ldquo;{session.notes}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
