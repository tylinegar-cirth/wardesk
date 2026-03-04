"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Advisor } from "@/data/advisors";
import Stars from "@/components/ui/Stars";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const slots = ["0900", "1000", "1100", "1300", "1400", "1500", "1600"];
const tiers = [
  { name: "Signal", hrs: 1, desc: "Monthly briefing + async Q&A" },
  { name: "Strategy", hrs: 3, desc: "Working sessions + doc review" },
  { name: "Principal", hrs: 5, desc: "Full strategic partnership" },
];

function getDays(d: Date) {
  const y = d.getFullYear(), m = d.getMonth();
  const first = new Date(y, m, 1);
  const last = new Date(y, m + 1, 0);
  const ds: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) ds.push(null);
  for (let i = 1; i <= last.getDate(); i++) ds.push(new Date(y, m, i));
  return ds;
}

function isAvailable(d: Date | null) {
  return d && d.getDay() !== 0 && d.getDay() !== 6 && d.getDate() % 4 !== 0;
}

function formatTime(t: string) {
  const h = parseInt(t.slice(0, 2));
  return `${h > 12 ? h - 12 : h}:${t.slice(2)} ${h >= 12 ? "PM" : "AM"}`;
}

function sameDay(a: Date | null, b: Date | null) {
  return a && b && a.getDate() === b.getDate() && a.getMonth() === b.getMonth();
}

export default function AdvisorModal({
  advisor,
  onClose,
}: {
  advisor: Advisor;
  onClose: () => void;
}) {
  const [tab, setTab] = useState("session");
  const [step, setStep] = useState("profile");
  const [selDate, setSelDate] = useState<Date | null>(null);
  const [selTime, setSelTime] = useState<string | null>(null);
  const [selTier, setSelTier] = useState<number | null>(null);
  const [dur, setDur] = useState(60);
  const [mo, setMo] = useState(new Date(2026, 2, 1));

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  const price = Math.round(advisor.rate * (dur / 60));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[32px]"
        style={{ WebkitBackdropFilter: "blur(32px) saturate(0.7)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[720px] max-h-[90vh] bg-wd-surface border border-wd-border rounded-[20px] overflow-auto shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)] max-[768px]:rounded-2xl"
        >
          {/* Header */}
          <div className="flex border-b border-wd-border max-[768px]:flex-col">
            <div className="w-[220px] flex-shrink-0 overflow-hidden rounded-tl-[20px] max-[768px]:w-full max-[768px]:h-[200px] max-[768px]:rounded-t-[20px] max-[768px]:rounded-tl-[20px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={advisor.image} alt={advisor.name} className="w-full h-full object-cover" />
            </div>
            <div className="py-7 px-8 flex-1 relative min-w-0">
              <button
                onClick={onClose}
                className="absolute top-3 right-4 bg-white/5 border border-wd-border rounded-[10px] w-[34px] h-[34px] text-wd-muted text-base flex items-center justify-center transition-all duration-200 hover:bg-white/10 hover:text-wd-text hover:scale-105"
              >
                ×
              </button>
              {step === "calendar" && (
                <button
                  onClick={() => setStep("profile")}
                  className="bg-transparent border-none font-mono text-[10px] text-wd-muted p-0 mb-2 block transition-colors duration-200 hover:text-wd-text"
                >
                  ← Back
                </button>
              )}
              <div className="flex items-center gap-2 mb-2">
                {advisor.stars > 0 && <Stars count={advisor.stars} size={9} />}
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted">
                  {advisor.branch}
                </span>
              </div>
              <h2 className="font-serif text-[26px] font-normal text-wd-text mb-1">
                {advisor.name}
              </h2>
              <p className="font-sans text-[13px] text-wd-sub">
                {advisor.title}
              </p>
            </div>
          </div>

          {/* Profile step */}
          {step === "profile" && (
            <div className="py-7 px-8">
              <p className="font-sans text-sm text-wd-sub leading-[1.7] max-w-[500px] mb-5">
                {advisor.bio}
              </p>
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {advisor.focus.map((f, i) => (
                  <span
                    key={i}
                    className="font-mono text-[9px] tracking-[0.08em] uppercase py-[5px] px-3 border border-wd-border text-wd-muted rounded-md bg-white/[0.02]"
                  >
                    {f}
                  </span>
                ))}
              </div>
              {/* Tabs */}
              <div className="flex gap-0 border-b border-wd-border mb-6">
                {(["session", "retained", "enterprise"] as const).map((id) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={`font-mono text-[10px] tracking-[0.1em] uppercase py-3 px-[18px] bg-transparent border-none border-b-2 transition-all duration-200 ${
                      tab === id
                        ? "text-wd-text border-b-wd-gold"
                        : "text-wd-muted border-b-transparent hover:text-wd-sub"
                    }`}
                    style={{ borderBottomWidth: 2, borderBottomStyle: "solid", borderBottomColor: tab === id ? "#D4A843" : "transparent" }}
                  >
                    {id === "session" ? "Session" : id === "retained" ? "Retained" : "Enterprise"}
                  </button>
                ))}
              </div>

              {/* Session tab */}
              {tab === "session" && (
                <div>
                  <div className="flex gap-3 mb-6 flex-wrap">
                    {[
                      { l: "Rate", v: `$${advisor.rate}/hr` },
                      { l: "Sessions", v: advisor.sessions },
                      { l: "Experience", v: `${advisor.years}yr` },
                      { l: "Clearance", v: advisor.clearance },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="py-3.5 px-[18px] bg-white/[0.02] rounded-[10px] border border-wd-border"
                      >
                        <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted">
                          {s.l}
                        </div>
                        <div className="font-serif text-lg text-wd-text mt-1">
                          {s.v}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep("calendar")}
                    className="font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-8 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98]"
                  >
                    Book session →
                  </button>
                </div>
              )}

              {/* Retained tab */}
              {tab === "retained" && (
                <div className="grid grid-cols-3 gap-3 max-[768px]:grid-cols-1">
                  {tiers.map((t, i) => (
                    <div
                      key={i}
                      onClick={() => setSelTier(i)}
                      className={`p-[22px] border rounded-[14px] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        selTier === i
                          ? "border-wd-gold bg-wd-gold-glow shadow-[0_0_32px_rgba(212,168,67,0.15)]"
                          : "border-wd-border bg-white/[0.01] hover:border-wd-border-hov hover:bg-white/[0.03] hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-gold mb-1.5">
                        {t.name.toUpperCase()}
                      </div>
                      <div className="font-serif text-xl text-wd-text mb-1">
                        ${Math.round(advisor.rate * t.hrs * 0.8).toLocaleString()}
                        <span className="text-xs text-wd-muted">/mo</span>
                      </div>
                      <div className="font-sans text-[11px] text-wd-sub leading-snug">
                        {t.hrs}hr/mo — {t.desc}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Enterprise tab */}
              {tab === "enterprise" && (
                <div>
                  <p className="font-sans text-sm text-wd-sub leading-[1.7] mb-5 max-w-[440px]">
                    For multi-advisor teams, extended capture support, M&A due
                    diligence — Cypress International coordinates directly.
                  </p>
                  <button className="font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-8 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)]">
                    Contact Cypress →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Calendar step */}
          {step === "calendar" && (
            <div className="py-7 px-8">
              {/* Duration pills */}
              <div className="flex gap-2 mb-5 flex-wrap">
                {[30, 60, 90].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDur(d)}
                    className={`font-mono text-[10px] py-2 px-4 border rounded-lg transition-all duration-200 ${
                      dur === d
                        ? "border-wd-gold bg-wd-gold-glow text-wd-text"
                        : "border-wd-border bg-white/[0.02] text-wd-muted hover:border-wd-border-hov hover:text-wd-sub"
                    }`}
                  >
                    {d} min
                  </button>
                ))}
              </div>

              {/* Month nav */}
              <div className="flex justify-between items-center mb-3.5">
                <button
                  className="bg-white/[0.04] border border-wd-border text-wd-muted text-base py-1.5 px-3.5 rounded-lg transition-all duration-200 hover:bg-white/[0.08] hover:text-wd-text"
                  onClick={() => setMo(new Date(mo.getFullYear(), mo.getMonth() - 1))}
                >
                  ←
                </button>
                <span className="font-serif text-base text-wd-text">
                  {months[mo.getMonth()]} {mo.getFullYear()}
                </span>
                <button
                  className="bg-white/[0.04] border border-wd-border text-wd-muted text-base py-1.5 px-3.5 rounded-lg transition-all duration-200 hover:bg-white/[0.08] hover:text-wd-text"
                  onClick={() => setMo(new Date(mo.getFullYear(), mo.getMonth() + 1))}
                >
                  →
                </button>
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-0.5 mb-4">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div
                    key={i}
                    className="text-center font-mono text-[9px] text-wd-muted p-2"
                  >
                    {d}
                  </div>
                ))}
                {getDays(mo).map((d, i) => (
                  <button
                    key={i}
                    onClick={() => d && isAvailable(d) && setSelDate(d)}
                    disabled={!d || !isAvailable(d)}
                    className={`font-sans text-xs p-2.5 border-none bg-transparent rounded-lg transition-all duration-150 ${
                      sameDay(d, selDate)
                        ? "bg-wd-gold text-wd-bg"
                        : !d || !isAvailable(d)
                        ? "text-wd-muted cursor-default"
                        : "text-wd-text hover:bg-white/5"
                    }`}
                  >
                    {d ? d.getDate() : ""}
                  </button>
                ))}
              </div>

              {/* Time slots */}
              {selDate && (
                <>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-2.5 mt-5">
                    Available
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {slots.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelTime(s)}
                        className={`font-mono text-[10px] py-2 px-4 border rounded-lg transition-all duration-200 ${
                          selTime === s
                            ? "border-wd-gold bg-wd-gold-glow text-wd-text"
                            : "border-wd-border bg-white/[0.02] text-wd-muted hover:border-wd-border-hov hover:text-wd-sub"
                        }`}
                      >
                        {formatTime(s)}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Confirm bar */}
              {selDate && selTime && (
                <div className="p-[22px] bg-white/[0.02] border border-wd-border rounded-[14px] flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted mb-1">
                      Total
                    </div>
                    <div className="font-serif text-2xl text-wd-text">
                      ${price.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => setStep("confirm")}
                    className="font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-8 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)]"
                  >
                    Confirm →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Confirm step */}
          {step === "confirm" && (
            <div className="py-14 px-8 text-center">
              <div className="w-14 h-14 rounded-full bg-wd-gold-glow mx-auto mb-5 flex items-center justify-center text-2xl text-wd-gold">
                ✓
              </div>
              <div className="font-serif text-[28px] text-wd-text mb-2">
                Confirmed.
              </div>
              <p className="font-sans text-sm text-wd-sub mb-7">
                Secure briefing link within 24 hours.
              </p>
              <button
                onClick={onClose}
                className="font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 px-8 bg-white/[0.03] text-wd-sub border border-wd-border rounded-lg transition-all duration-300 backdrop-blur-[8px] hover:bg-white/[0.07] hover:border-wd-border-hov hover:text-wd-text hover:-translate-y-px"
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
