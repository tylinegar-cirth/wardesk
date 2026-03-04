"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signup } from "@/lib/auth/actions";

function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const searchParams = useSearchParams();

  // Booking params passed from marketing site
  const bookingAdvisor = searchParams.get("booking_advisor");
  const bookingDur = searchParams.get("booking_dur");
  const bookingDate = searchParams.get("booking_date");
  const bookingTime = searchParams.get("booking_time");
  const hasBooking = !!bookingAdvisor;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSubmittedEmail(formData.get("email") as string);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setEmailSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-wd-bg flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link
        href="/"
        className="mb-10 font-mono text-xs font-bold tracking-[0.3em] uppercase text-wd-text flex items-center gap-2.5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt=""
          className="h-7 w-auto dark:invert"
        />
        War Desk
      </Link>

      {/* Card */}
      <div className="w-full max-w-[400px] bg-wd-card border border-wd-border rounded-2xl p-8 shadow-wd-card">
        {emailSent ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-wd-gold-glow mx-auto mb-6 flex items-center justify-center">
              <svg className="w-8 h-8 text-wd-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="font-serif text-2xl text-wd-text mb-2">
              Check your email
            </h1>
            <p className="font-sans text-sm text-wd-sub mb-2">
              We sent a verification link to
            </p>
            <p className="font-mono text-sm text-wd-gold mb-6">
              {submittedEmail}
            </p>
            <p className="font-sans text-sm text-wd-muted leading-relaxed">
              Click the link in the email to verify your account, then you&apos;ll be signed in automatically.
            </p>
            <div className="mt-8 pt-6 border-t border-wd-border">
              <p className="font-sans text-xs text-wd-muted">
                Didn&apos;t get it? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setSubmittedEmail("");
                  }}
                  className="text-wd-gold hover:text-wd-text transition-colors bg-transparent border-none cursor-pointer"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        ) : (
          <>
            {hasBooking && (
              <div className="mb-6 p-3 bg-wd-gold-glow border border-wd-gold/20 rounded-lg">
                <p className="font-sans text-sm text-wd-gold">
                  Create an account to confirm your booking with {bookingAdvisor}
                </p>
              </div>
            )}
            <h1 className="font-serif text-2xl text-wd-text mb-1">
              Create account
            </h1>
            <p className="font-sans text-sm text-wd-sub mb-8">
              Get access to defense&apos;s most senior advisors
            </p>

            <form action={handleSubmit} className="space-y-4">
              {/* Preserve booking params through auth flow */}
              {hasBooking && (
                <>
                  <input type="hidden" name="booking_advisor" value={bookingAdvisor || ""} />
                  <input type="hidden" name="booking_dur" value={bookingDur || ""} />
                  <input type="hidden" name="booking_date" value={bookingDate || ""} />
                  <input type="hidden" name="booking_time" value={bookingTime || ""} />
                </>
              )}
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

              <div>
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="font-sans text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-wd-border text-center">
              <p className="font-sans text-sm text-wd-muted">
                Already have an account?{" "}
                <Link
                  href={hasBooking ? `/auth/login?booking_advisor=${encodeURIComponent(bookingAdvisor || "")}&booking_dur=${bookingDur || ""}&booking_date=${bookingDate || ""}&booking_time=${encodeURIComponent(bookingTime || "")}` : "/auth/login"}
                  className="text-wd-gold hover:text-wd-text transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
