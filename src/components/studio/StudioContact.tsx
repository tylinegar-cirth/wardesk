"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

export default function StudioContact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputClass =
    "w-full bg-wd-overlay/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors placeholder:text-wd-sub";

  return (
    <section
      id="contact"
      className="py-[clamp(56px,9vw,110px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto"
    >
      <Reveal>
        <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          Get Started
        </div>
        <h2 className="font-serif text-[clamp(28px,3.8vw,42px)] font-normal text-wd-text leading-[1.1] mb-3">
          Let&apos;s Build Something
        </h2>
        <p className="font-sans text-[clamp(14px,1.4vw,16px)] font-light text-wd-sub leading-[1.65] max-w-[560px] mb-10">
          Preparing for a conference? Launching a campaign? Need a film that
          actually lands? Tell us what you&apos;re working on.
        </p>
      </Reveal>

      <Reveal delay={0.07}>
        <div className="bg-wd-card border border-wd-border rounded-[14px] p-8 max-w-[600px]">
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
                className="w-full font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          )}
          {!submitted && (
            <p className="font-sans text-xs text-wd-muted mt-4 text-center">
              Or email us directly at{" "}
              <a
                href="mailto:hello@wardeskstudio.com"
                className="text-wd-gold hover:text-wd-text transition-colors"
              >
                hello@wardeskstudio.com
              </a>
            </p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
