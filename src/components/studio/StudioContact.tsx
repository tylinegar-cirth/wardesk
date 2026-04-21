"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
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
    "w-full bg-transparent border border-wd-border text-wd-text font-mono text-[14px] tracking-[0.04em] py-3 px-4 focus:border-wd-gold focus:outline-none transition-colors placeholder:text-wd-muted/50";
  const textareaClass =
    "w-full bg-transparent border border-wd-border text-wd-text font-mono text-[14px] tracking-[0.04em] p-4 focus:border-wd-gold focus:outline-none transition-colors h-32 placeholder:text-wd-muted/50 resize-none";
  const labelClass =
    "font-mono text-[10px] tracking-[0.3em] uppercase text-wd-gold/80 mb-2 block";

  return (
    <section
      id="contact"
      className="relative py-[clamp(72px,10vw,120px)] px-[clamp(16px,4vw,72px)] overflow-hidden border-t border-wd-gold/25"
    >
      <div className="relative max-w-[1600px] mx-auto">
        <Reveal>
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-wd-gold mb-4">
              06 / Contact
            </div>
            <h2 className="font-display text-[clamp(36px,5.5vw,76px)] uppercase leading-[0.95] tracking-[-0.025em] text-wd-text max-w-[1100px]">
              Let&apos;s build something{" "}
              <span className="text-wd-gold">legendary</span>.
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Project form */}
          <Reveal delay={0.05}>
            <div className="border border-wd-border bg-wd-surface/20 backdrop-blur-sm">
              <div className="px-6 md:px-8 py-4 border-b border-wd-border">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-gold/80">
                  Project
                </span>
              </div>

              <div className="p-6 md:p-8">
                {submitted ? (
                  <div className="py-8">
                    <h3 className="font-display text-[clamp(26px,3.5vw,40px)] uppercase tracking-[-0.02em] text-wd-text leading-[0.95] mb-3">
                      Message sent.
                    </h3>
                    <p className="font-sans text-[14px] text-wd-sub leading-[1.6]">
                      We&apos;ll be in touch within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      className="w-full font-mono text-[11px] tracking-[0.2em] uppercase py-4 bg-wd-gold text-wd-ink border-none font-bold transition-all duration-300 hover:bg-wd-text disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center gap-3"
                    >
                      {submitting ? "Sending..." : "Send Message →"}
                    </button>
                  </form>
                )}
                {!submitted && (
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-wd-muted mt-5">
                    Or direct:{" "}
                    <a
                      href="mailto:ty@thewardesk.com"
                      className="text-wd-gold hover:text-wd-text transition-colors"
                    >
                      ty@thewardesk.com
                    </a>
                  </p>
                )}
              </div>
            </div>
          </Reveal>

          {/* Deck download */}
          <Reveal delay={0.1}>
            <div className="border border-wd-gold/40 bg-wd-gold/[0.04] backdrop-blur-sm h-full flex flex-col">
              <div className="px-6 md:px-8 py-4 border-b border-wd-gold/40">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-gold">
                  Studio Deck
                </span>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="mb-8 pb-6 border-b border-wd-gold/25 flex-1">
                  <h3 className="font-display text-[clamp(24px,3vw,36px)] uppercase tracking-[-0.02em] text-wd-text leading-[0.95] mb-3">
                    Capabilities
                    <br />
                    and approach.
                  </h3>
                  <p className="font-serif italic text-[clamp(16px,1.8vw,22px)] text-wd-gold/90 leading-[1.3] mb-6">
                    Enter your email to download the deck.
                  </p>

                  {/* What's inside — editorial TOC */}
                  <div className="mt-6 border-t border-wd-gold/15 pt-5">
                    <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-gold/70 mb-4">
                      Inside
                    </div>
                    <ul className="space-y-2">
                      {[
                        "The Manifesto",
                        "Capabilities & Approach",
                        "Selected Work",
                        "Process & Engagements",
                        "Pricing",
                        "The Team",
                      ].map((item, i) => (
                        <li
                          key={item}
                          className="flex items-baseline gap-4 font-mono text-[11px] tracking-[0.08em] uppercase text-wd-text/90"
                        >
                          <span className="text-wd-gold/60 w-6 flex-shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1">{item}</span>
                          <span
                            aria-hidden="true"
                            className="h-px flex-1 bg-wd-gold/15 mb-1"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {deckUnlocked ? (
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-wd-sub mb-5">
                      Email confirmed.
                    </p>
                    <a
                      href="/wardesk-studio-deck.pdf"
                      download
                      className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase py-4 px-8 bg-wd-gold text-wd-ink border-none font-bold transition-all duration-300 hover:bg-wd-text"
                    >
                      Download PDF
                      <span className="text-[14px] group-hover:translate-x-1 transition-transform">↓</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleDeckSubmit} className="space-y-5">
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
                      className="group font-mono text-[11px] tracking-[0.2em] uppercase py-4 px-8 bg-transparent text-wd-gold border border-wd-gold font-bold transition-all duration-300 hover:bg-wd-gold hover:text-wd-ink disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-3"
                    >
                      {deckSubmitting ? "Submitting..." : "Get the Deck →"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
