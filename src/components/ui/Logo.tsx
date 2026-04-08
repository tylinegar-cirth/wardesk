"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useCallback, useEffect, useRef } from "react";

interface LogoProps {
  className?: string;
  alt?: string;
}

export default function Logo({ className = "", alt = "" }: LogoProps) {
  const [spinning, setSpinning] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const triggerSpin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);
  }, [spinning]);

  // Listen for hover on the closest parent link/button (the whole "War Desk Studio" container)
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    const parent = img.closest("a, button, [data-logo-hover]");
    if (!parent) return;
    parent.addEventListener("mouseenter", triggerSpin);
    return () => parent.removeEventListener("mouseenter", triggerSpin);
  }, [triggerSpin]);

  const spinStyle = spinning
    ? { animation: "logo-spin 0.8s cubic-bezier(0.3, 0, 0, 1) forwards" }
    : undefined;

  return (
    <>
      <style jsx global>{`
        @keyframes logo-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <img
        ref={imgRef}
        src="/logo.png"
        alt={alt}
        className={`dark:hidden ${className}`}
        style={spinStyle}
      />
      <img
        src="/logo-white.png"
        alt={alt}
        className={`hidden dark:block ${className}`}
        style={spinStyle}
      />
    </>
  );
}
