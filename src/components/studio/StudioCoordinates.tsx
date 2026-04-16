"use client";

import { useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

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
  const { scrollY } = useScroll();
  const [pos, setPos] = useState({ lat: BASE_LAT, lng: BASE_LNG });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const lat = BASE_LAT - latest * LAT_DRIFT_PER_PX;
    const lng = BASE_LNG + latest * LNG_DRIFT_PER_PX;
    setPos({ lat, lng });
  });

  return (
    <motion.div
      className="fixed top-[84px] right-[28px] z-[60] hidden md:block pointer-events-none"
      aria-hidden="true"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-right">
        <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-wd-gold mb-2 flex items-center justify-end gap-2.5">
          <motion.span
            className="block w-1.5 h-1.5 rounded-full bg-wd-gold"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          Transmitting
        </div>
        <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-wd-text/75 leading-[1.8] tabular-nums">
          {formatDMS(pos.lat, "lat")}
          <br />
          {formatDMS(pos.lng, "lng")}
        </div>
      </div>
    </motion.div>
  );
}
