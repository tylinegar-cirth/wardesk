"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login, sendMagicLink } from "@/lib/auth/actions";

const tabs = [
  { key: "client", label: "Client" },
  { key: "advisor", label: "Advisor" },
] as const;

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [magicLinkMode, setMagicLinkMode] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"client" | "advisor">("client");
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

    if (magicLinkMode) {
      const result = await sendMagicLink(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setMagicLinkSent(true);
      }
    } else {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      }
    }
    setLoading(false);
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
      <div className="w-full max-w-[400px] bg-wd-card border border-wd-border rounded-2xl shadow-wd-card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-wd-border">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setError(null);
                setMagicLinkSent(false);
              }}
              className={`flex-1 py-3.5 font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-300 border-b-2 bg-transparent ${
                activeTab === tab.key
                  ? "text-wd-gold border-wd-gold bg-wd-gold-glow"
                  : "text-wd-muted border-transparent hover:text-wd-sub"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {hasBooking && (
            <div className="mb-6 p-3 bg-wd-gold-glow border border-wd-gold/20 rounded-lg">
              <p className="font-sans text-sm text-wd-gold">
                Sign in to confirm your booking with {bookingAdvisor}
              </p>
            </div>
          )}
          <h1 className="font-serif text-2xl text-wd-text mb-1">Sign in</h1>
          <p className="font-sans text-sm text-wd-sub mb-8">
            {activeTab === "client"
              ? "Access your advisory dashboard"
              : "Manage your schedule & sessions"}
          </p>

          {magicLinkSent ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-wd-gold-glow mx-auto mb-5 flex items-center justify-center text-2xl text-wd-gold">
                ✓
              </div>
              <p className="font-serif text-xl text-wd-text mb-2">
                Check your email
              </p>
              <p className="font-sans text-sm text-wd-sub">
                We sent a sign-in link to your email address.
              </p>
            </div>
          ) : (
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

              {!magicLinkMode && (
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {error && (
                <p className="font-sans text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0"
              >
                {loading
                  ? "..."
                  : magicLinkMode
                  ? "Send magic link"
                  : "Sign in"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMagicLinkMode(!magicLinkMode);
                  setError(null);
                }}
                className="w-full font-mono text-[10px] tracking-[0.05em] text-wd-muted hover:text-wd-sub transition-colors bg-transparent border-none pt-2"
              >
                {magicLinkMode
                  ? "Use password instead"
                  : "Sign in with magic link"}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-wd-border text-center">
            <p className="font-sans text-sm text-wd-muted">
              No account?{" "}
              <Link
                href={hasBooking ? `/auth/signup?booking_advisor=${encodeURIComponent(bookingAdvisor || "")}&booking_dur=${bookingDur || ""}&booking_date=${bookingDate || ""}&booking_time=${encodeURIComponent(bookingTime || "")}` : "/auth/signup"}
                className="text-wd-gold hover:text-wd-text transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
