"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* Base position — El Segundo (matches the hero easter egg + footer payoff) */
const BASE_LAT = 33.918;
const BASE_LNG = -118.417;

/* Drift coefficients — chosen so the journey reads as motion without
   ever landing in nonsense values. Adjust to taste. */
const LAT_DRIFT_PER_PX = 0.0008; // moves south as you scroll
const LNG_DRIFT_PER_PX = 0.001; // drifts east as you scroll

function formatDMS(value: number, type: "lat" | "lng"): string {
  const absVal = Math.abs(value);
  const deg = Math.floor(absVal);
  const minFloat = (absVal - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.floor((minFloat - min) * 60);
  const dir =
    type === "lat" ? (value >= 0 ? "N" : "S") : (value >= 0 ? "E" : "W");
  return `${dir} ${deg}°${min
    .toString()
    .padStart(2, "0")}'${sec.toString().padStart(2, "0")}"`;
}

export default function StudioCoordinates() {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ lat: BASE_LAT, lng: BASE_LNG });

  useEffect(() => {
    setMounted(true);
    function update() {
      const y = window.scrollY;
      setPos({
        lat: BASE_LAT - y * LAT_DRIFT_PER_PX,
        lng: BASE_LNG + y * LNG_DRIFT_PER_PX,
      });
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!mounted) return null;

  /* Portal directly to <body> so we escape .wd-app's
     `position: relative; z-index: 1` global child override. */
  return createPortal(
    <div
      className="hidden md:block"
      style={{
        position: "fixed",
        top: "84px",
        right: "28px",
        zIndex: 90,
        pointerEvents: "none",
        textAlign: "right",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          fontFamily: "var(--font-mono, ui-monospace, monospace)",
          fontSize: "9px",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgb(212,168,67)",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <span
          style={{
            display: "block",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "rgb(212,168,67)",
            animation: "wdCoordPulse 2s ease-in-out infinite",
          }}
        />
        Transmitting
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono, ui-monospace, monospace)",
          fontSize: "10px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "rgba(244,244,245,0.78)",
          lineHeight: 1.8,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatDMS(pos.lat, "lat")}
        <br />
        {formatDMS(pos.lng, "lng")}
      </div>
      <style>{`
        @keyframes wdCoordPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>,
    document.body
  );
}
