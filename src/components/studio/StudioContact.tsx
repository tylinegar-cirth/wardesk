"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import CornerBrackets from "@/components/ui/CornerBrackets";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function StudioContact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deckEmail, setDeckEmail] = useState("");
  const [deckUnlocked, setDeckUnlocked] = useState(false);
  const [deckSubmitting, setDeckSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Run Supabase insert + Formsubmit email notification in parallel.
    // Neither throws — both settle so the user always sees a success state.
    await Promise.allSettled([
      supabase.from("contact_submissions").insert({
        name: form.name,
        email: form.email,
        message: `[${form.company}] ${form.message}`,
        source: "studio_contact",
      }),
      fetch("https://formsubmit.co/ajax/ty@thewardesk.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `New Studio contact: ${form.name}${form.company ? ` (${form.company})` : ""}`,
          _template: "table",
          _captcha: "false",
          _replyto: form.email,
          Name: form.name,
          Email: form.email,
          Company: form.company || "—",
          Message: form.message,
          Source: "War Desk Studio — Contact form",
        }),
      }),
    ]);
    setSubmitting(false);
    setSubmitted(true);
  }

  async function handleDeckSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!deckEmail.trim()) return;
    setDeckSubmitting(true);
    await Promise.allSettled([
      supabase.from("deck_downloads").insert({
        email: deckEmail.trim(),
      }),
      fetch("https://formsubmit.co/ajax/ty@thewardesk.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `Studio Deck download: ${deckEmail.trim()}`,
          _template: "table",
          _captcha: "false",
          _replyto: deckEmail.trim(),
          Email: deckEmail.trim(),
          Source: "War Desk Studio — Deck download",
        }),
      }),
    ]);
    setDeckSubmitting(false);
    setDeckUnlocked(true);
  }

  const inputClass =
    "w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors placeholder:text-wd-sub";

  return (
    <section
      id="contact"
      className="relative py-[clamp(56px,9vw,110px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto overflow-hidden"
    >
      <CornerBrackets size={24} inset={12} color="rgba(212,168,67,0.5)" strokeWidth={1} />

      {/* Big atmospheric logo, top-right — bleeds slightly off the edge */}
      <div
        className="absolute pointer-events-none hidden md:block z-[0]"
        style={{
          top: "clamp(-40px, -3vw, -20px)",
          right: "clamp(-60px, -4vw, -30px)",
          width: "clamp(280px, 32vw, 460px)",
          height: "clamp(280px, 32vw, 460px)",
        }}
        aria-hidden="true"
      >
        {/* Soft gold radial glow behind the mark */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(212,168,67,0.14) 0%, rgba(212,168,67,0.04) 45%, transparent 70%)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-gold.png"
          alt=""
          className="relative w-full h-full object-contain opacity-[0.18]"
          style={{ filter: "drop-shadow(0 0 32px rgba(212,168,67,0.25))" }}
        />
      </div>

      <Reveal>
        <div className="relative mb-10 flex items-start justify-between gap-8 z-[1]">
          <div className="flex-1 max-w-[680px]">
            <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-4">
              Get Started
            </div>
            <h2 className="font-serif text-[clamp(32px,5vw,56px)] font-normal text-wd-text leading-[1.02] tracking-[-0.01em] mb-3">
              Let&apos;s build something{" "}
              <span className="italic text-wd-gold/90">legendary</span>.
            </h2>
            <p className="font-sans text-[clamp(14px,1.4vw,16px)] font-light text-wd-sub leading-[1.65] max-w-[560px]">
              Preparing for a conference? Launching a campaign? Need a film that
              actually lands? Tell us what you&apos;re working on.
            </p>
          </div>
          <div className="hidden md:block pt-1 text-right relative z-[2]">
            <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-wd-muted leading-[1.8]">
              Section // 05
              <br />
              <span className="text-wd-gold/80">Transmit</span>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Contact form */}
        <Reveal delay={0.07}>
          <div className="bg-wd-card border border-wd-border rounded-[14px] p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-wd-text mb-2">
                  Message sent
                </h3>
                <p className="font-sans text-sm text-wd-sub">
                  We&apos;ll be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1.5 block">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1.5 block">
                    Company
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1.5 block">
                    Message
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className={`${inputClass} resize-none h-28`}
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
            {!submitted && (
              <p className="font-sans text-xs text-wd-muted mt-4 text-center">
                Or email us directly at{" "}
                <a
                  href="mailto:ty@thewardesk.com"
                  className="text-wd-gold hover:text-wd-text transition-colors"
                >
                  ty@thewardesk.com
                </a>
              </p>
            )}
          </div>
        </Reveal>

        {/* Deck download gate */}
        <Reveal delay={0.14}>
          <div className="bg-wd-card border border-wd-border rounded-[14px] p-8">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-xl bg-wd-gold-glow flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-wd-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-wd-text mb-2">
                Studio Deck
              </h3>
              <p className="font-sans text-sm text-wd-sub leading-relaxed">
                Our capabilities and approach. Enter your email to download.
              </p>
            </div>

            {deckUnlocked ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <a
                  href="/wardesk-studio-deck.pdf"
                  download
                  className="inline-block font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-8 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98]"
                >
                  Download PDF
                </a>
              </div>
            ) : (
              <form onSubmit={handleDeckSubmit} className="space-y-4">
                <div>
                  <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1.5 block">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={deckEmail}
                    onChange={(e) => setDeckEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@company.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={deckSubmitting}
                  className="w-full font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 bg-wd-overlay/[0.06] text-wd-text border border-wd-border font-bold rounded-lg transition-all duration-300 hover:bg-wd-overlay/[0.12] hover:border-wd-border-hov hover:-translate-y-px disabled:opacity-50 disabled:pointer-events-none"
                >
                  {deckSubmitting ? "Submitting..." : "Get the Deck"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
