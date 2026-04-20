"use client";

import { ReactNode } from "react";

type Props = {
  items: ReactNode[];
  speed?: "normal" | "fast";
  reverse?: boolean;
  className?: string;
  divider?: string;
};

export default function MarqueeTicker({
  items,
  speed = "normal",
  reverse = false,
  className = "",
  divider = "◆",
}: Props) {
  const loop = [...items, ...items];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`wd-marquee-track ${
          speed === "fast" ? "wd-marquee-track-fast" : ""
        } ${reverse ? "wd-marquee-track-reverse" : ""}`}
      >
        {loop.map((item, i) => (
          <span key={i} className="flex items-center gap-6 pr-6 shrink-0">
            {item}
            <span className="text-wd-gold/35 text-[9px]">{divider}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
