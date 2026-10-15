"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import ShockStations from "@/components/transonic/ShockStations";
import BoomUnderline from "@/components/transonic/BoomUnderline";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Contact is a person and a direct line (Furlined, Friend London, Filmograph), set on
// the page's one bone field. The note and deck forms stay, without boxes.

function LocalTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Los_Angeles",
        timeZoneName: "short",
      }).format(new Date());
    setT(fmt());
    const i = window.setInterval(() => setT(fmt()), 30000);
    return () => window.clearInterval(i);
  }, []);
  return <span suppressHydrationWarning>{t || " "}</span>;
}

export default function StudioContact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deckEmail, setDeckEmail] = useState("");
  const [deckRequested, setDeckRequested] = useState(false);
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
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New Studio contact: ${form.name}${form.company ? ` (${form.company})` : ""}`,
          _template: "table",
          _captcha: "false",
          _replyto: form.email,
          Name: form.name,
          Email: form.email,
          Company: form.company || "n/a",
          Message: form.message,
          Source: "War Desk Studio contact form",
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
      supabase.from("deck_downloads").insert({ email: deckEmail.trim() }),
      fetch("https://formsubmit.co/ajax/ty@thewardesk.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Studio Deck request: ${deckEmail.trim()}`,
          _template: "table",
          _captcha: "false",
          _replyto: deckEmail.trim(),
          Email: deckEmail.trim(),
          Source: "War Desk Studio deck request",
        }),
      }),
    ]);
    setDeckSubmitting(false);
    setDeckRequested(true);
  }

  const field =
    "w-full bg-transparent border-0 border-b border-wd-ink/25 focus:border-wd-ink text-wd-ink font-sans text-[17px] py-2.5 outline-none transition-colors placeholder:text-wd-ink/30 rounded-none";
  const label = "block font-sans text-[13px] text-wd-ink/60";

  return (
    <section
      id="contact"
      data-transonic-band
      aria-label="Contact"
      className="relative bg-wd-bone text-wd-ink px-[clamp(20px,5vw,72px)] pt-[clamp(80px,11vw,160px)] pb-[clamp(72px,9vw,128px)] scroll-mt-16"
    >
      <div className="relative max-w-[1400px] mx-auto">
        <ShockStations trigger="view" field="title" ground="light" firstMs={120} params={{ rest: 0.012, seams: 3, gusts: 0.45 }}>
          <h2 className="font-display uppercase leading-[0.9] tracking-[-0.035em] text-[clamp(44px,7vw,120px)] max-w-[1100px]">
            <span data-word="payoff">Tell us what you&rsquo;re building.</span>
          </h2>
        </ShockStations>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-x-20 gap-y-16 mt-[clamp(48px,7vw,96px)]">
          {/* The person */}
          <div>
            <div className="font-sans text-[11px] uppercase tracking-[0.16em] text-wd-ink/55">Executive Producer</div>
            <div className="font-display uppercase leading-[0.95] tracking-[-0.025em] text-[clamp(30px,3vw,44px)] mt-3">
              Ty Linegar
            </div>
            <a
              href="mailto:ty@thewardesk.com"
              className="inline-block font-sans text-[clamp(22px,2.3vw,32px)] mt-5 transition-colors"
            >
              <BoomUnderline variant="n">ty@thewardesk.com</BoomUnderline>
            </a>
            <p className="font-sans text-[16px] leading-[1.7] text-wd-ink/70 mt-8">
              War Desk Studio
              <br />
              El Segundo, California
              <br />
              <LocalTime /> here now
            </p>
          </div>

          {/* A note, or the deck */}
          <div>
            {submitted ? (
              <p className="font-sans text-[19px] leading-[1.6]">
                Thanks{form.name.trim() ? `, ${form.name.trim().split(" ")[0]}` : ""}. We have it, and Ty
                will reply from ty@thewardesk.com.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
                <label className="sm:col-span-1">
                  <span className={label}>Name</span>
                  <input
                    required
                    className={field}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoComplete="name"
                  />
                </label>
                <label className="sm:col-span-1">
                  <span className={label}>Company</span>
                  <input
                    className={field}
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    autoComplete="organization"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className={label}>Email</span>
                  <input
                    required
                    type="email"
                    className={field}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    autoComplete="email"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className={label}>What are you building?</span>
                  <textarea
                    required
                    rows={3}
                    className={`${field} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </label>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-wd-ink text-wd-bone font-sans font-medium text-[15px] px-8 py-4 hover:bg-black transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Sending" : "Send to Ty"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-14 pt-8 border-t border-wd-ink/15">
              {deckRequested ? (
                <p className="font-sans text-[16px]">The studio deck is on its way to {deckEmail}.</p>
              ) : (
                <form onSubmit={handleDeckSubmit} className="flex flex-col sm:flex-row sm:items-end gap-5">
                  <label className="flex-1">
                    <span className={label}>Or get the studio deck first</span>
                    <input
                      required
                      type="email"
                      placeholder="Work email"
                      className={field}
                      value={deckEmail}
                      onChange={(e) => setDeckEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={deckSubmitting}
                    className="font-sans font-medium text-[15px] pb-1 disabled:opacity-60 text-left"
                  >
                    <BoomUnderline variant="shaped">{deckSubmitting ? "Sending" : "Send me the deck"}</BoomUnderline>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
