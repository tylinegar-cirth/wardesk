"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "@/lib/auth/actions";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await signup(formData);
    if (result?.error) {
      setError(result.error);
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
          src="https://res.cloudinary.com/dmj9mlo6o/image/upload/v1772585999/Gemini_Generated_Image_t0cq9dt0cq9dt0cq_h7woad.png"
          alt=""
          className="h-7 w-auto"
          style={{ mixBlendMode: "screen" }}
        />
        War Desk
      </Link>

      {/* Card */}
      <div className="w-full max-w-[400px] bg-wd-card border border-wd-border rounded-2xl p-8 shadow-[0_8px_48px_rgba(0,0,0,0.4)]">
        <h1 className="font-serif text-2xl text-wd-text mb-1">
          Create account
        </h1>
        <p className="font-sans text-sm text-wd-sub mb-8">
          Get access to defense&apos;s most senior advisors
        </p>

        <form action={handleSubmit} className="space-y-4">
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

          <div>
            <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted block mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
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
              className="w-full bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
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
              href="/auth/login"
              className="text-wd-gold hover:text-wd-text transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
