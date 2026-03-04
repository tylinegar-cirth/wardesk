"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<{
    advisorName: string;
    date: string;
    time: string;
    duration: string;
    price: string;
  } | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    // Fetch session details from our API
    async function fetchDetails() {
      try {
        const res = await fetch(
          `/api/checkout/session?session_id=${sessionId}`
        );
        if (res.ok) {
          const data = await res.json();
          setBookingDetails(data);
        }
      } catch {
        // If fetch fails, still show generic success
      }
      setLoading(false);
    }

    fetchDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-lg mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-14 w-14 bg-wd-card rounded-full mx-auto" />
          <div className="h-6 w-48 bg-wd-card rounded mx-auto" />
          <div className="h-4 w-64 bg-wd-card rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-lg mx-auto">
      <div className="bg-wd-card border border-wd-border rounded-[14px] p-8 text-center">
        {/* Checkmark */}
        <div className="w-14 h-14 rounded-full bg-wd-gold-glow mx-auto mb-5 flex items-center justify-center text-2xl text-wd-gold">
          &#10003;
        </div>

        <p className="font-serif text-2xl text-wd-text mb-2">
          Booking confirmed
        </p>
        <p className="font-sans text-sm text-wd-sub mb-6">
          Payment received — your session has been scheduled.
        </p>

        {/* Booking details */}
        {bookingDetails && (
          <div className="bg-wd-overlay/[0.03] border border-wd-border rounded-lg p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                Advisor
              </span>
              <span className="font-sans text-sm text-wd-text">
                {bookingDetails.advisorName}
              </span>
            </div>
            <div className="border-t border-wd-border" />
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                Date
              </span>
              <span className="font-sans text-sm text-wd-text">
                {bookingDetails.date}
              </span>
            </div>
            <div className="border-t border-wd-border" />
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                Time
              </span>
              <span className="font-sans text-sm text-wd-text">
                {bookingDetails.time}
              </span>
            </div>
            <div className="border-t border-wd-border" />
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                Duration
              </span>
              <span className="font-sans text-sm text-wd-text">
                {bookingDetails.duration}
              </span>
            </div>
            <div className="border-t border-wd-border" />
            <div className="flex justify-between items-center">
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                Amount paid
              </span>
              <span className="font-serif text-lg text-wd-gold">
                {bookingDetails.price}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/portal/sessions")}
            className="w-full font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98]"
          >
            View sessions
          </button>
          <Link
            href="/portal/advisors"
            className="block w-full font-mono text-[10px] tracking-[0.05em] text-wd-muted hover:text-wd-sub transition-colors text-center pt-2"
          >
            Book another session
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense>
      <BookingSuccessContent />
    </Suspense>
  );
}
