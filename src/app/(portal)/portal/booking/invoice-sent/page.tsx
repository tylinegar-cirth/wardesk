"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function InvoiceSentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const advisorName = searchParams.get("advisor") || "Your advisor";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const duration = searchParams.get("duration") || "";
  const priceRaw = searchParams.get("price");
  const company = searchParams.get("company") || "";
  const price = priceRaw ? `$${(parseInt(priceRaw) / 100).toLocaleString()}` : "";

  return (
    <div className="p-6 md:p-10 max-w-lg mx-auto">
      <div className="bg-wd-card border border-wd-border rounded-[14px] p-8 text-center">
        {/* Envelope icon */}
        <div className="w-14 h-14 rounded-full bg-amber-500/10 mx-auto mb-5 flex items-center justify-center">
          <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        <p className="font-serif text-2xl text-wd-text mb-2">
          Invoice sent
        </p>
        <p className="font-sans text-sm text-wd-sub mb-6 leading-relaxed">
          A net-30 invoice has been sent to your email. Your session is reserved
          and will be confirmed once payment is received.
        </p>

        {/* Booking details */}
        <div className="bg-wd-overlay/[0.03] border border-wd-border rounded-lg p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
              Advisor
            </span>
            <span className="font-sans text-sm text-wd-text">
              {advisorName}
            </span>
          </div>
          {company && (
            <>
              <div className="border-t border-wd-border" />
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                  Company
                </span>
                <span className="font-sans text-sm text-wd-text">
                  {company}
                </span>
              </div>
            </>
          )}
          {date && (
            <>
              <div className="border-t border-wd-border" />
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                  Date
                </span>
                <span className="font-sans text-sm text-wd-text">
                  {date}
                </span>
              </div>
            </>
          )}
          {time && (
            <>
              <div className="border-t border-wd-border" />
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                  Time
                </span>
                <span className="font-sans text-sm text-wd-text">
                  {time}
                </span>
              </div>
            </>
          )}
          {duration && (
            <>
              <div className="border-t border-wd-border" />
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                  Duration
                </span>
                <span className="font-sans text-sm text-wd-text">
                  {duration} min
                </span>
              </div>
            </>
          )}
          {price && (
            <>
              <div className="border-t border-wd-border" />
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
                  Amount
                </span>
                <span className="font-serif text-lg text-wd-gold">
                  {price}
                </span>
              </div>
            </>
          )}
          <div className="border-t border-wd-border" />
          <div className="flex justify-between items-center">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
              Payment terms
            </span>
            <span className="font-sans text-sm text-amber-400">
              Net 30
            </span>
          </div>
          <div className="border-t border-wd-border" />
          <div className="flex justify-between items-center">
            <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-wd-muted">
              Status
            </span>
            <span className="inline-block font-mono text-[9px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">
              Pending payment
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/portal/sessions")}
            className="w-full font-mono text-[11px] tracking-[0.1em] uppercase py-3.5 bg-wd-gold text-wd-bg border-none font-bold rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_2px_12px_rgba(212,168,67,0.15)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] active:translate-y-0 active:scale-[0.98]"
          >
            View sessions
          </button>
          <Link
            href="/portal/advisors"
            className="block w-full font-mono text-[10px] tracking-[0.05em] text-wd-muted hover:text-wd-sub transition-colors text-center pt-2"
          >
            Book another session
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function InvoiceSentPage() {
  return (
    <Suspense>
      <InvoiceSentContent />
    </Suspense>
  );
}
