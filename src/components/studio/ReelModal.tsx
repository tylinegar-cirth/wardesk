"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// The full studio reel (v27, 1:39, scored). Same file the unlisted sales deck uses.
export const REEL_SRC = "/studiodeck/reel.mp4";
export const REEL_POSTER = "/hero-scope.jpg";
export const REEL_LENGTH = "1:39";
const OPEN_EVENT = "wd:open-reel";

/** Open the full-screen reel player from anywhere on the page. */
export function openReel() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** Mounted once per page. Plays the reel with sound on black; Escape or Close ends it. */
export default function ReelModal() {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const video = videoRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    if (video) {
      video.currentTime = 0;
      // Opened by a click, so sound is allowed. If a browser still refuses,
      // the native controls are there and one tap starts it.
      video.play().catch(() => {});
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      video?.pause();
    };
  }, [open]);

  if (!open) return null;

  // Portalled to <body>: globals.css forces every direct child of .wd-app to
  // position:relative, which would pin a fixed overlay into the page flow.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="War Desk Studio reel"
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black"
      onClick={() => setOpen(false)}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={() => setOpen(false)}
        className="absolute top-5 right-[clamp(20px,5vw,72px)] font-sans text-[14px] text-wd-bone/75 hover:text-wd-bone transition-colors"
      >
        Close
      </button>
      <video
        ref={videoRef}
        src={REEL_SRC}
        poster={REEL_POSTER}
        controls
        playsInline
        preload="auto"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-h-[86vh] max-w-[1600px] aspect-video"
      />
    </div>,
    document.body
  );
}
