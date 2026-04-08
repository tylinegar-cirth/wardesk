"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useCallback } from "react";

interface LogoProps {
  className?: string;
  alt?: string;
}

export default function Logo({ className = "", alt = "" }: LogoProps) {
  const [spinning, setSpinning] = useState(false);

  const handleHover = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    // Duration matches the CSS animation
    setTimeout(() => setSpinning(false), 900);
  }, [spinning]);

  const spinStyle = spinning
    ? {
        animation: "logo-spin 0.9s cubic-bezier(0.2, 0, 0.1, 1) forwards",
      }
    : undefined;

  return (
    <>
      <style jsx global>{`
        @keyframes logo-spin {
          0% {
            transform: rotate(0deg);
          }
          40% {
            transform: rotate(540deg);
          }
          100% {
            transform: rotate(720deg);
          }
        }
      `}</style>
      <img
        src="/logo.png"
        alt={alt}
        className={`dark:hidden ${className}`}
        style={spinStyle}
        onMouseEnter={handleHover}
      />
      <img
        src="/logo-white.png"
        alt={alt}
        className={`hidden dark:block ${className}`}
        style={spinStyle}
        onMouseEnter={handleHover}
      />
    </>
  );
}
