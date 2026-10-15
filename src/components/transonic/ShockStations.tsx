"use client";

import { useEffect, useRef } from "react";
import { attachShocks, DEFAULT_ATTACHED, supportsAttached, type AttachedParams, type ShockGround } from "./attached";
import { clockNow } from "./mach";

// TRANSONIC · the copy at speed. At rest the words are cut.
// Wraps a title whose words are marked data-word. Each word flies in out of its own left edge,
// nose first, wearing its shocks: they rake back through its letters and across the picture, and
// the bow shock tears off and runs on across the page as the word stops dead. Its shocks lock into
// it: a hairline of light flashes along each, and every letter is cut once at their angle into a
// face in the light and a face turned from it, which over film takes the film's light. A glint
// runs along the cuts now and then, and the shocks come back out when the page moves fast.
// (With freeze and cut at 0, v7: a few quiet shocks stay standing on the words instead.)
//
// The engine draws the title itself so the air can bend it. The page's own type stays in place
// for layout, selection and screen readers, and only stops painting while the engine draws it.
//
// The title must sit inside an element marked data-transonic-band. If that element holds a
// video, the shocks bend it too; a grade over the video can be marked data-transonic-scrim.
// With no grade, the engine's canvas goes first in the band, so the band's content must be
// positioned (relative) to stay on top of it.
//
// trigger "mount": the words fly in on load (the cold open).
// trigger "view": the words fly in the first time the title comes into view. A title already
// on screen at load just shows, with its air already moving.
// firstMs / stepMs: when the first word comes out, and the gap between words.

type Props = {
  children: React.ReactElement;
  trigger?: "mount" | "view";
  arrival?: "words" | "none";
  firstMs?: number; // when the first word comes out, after mount or after it comes into view
  stepMs?: number; // between words
  ground?: ShockGround;
  field?: "section" | "title";
  params?: Partial<AttachedParams>;
  className?: string;
};

// A section title's own air: from the end of whatever sits above it to the start of whatever
// sits below it, less a few pixels, so its shocks never run through other copy.
function airOf(wrap: HTMLElement, band: HTMLElement) {
  const top = band.getBoundingClientRect().top;
  const prev = wrap.previousElementSibling;
  const next = wrap.nextElementSibling;
  return {
    ceil: prev ? prev.getBoundingClientRect().bottom - top + 6 : undefined,
    floor: next ? next.getBoundingClientRect().top - top - 6 : undefined,
  };
}

export default function ShockStations({
  children,
  trigger = "mount",
  arrival = "words",
  firstMs = 900,
  stepMs = 260,
  ground = "dark",
  field = "section",
  params,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const paramsKey = JSON.stringify(params ?? {});

  useEffect(() => {
    const wrap = ref.current;
    const title = wrap?.firstElementChild as HTMLElement | null;
    const band = wrap?.closest("[data-transonic-band]") as HTMLElement | null;
    const section = (band?.closest("section") as HTMLElement | null) ?? band;
    if (!wrap || !title || !band || !section) return;
    const words = Array.from(title.querySelectorAll<HTMLElement>("[data-word]"));

    const showAll = () => {
      title.classList.add("wd-shock-js", "wd-echo-live");
      title.style.opacity = "1";
      words.forEach((w) => (w.style.opacity = ""));
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !supportsAttached() || !words.length) {
      showAll();
      return;
    }

    const shown = words.map(() => false);
    let lands = words.map(() => -1e9);
    title.classList.add("wd-shock-js");
    title.style.opacity = "1";
    const hide = () => {
      title.classList.remove("wd-echo-live");
      words.forEach((w) => (w.style.opacity = "0"));
    };

    // Words come out on the engine's clock, so a word and its shocks arrive on the same frame.
    const onTick = (now: number) => {
      for (let i = 0; i < words.length; i++) {
        if (shown[i] || now < lands[i]) continue;
        shown[i] = true;
        words[i].style.opacity = "";
        if (words[i].dataset.word === "payoff" || i === words.length - 1) title.classList.add("wd-echo-live");
      }
    };

    let stop: (() => void) | null = null;
    let disposed = false;
    let failsafe = 0;
    let io: IntersectionObserver | null = null;

    const attach = async (arrive: boolean, from: number) => {
      lands = words.map((_, i) => (arrive ? from + firstMs + i * stepMs : from - 10000));
      // Failsafe: if frames never run (a background tab, a stalled GPU), the title still shows.
      failsafe = window.setTimeout(showAll, firstMs + stepMs * words.length + 1500);
      try {
        await document.fonts.ready;
      } catch {
        /* fonts API unavailable: measure with whatever is loaded */
      }
      if (disposed) return;
      const P: AttachedParams = { ...DEFAULT_ATTACHED, ...JSON.parse(paramsKey) };
      try {
        stop = attachShocks({
          band,
          section,
          title,
          words,
          lands: () => lands,
          air: field === "title" ? airOf(wrap, band) : undefined,
          video: band.querySelector("video"),
          scrim: band.querySelector("[data-transonic-scrim]"),
          ground,
          field,
          params: P,
          clock: clockNow,
          onTick,
        });
      } catch {
        stop = null;
      }
      if (!stop) showAll();
    };

    if (trigger === "mount") {
      if (arrival === "words") hide();
      attach(arrival === "words", clockNow());
    } else if (title.getBoundingClientRect().top < window.innerHeight * 0.92) {
      attach(false, clockNow());
    } else {
      if (arrival === "words") hide();
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          io = null;
          attach(arrival === "words", clockNow());
        },
        { threshold: 0.6 }
      );
      io.observe(title);
    }

    return () => {
      disposed = true;
      window.clearTimeout(failsafe);
      io?.disconnect();
      stop?.();
      showAll();
    };
  }, [trigger, arrival, firstMs, stepMs, ground, field, paramsKey]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
