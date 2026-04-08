"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export default function StudioAmbient() {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.pageX, y: e.pageY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div ref={ref} className="fixed inset-0 z-[1] pointer-events-none">
      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.10]">
        <defs>
          <pattern
            id="ambient-dotgrid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="16" cy="16" r="0.7" fill="rgb(var(--wd-muted))" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ambient-dotgrid)" />
      </svg>
      {/* Gold glow following mouse */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.05] transition-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,168,67,0.5) 0%, transparent 70%)",
          left: mousePos.x - 300,
          top: mousePos.y - 300,
          willChange: "left, top",
        }}
      />
    </div>
  );
}
