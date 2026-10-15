"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// TRANSONIC · the boom.
// A sonic boom's pressure trace is an N: a sharp rise at the bow shock, a straight fall,
// a sharp return at the tail. On hover or focus that signature travels the underline once,
// left to right, the way a boom passes an observer.
//   variant "n"      : the classic boom. For the one primary action per screen.
//   variant "shaped" : the shaped low boom (X-59 style): a softened front and a rounded tail.
//                      For every secondary link.
// idle "line" keeps a quiet hairline under the text; idle "none" shows nothing until the boom.

type Props = {
  children: React.ReactNode;
  variant?: "n" | "shaped";
  idle?: "line" | "none";
  className?: string;
};

type Clocked = Window & { __wdClock?: () => number };
const now = () => (typeof window !== "undefined" && (window as Clocked).__wdClock?.()) || performance.now();

const H = 12; // svg height
const Y = 6; // baseline
const AMP = 3.4; // peak overpressure, px
const DUR = 620; // ms for the boom to cross

function boomPath(w: number, x0: number, variant: "n" | "shaped") {
  const r = (v: number) => Math.round(v * 100) / 100;
  if (variant === "shaped") {
    const n = 34;
    return `M0 ${Y} H${r(x0)} V${r(Y - AMP * 0.55)} L${r(x0 + n * 0.22)} ${r(Y - AMP)} L${r(x0 + n * 0.78)} ${r(Y + AMP * 0.7)} Q${r(
      x0 + n * 0.9
    )} ${r(Y + AMP * 0.7)} ${r(x0 + n)} ${Y} H${r(w)}`;
  }
  const n = 24;
  return `M0 ${Y} H${r(x0)} V${r(Y - AMP)} L${r(x0 + n)} ${r(Y + AMP)} V${Y} H${r(w)}`;
}

export default function BoomUnderline({ children, variant = "shaped", idle = "line", className = "" }: Props) {
  const wrap = useRef<HTMLSpanElement>(null);
  const path = useRef<SVGPathElement>(null);
  const raf = useRef(0);
  const [w, setW] = useState(0);
  const [booming, setBooming] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el);
    setW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const boom = useCallback(() => {
    if (!w || !path.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    const n = variant === "shaped" ? 34 : 24;
    const from = -n;
    const to = w + 2;
    const t0 = now();
    setBooming(true);
    const step = () => {
      const k = Math.min(1, (now() - t0) / DUR);
      path.current?.setAttribute("d", boomPath(w, from + (to - from) * k, variant));
      if (k < 1) raf.current = requestAnimationFrame(step);
      else {
        path.current?.setAttribute("d", `M0 ${Y} H${w}`);
        setBooming(false);
      }
    };
    raf.current = requestAnimationFrame(step);
  }, [w, variant]);

  // Listen on the link or button the underline belongs to, so its whole hit area triggers.
  useEffect(() => {
    const el = wrap.current;
    const trigger = (el?.closest("a,button") as HTMLElement | null) ?? el;
    if (!trigger) return;
    trigger.addEventListener("mouseenter", boom);
    trigger.addEventListener("focus", boom);
    return () => {
      trigger.removeEventListener("mouseenter", boom);
      trigger.removeEventListener("focus", boom);
      cancelAnimationFrame(raf.current);
    };
  }, [boom]);

  return (
    <span ref={wrap} className={`wd-boom ${idle === "none" ? "wd-boom-hidden" : ""} ${booming ? "is-booming" : ""} ${className}`}>
      {children}
      <svg className="wd-boom-line" width={w || 1} height={H} viewBox={`0 0 ${w || 1} ${H}`} aria-hidden="true" focusable="false">
        <path ref={path} d={`M0 ${Y} H${w}`} />
      </svg>
    </span>
  );
}
