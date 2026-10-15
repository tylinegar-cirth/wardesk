"use client";

import { useEffect, useRef } from "react";
import {
  DEFAULT_SHOCK,
  paintType,
  runShock,
  supportsShock,
  type ScenePainter,
  type ShockGround,
  type ShockParams,
} from "./shock";

// TRANSONIC · one shock pass per screen.
// Wraps a main title. On mount (the cold open) or the first time it comes into view, a
// group of transonic shock sheets crosses the field: near-vertical, creased, forking, and
// bending whatever is behind them. The title comes in creased inside the group and solid
// behind it. The DOM text stays the source of truth: hidden while the pass runs, handed
// back pixel-registered the moment the group clears the last letter.
//
// field="section" runs the sheets edge to edge across the whole section (the cold open);
// field="band" keeps them to a feathered band around the title (section titles).
// scene="hero" lets the sheets refract the hero footage as well as the type.

type Props = {
  children: React.ReactElement;
  trigger?: "mount" | "view";
  field?: "section" | "band";
  ground?: ShockGround;
  delayMs?: number;
  params?: Partial<ShockParams>;
  scene?: "hero";
  className?: string;
};

type Clocked = Window & { __wdClock?: () => number };
const clock = () => (window as Clocked).__wdClock?.() ?? performance.now();

export default function ShockReveal({
  children,
  trigger = "view",
  field = "band",
  ground = "dark",
  delayMs = 0,
  params,
  scene,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const paramsKey = JSON.stringify(params ?? {});

  useEffect(() => {
    const wrap = ref.current;
    const target = wrap?.firstElementChild as HTMLElement | null;
    const host = wrap?.closest("section") as HTMLElement | null;
    if (!wrap || !target || !host) return;

    const show = () => {
      target.classList.add("wd-shock-js");
      target.style.opacity = "1";
      target.classList.add("wd-echo-live");
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !supportsShock()) {
      show();
      return;
    }

    let cancelRun: (() => void) | null = null;
    let timer = 0;
    let disposed = false;
    target.classList.add("wd-shock-js");

    const start = async () => {
      if (disposed) return;
      try {
        await document.fonts.ready;
      } catch {
        /* fonts API unavailable: paint with whatever is loaded */
      }
      if (disposed) return;
      const P: ShockParams = { ...DEFAULT_SHOCK, ...(field === "band" ? { feather: 56 } : {}), ...JSON.parse(paramsKey) };
      const painter = scene === "hero" ? await heroScene(host) : undefined;
      if (disposed) return;
      const hostRect = host.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      const padY = 90;
      const f =
        field === "section"
          ? { x: 0, y: 0, w: host.clientWidth, h: host.clientHeight }
          : {
              x: 0,
              y: Math.max(0, tRect.top - hostRect.top - padY),
              w: host.clientWidth,
              h: tRect.height + padY * 2,
            };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const origin = { x: hostRect.left + f.x, y: hostRect.top + f.y };
      const { canvas, box } = paintType(target, origin, { w: f.w, h: f.h }, dpr);
      if (!isFinite(box.l)) {
        show();
        return;
      }
      cancelRun = runShock({
        host,
        field: f,
        text: canvas,
        dpr,
        axisY: (box.t + box.b) / 2,
        textBox: box,
        ground,
        params: P,
        scene: painter ? (ctx, w, h) => painter(ctx, w, h, origin) : undefined,
        clock,
        onLocked: show,
        onDone: () => {
          cancelRun = null;
        },
      });
      if (!cancelRun) show();
    };

    const arm = () => {
      target.style.opacity = "0";
      timer = window.setTimeout(start, delayMs);
    };

    let io: IntersectionObserver | null = null;
    if (trigger === "mount") {
      arm();
    } else {
      const r = target.getBoundingClientRect();
      const alreadySeen = r.top < window.innerHeight * 0.92;
      if (alreadySeen) {
        show();
      } else {
        target.style.opacity = "0";
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              io?.disconnect();
              io = null;
              timer = window.setTimeout(start, delayMs);
            }
          },
          { threshold: 0.6 }
        );
        io.observe(target);
      }
    }

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      io?.disconnect();
      cancelRun?.();
    };
  }, [trigger, field, ground, delayMs, paramsKey, scene]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// The hero footage as the page shows it: the video cover-fitted into its band, at its
// current fade, under the same grade as the page. The sheets refract this copy where
// they cross it; everywhere else the page's own video shows through.
async function heroScene(host: HTMLElement) {
  const video = host.querySelector("video.wd-cold-picture") as HTMLVideoElement | null;
  const band = video?.parentElement as HTMLElement | null;
  if (!video || !band) return undefined;
  const poster = new Image();
  if (video.poster) {
    poster.src = video.poster;
    try {
      await poster.decode();
    } catch {
      /* no poster: the video alone will do */
    }
  }
  const ink = "rgba(10,10,12,";
  const paint = (ctx: CanvasRenderingContext2D, w: number, h: number, origin: { x: number; y: number }) => {
    const b = band.getBoundingClientRect();
    const bx = b.left - origin.x;
    const by = b.top - origin.y;
    ctx.fillStyle = "rgb(10,10,12)";
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.beginPath();
    ctx.rect(bx, by, b.width, b.height);
    ctx.clip();
    const useVideo = video.readyState >= 2 && video.videoWidth > 0;
    const sw = useVideo ? video.videoWidth : poster.naturalWidth;
    const sh = useVideo ? video.videoHeight : poster.naturalHeight;
    if (sw && sh) {
      const s = Math.max(b.width / sw, b.height / sh);
      const dw = sw * s;
      const dh = sh * s;
      ctx.globalAlpha = parseFloat(getComputedStyle(video).opacity) || 0;
      ctx.drawImage(useVideo ? video : poster, bx + (b.width - dw) / 2, by + (b.height - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    }
    let g = ctx.createLinearGradient(0, by + b.height, 0, by);
    g.addColorStop(0, ink + "0.78)");
    g.addColorStop(0.34, ink + "0.28)");
    g.addColorStop(0.58, ink + "0)");
    g.addColorStop(1, ink + "0)");
    ctx.fillStyle = g;
    ctx.fillRect(bx, by, b.width, b.height);
    g = ctx.createLinearGradient(bx, 0, bx + b.width, 0);
    g.addColorStop(0, ink + "0.5)");
    g.addColorStop(0.48, ink + "0)");
    g.addColorStop(1, ink + "0)");
    ctx.fillStyle = g;
    ctx.fillRect(bx, by, b.width, b.height);
    ctx.restore();
  };
  return paint as (ctx: CanvasRenderingContext2D, w: number, h: number, origin: { x: number; y: number }) => void;
}

export type { ScenePainter };
