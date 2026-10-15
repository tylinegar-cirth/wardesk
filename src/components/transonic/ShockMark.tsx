"use client";

import { useEffect, useRef } from "react";
import { clockNow, sampleMach } from "./mach";

// TRANSONIC · the mark's shock.
// One sheet stands just aft of the logo mark, and only while the page is moving fast. At rest
// the mark is clean. Same drawing as the title shocks: straight at the root, small sharp kinks
// further out, a bright core with a fork that sweeps harder.

const W = 26; // canvas width, CSS px
const UP = 26; // reach above the root
const DOWN = 64; // reach below the root (the bar is at the top of the page)
const ROOT_X = 5;
const LIT = "240,233,216";

const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ShockMark({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr;
    cv.height = (UP + DOWN) * dpr;
    const r = rng(77);
    const knotsA = Array.from({ length: 32 }, () => r() * 2 - 1);
    const knotsB = Array.from({ length: 32 }, () => r() * 2 - 1);
    const kink = (knots: number[], s: number) => {
      const i = Math.floor(s);
      const f = s - i;
      const a = knots[((i % 32) + 32) % 32];
      const b = knots[(((i + 1) % 32) + 32) % 32];
      return a + (b - a) * f;
    };
    const sheet = (dx: number, lean: number, alpha: number, reachK: number, t: number, ph: number, knots: number[]) => {
      const up = UP * reachK;
      const down = DOWN * reachK;
      const wob = Math.sin(t * 1.7 + ph) * 0.8;
      let prev: [number, number] | null = null;
      for (let y = -up; y <= down; y += 2) {
        const reach = y < 0 ? up : down;
        const a = Math.abs(y) / reach;
        const env = 1 - smooth(0.3, 1, a);
        const k = 0.62 * kink(knots, y / 30 + 3 + wob) + 0.38 * kink(knots, y / 9 + 11 + wob * 1.7);
        const x = ROOT_X + dx + lean * reach * a * a + 1.6 * Math.pow(a, 1.35) * k;
        const pt: [number, number] = [x, UP + y];
        if (prev) {
          ctx.strokeStyle = `rgba(${LIT},${(alpha * env).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(prev[0], prev[1]);
          ctx.lineTo(pt[0], pt[1]);
          ctx.stroke();
        }
        prev = pt;
      }
    };

    let raf = 0;
    let lastMove = -1e9;
    const t0 = clockNow();
    const frame = () => {
      raf = 0;
      const now = clockNow();
      const m = sampleMach(now);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, UP + DOWN);
      if (m > 0.02) {
        const t = (now - t0) / 1000;
        const k = Math.min(1, (m - 0.02) / 0.5);
        ctx.lineWidth = 1;
        sheet(0, 0.07, 0.55 * k, 0.55 + 0.45 * k, t, 0.3, knotsA);
        sheet(3.2, 0.13, 0.32 * k, 0.45 + 0.4 * k, t, 2.1, knotsB);
      }
      if (m > 0.004 || now - lastMove < 300) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      lastMove = clockNow();
      if (!raf) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{ width: W, height: UP + DOWN, left: `calc(100% + ${6 - ROOT_X}px)`, top: `calc(50% - ${UP}px)` }}
    />
  );
}
