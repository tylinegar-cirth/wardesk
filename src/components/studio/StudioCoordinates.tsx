"use client";

import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";

/* Base position — El Segundo (matches hero easter egg + footer payoff) */
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
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      // Drift coordinates with scroll
      const lat = BASE_LAT - latest * LAT_DRIFT_PER_PX;
      const lng = BASE_LNG + latest * LNG_DRIFT_PER_PX;
      setPos({ lat, lng });

      // Fade in once we've scrolled past the hero (~600px) so we don't
      // collide with the static coordinates inside the hero block
      if (latest > 600) {
        setOpacity(Math.min((latest - 600) / 200, 0.95));
      } else {
        setOpacity(0);
      }
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <div
      className="fixed top-[88px] right-[24px] z-[40] hidden lg:block pointer-events-none transition-opacity duration-300"
      style={{ opacity }}
      aria-hidden="true"
    >
      <div className="text-right">
        <div className="font-mono text-[8px] tracking-[0.4em] uppercase text-wd-gold/80 mb-1.5 flex items-center justify-end gap-2">
          <motion.span
            className="block w-1 h-1 rounded-full bg-wd-gold"
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          Transmitting
        </div>
        <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-wd-muted leading-[1.7] tabular-nums">
          {formatDMS(pos.lat, "lat")}
          <br />
          {formatDMS(pos.lng, "lng")}
        </div>
      </div>
    </div>
  );
}
