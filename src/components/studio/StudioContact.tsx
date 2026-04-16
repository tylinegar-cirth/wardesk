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
    "w-full bg-transparent border-0 border-b border-wd-border text-wd-text font-sans text-[16px] py-3 px-0 focus:border-wd-gold/60 focus:outline-none transition-colors placeholder:text-wd-muted/50";

  const textareaClass =
    "w-full bg-transparent border border-wd-border rounded-md text-wd-text font-sans text-[16px] p-4 focus:border-wd-gold/60 focus:outline-none transition-colors h-32 placeholder:text-wd-muted/50 resize-none";

  const labelClass =
    "font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold/70 mb-3 block";

  return (
    <section
      id="contact"
      className="relative py-[clamp(56px,9vw,110px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto overflow-hidden"
    >
      <CornerBrackets size={24} inset={12} color="rgba(212,168,67,0.5)" strokeWidth={1} />

      {/* Big atmospheric logo, top-right — fully inside the section, sits below the SECTION label */}
      <div
        className="absolute pointer-events-none hidden md:block z-[0]"
        style={{
          top: "clamp(48px, 5vw, 88px)",
          right: "clamp(20px, 2.5vw, 48px)",
          width: "clamp(260px, 28vw, 420px)",
          height: "clamp(260px, 28vw, 420px)",
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

      {/* Two-column form layout — no cards, vertical divider between */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start z-[1]">
        {/* Vertical divider on desktop */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-wd-border" />

        {/* Project column */}
        <Reveal delay={0.07}>
          <div className="md:pr-10">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-wd-gold/80 mb-9">
              {"// Project"}
            </div>

            {submitted ? (
              <div className="py-8">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 mb-5 flex items-center justify-center">
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
                <h3 className="font-serif text-[clamp(24px,2.6vw,32px)] font-normal text-wd-text leading-[1.15] mb-2">
                  Message sent.
                </h3>
                <p className="font-sans text-[14px] text-wd-sub leading-[1.6]">
                  We&apos;ll be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label className={labelClass}>Name</label>
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
                  <label className={labelClass}>Email</label>
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
                  <label className={labelClass}>Company</label>
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
                  <label className={labelClass}>Message</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className={textareaClass}
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-mono text-[11px] tracking-[0.15em] uppercase py-4 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
            {!submitted && (
              <p className="font-sans text-[12px] text-wd-muted mt-6">
                Or email directly:{" "}
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

        {/* Studio Deck column */}
        <Reveal delay={0.14}>
          <div className="md:pl-10">
            <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-wd-gold/80 mb-9">
              {"// Studio Deck"}
            </div>

            <h3 className="font-serif text-[clamp(22px,2.4vw,30px)] font-normal text-wd-text leading-[1.15] mb-3 max-w-[420px]">
              Capabilities and approach.
            </h3>
            <p className="font-sans text-[14px] text-wd-sub leading-[1.65] mb-9 max-w-[420px]">
              Enter your email to download the deck.
            </p>

            {deckUnlocked ? (
              <div className="py-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <span className="font-sans text-[14px] text-wd-sub">
                    Email confirmed.
                  </span>
                </div>
                <a
                  href="/wardesk-studio-deck.pdf"
                  download
                  className="inline-block font-mono text-[11px] tracking-[0.15em] uppercase py-4 px-9 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98]"
                >
                  Download PDF →
                </a>
              </div>
            ) : (
              <form onSubmit={handleDeckSubmit} className="space-y-7">
                <div>
                  <label className={labelClass}>Work Email</label>
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
                  className="font-mono text-[11px] tracking-[0.15em] uppercase py-4 px-9 bg-transparent text-wd-text border border-wd-gold/60 font-bold rounded-lg transition-all duration-300 hover:bg-wd-gold/10 hover:border-wd-gold hover:-translate-y-px disabled:opacity-50 disabled:pointer-events-none mt-2"
                >
                  {deckSubmitting ? "Submitting..." : "Get the Deck →"}
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
