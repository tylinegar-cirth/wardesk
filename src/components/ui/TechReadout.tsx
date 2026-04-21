"use client";

import { useEffect, useState } from "react";

type Line =
  | { label: string; value: string; tone?: "gold" | "text" | "muted" | "blaze" }
  | { divider: true };

type Props = {
  lines: Line[];
  align?: "left" | "right";
  className?: string;
};

const toneClass = {
  gold: "text-wd-gold",
  text: "text-wd-text",
  muted: "text-wd-muted",
  blaze: "text-wd-blaze",
};

export default function TechReadout({ lines, align = "left", className = "" }: Props) {
  return (
    <div
      className={`font-mono text-[9px] tracking-[0.24em] uppercase leading-[1.8] ${
        align === "right" ? "text-right" : "text-left"
      } ${className}`}
    >
      {lines.map((line, i) => {
        if ("divider" in line) {
          return (
            <div
              key={i}
              className="my-2 h-px w-full bg-wd-gold/25"
              aria-hidden="true"
            />
          );
        }
        const tone = line.tone ?? "muted";
        return (
          <div
            key={i}
            className={`flex gap-3 ${align === "right" ? "justify-end" : "justify-start"}`}
          >
            <span className="text-wd-muted">{line.label}</span>
            <span className={toneClass[tone]}>{line.value}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Live clock — useful for the nav status bar ──
   Renders empty on SSR to avoid hydration mismatch, populates on mount. */
export function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(formatLA(new Date()));
    const i = setInterval(() => setTime(formatLA(new Date())), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {time || "\u00A0"}
    </span>
  );
}

function formatLA(d: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  }).formatToParts(d);
  const hh = parts.find((p) => p.type === "hour")?.value ?? "00";
  const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
  const ss = parts.find((p) => p.type === "second")?.value ?? "00";
  const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "PT";
  return `${hh}:${mm}:${ss} ${tz}`;
}
