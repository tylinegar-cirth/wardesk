"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { DbAdvisor, DbAvailability } from "@/lib/types/database";

const durations = [
  { minutes: 30 as const, label: "30 min" },
  { minutes: 60 as const, label: "60 min" },
  { minutes: 90 as const, label: "90 min" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
];

type Step = "profile" | "booking";

export default function AdvisorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [advisor, setAdvisor] = useState<DbAdvisor | null>(null);
  const [availability, setAvailability] = useState<DbAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("profile");

  // Booking state
  const [selectedDuration, setSelectedDuration] = useState<30 | 60 | 90>(60);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Track whether we've pre-populated from URL params
  const prePopulated = useRef(false);

  // Check for pre-populated booking params from URL (marketing site handoff)
  const paramDur = searchParams.get("dur");
  const paramDate = searchParams.get("date");
  const paramTime = searchParams.get("time");
  const hasBookingParams = !!(paramDur || paramDate || paramTime);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: adv }, { data: avail }] = await Promise.all([
        supabase.from("advisors").select("*").eq("id", id).single(),
        supabase.from("availability").select("*").eq("advisor_id", id),
      ]);
      setAdvisor(adv);
      setAvailability(avail || []);
      setLoading(false);
    }
    load();
  }, [id]);

  // Pre-populate booking form from URL params (runs once after data loads)
  useEffect(() => {
    if (prePopulated.current || loading) return;
    if (!hasBookingParams) return;

    prePopulated.current = true;

    // Set duration
    if (paramDur) {
      const dur = parseInt(paramDur);
      if (dur === 30 || dur === 60 || dur === 90) {
        setSelectedDuration(dur);
      }
    }

    // Set date — find matching date in the next 14 days
    if (paramDate) {
      setSelectedDate(paramDate);
    }

    // Set time — convert from marketing format if needed (e.g., "09:00")
    if (paramTime) {
      // Ensure format is "HH:MM"
      const time = paramTime.includes(":") ? paramTime : `${paramTime.slice(0, 2)}:${paramTime.slice(2)}`;
      setSelectedTime(time);
    }

    // Skip directly to booking step since we have pre-populated data
    setStep("booking");
  }, [loading, hasBookingParams, paramDur, paramDate, paramTime]);

  // Generate next 14 days for calendar
  const calendarDays = useCallback(() => {
    const days: { date: string; dayOfWeek: number; label: string }[] = [];
    const availableDays = new Set(availability.map((a) => a.day_of_week));
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dow = d.getDay();
      if (availableDays.size === 0 || availableDays.has(dow)) {
        days.push({
          date: d.toISOString().split("T")[0],
          dayOfWeek: dow,
          label: d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
        });
      }
    }
    return days;
  }, [availability]);

  const price = advisor
    ? Math.round((advisor.rate / 60) * selectedDuration)
    : 0;

  async function handleBook() {
    if (!advisor || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    setBookingError(null);

    const scheduledAt = new Date(
      `${selectedDate}T${selectedTime}:00`
    ).toISOString();

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          advisorId: advisor.id,
          advisorName: advisor.name,
          scheduledAt,
          durationMinutes: selectedDuration,
          price: price * 100, // cents
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setBookingError(data.error || "Failed to create checkout session");
        setSubmitting(false);
      }
    } catch {
      setBookingError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-wd-card rounded" />
          <div className="h-64 bg-wd-card rounded-[14px]" />
        </div>
      </div>
    );
  }

  if (!advisor) {
    return (
      <div className="p-6 md:p-10 text-center">
        <p className="font-sans text-sm text-wd-sub">Advisor not found.</p>
        <Link
          href="/portal/advisors"
          className="font-mono text-[10px] text-wd-gold mt-3 inline-block"
        >
          &larr; Back to advisors
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <Link
        href="/portal/advisors"
        className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-gold transition-colors mb-6 inline-block"
      >
        &larr; All advisors
      </Link>

      {/* Pre-populated booking notice */}
      {hasBookingParams && step === "booking" && (
        <div className="mb-6 p-3 bg-wd-gold-glow border border-wd-gold/20 rounded-lg">
          <p className="font-sans text-sm text-wd-gold">
            Your booking details have been pre-loaded. Review and confirm below.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8">
        {/* Left: Profile */}
        <div>
          <div className="flex items-start gap-5 mb-6">
            {advisor.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={advisor.image_url}
                alt=""
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="font-serif text-2xl text-wd-text mb-1">
                {advisor.name}
              </h1>
              <p className="font-sans text-sm text-wd-sub mb-2">
                {advisor.title}
              </p>
              {advisor.stars > 0 && (
                <div className="flex gap-0.5">
                  {Array.from({ length: advisor.stars }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-wd-gold" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 1l2.39 4.84L18 6.71l-4 3.9.94 5.5L10 13.68 5.06 16.1 6 10.6l-4-3.9 5.61-.87L10 1z" />
                    </svg>
                  ))}
                </div>
              )}
            </div>
          </div>

          {advisor.bio && (
            <p className="font-sans text-sm text-wd-sub leading-relaxed mb-6">
              {advisor.bio}
            </p>
          )}

          {/* Stats */}
          <div className={`grid gap-4 mb-6 ${advisor.years_service > 0 ? "grid-cols-3" : "grid-cols-2"}`}>
            {advisor.years_service > 0 && (
              <div className="bg-wd-card border border-wd-border rounded-lg p-4 text-center">
                <p className="font-serif text-xl text-wd-text">
                  {advisor.years_service}
                </p>
                <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                  Years
                </p>
              </div>
            )}
            <div className="bg-wd-card border border-wd-border rounded-lg p-4 text-center">
              <p className="font-serif text-xl text-wd-text">
                {advisor.clearance}
              </p>
              <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                Clearance
              </p>
            </div>
            <div className="bg-wd-card border border-wd-border rounded-lg p-4 text-center">
              <p className="font-serif text-xl text-wd-gold">
                ${advisor.rate.toLocaleString()}
              </p>
              <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                Per hour
              </p>
            </div>
          </div>

          {/* Focus areas */}
          <div className="mb-6">
            <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-sub mb-3">
              Focus areas
            </p>
            <div className="flex flex-wrap gap-2">
              {advisor.focus.map((f) => (
                <span
                  key={f}
                  className="font-mono text-[9px] tracking-[0.05em] uppercase text-wd-sub bg-white/[0.04] border border-wd-border px-3 py-1.5 rounded-full"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking panel */}
        <div className="bg-wd-card border border-wd-border rounded-[14px] p-6 h-fit sticky top-6">
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-5">
              Book a session
            </p>

              {/* Duration */}
              <div className="mb-5">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-3">
                  Duration
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {durations.map((d) => (
                    <button
                      key={d.minutes}
                      onClick={() => setSelectedDuration(d.minutes)}
                      className={`font-mono text-[10px] tracking-[0.05em] py-2.5 rounded-lg border transition-all ${
                        selectedDuration === d.minutes
                          ? "bg-wd-gold-glow text-wd-gold border-wd-gold/30"
                          : "bg-transparent text-wd-muted border-wd-border hover:border-wd-sub/30"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div className="mb-5">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-3">
                  Date
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {calendarDays().map((day) => (
                    <button
                      key={day.date}
                      onClick={() => {
                        setSelectedDate(day.date);
                        setSelectedTime("");
                      }}
                      className={`w-full text-left font-mono text-[10px] px-3 py-2 rounded-lg border transition-all ${
                        selectedDate === day.date
                          ? "bg-wd-gold-glow text-wd-gold border-wd-gold/30"
                          : "bg-transparent text-wd-sub border-wd-border hover:border-wd-sub/30"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div className="mb-5">
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-3">
                    Time
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`font-mono text-[10px] py-2 rounded-lg border transition-all ${
                          selectedTime === t
                            ? "bg-wd-gold-glow text-wd-gold border-wd-gold/30"
                            : "bg-transparent text-wd-sub border-wd-border hover:border-wd-sub/30"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price + book */}
              {selectedDate && selectedTime && (
                <div className="border-t border-wd-border pt-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-sans text-sm text-wd-sub">
                      {selectedDuration} min session
                    </span>
                    <span className="font-serif text-xl text-wd-gold">
                      ${price.toLocaleString()}
                    </span>
                  </div>

                  {bookingError && (
                    <p className="font-sans text-sm text-red-400 mb-3">
                      {bookingError}
                    </p>
                  )}

                  <button
                    onClick={handleBook}
                    disabled={submitting}
                    className="w-full font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50"
                  >
                    {submitting ? "Redirecting to payment..." : "Proceed to payment"}
                  </button>
                </div>
              )}
        </div>
      </div>
    </div>
  );
}
