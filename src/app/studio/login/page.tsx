"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/lib/auth/actions";
import { enterStudioDemo } from "@/lib/auth/demo-actions";

export default function StudioLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-wd-bg flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link
        href="/studio"
        className="mb-10 font-mono text-xs font-bold tracking-[0.2em] uppercase text-wd-text flex items-center gap-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt=""
          className="h-[90px] w-auto -my-4 dark:invert max-[480px]:h-[60px] max-[480px]:-my-2"
        />
        War Desk <span className="text-wd-gold">Studio</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-[400px] bg-wd-card border border-wd-border rounded-2xl shadow-wd-card overflow-hidden">
        <div className="p-8 max-[480px]:p-5">
          <h1 className="font-serif text-2xl text-wd-text mb-1">
            Client Portal
          </h1>
          <p className="font-sans text-sm text-wd-sub mb-8">
            Access your projects, assets, and calendar
          </p>

          <form action={handleSubmit} className="space-y-4">
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
              {loading ? "..." : "Sign in"}
            </button>
          </form>

          {/* Demo Access */}
          <div className="mt-5 pt-5 border-t border-wd-border text-center">
            {!showDemo ? (
              <button
                onClick={() => setShowDemo(true)}
                className="font-mono text-[10px] tracking-[0.05em] text-wd-muted hover:text-wd-sub transition-colors bg-transparent border-none"
              >
                Demo access &rarr;
              </button>
            ) : (
              <form
                action={async (formData) => {
                  setDemoLoading(true);
                  setDemoError(null);
                  const result = await enterStudioDemo(formData);
                  if (result?.error) {
                    setDemoError(result.error);
                  }
                  setDemoLoading(false);
                }}
              >
                <div className="flex gap-2">
                  <input
                    name="code"
                    type="text"
                    required
                    autoFocus
                    className="flex-1 bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-mono text-base md:text-[11px] tracking-[0.05em] uppercase px-4 py-2.5 focus:border-wd-gold/50 outline-none transition-colors placeholder:normal-case placeholder:tracking-normal"
                    placeholder="Enter demo code"
                  />
                  <button
                    type="submit"
                    disabled={demoLoading}
                    className="font-mono text-[10px] tracking-[0.1em] uppercase px-5 py-2.5 bg-wd-overlay/[0.06] text-wd-sub border border-wd-border rounded-lg hover:bg-wd-overlay/[0.12] hover:text-wd-text transition-all disabled:opacity-50"
                  >
                    {demoLoading ? "..." : "Enter"}
                  </button>
                </div>
                {demoError && (
                  <p className="font-sans text-sm text-red-400 mt-2">
                    {demoError}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
