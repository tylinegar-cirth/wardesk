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

/* ── Live clock — useful for the nav status bar ── */
export function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string>(() => formatUTC(new Date()));

  useEffect(() => {
    const i = setInterval(() => setTime(formatUTC(new Date())), 1000);
    return () => clearInterval(i);
  }, []);

  return <span className={className}>{time}</span>;
}

function formatUTC(d: Date) {
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss} UTC`;
}
