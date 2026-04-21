"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";

export default function StudioInterstitial() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => setVideoFailed(true));
    const handleVis = () => {
      if (!document.hidden && videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, []);

  return (
    <motion.section
      ref={ref}
      className="relative w-full overflow-hidden h-[clamp(360px,44vh,540px)]"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          y,
          scale: 1.15,
          transformOrigin: "40% 50%",
        }}
      >
        {videoFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/hero-radar.jpg"
            alt=""
            className="w-full h-full object-cover object-[72%_40%] md:object-[center_35%]"
            style={{
              filter: "contrast(1.12) brightness(0.72) saturate(0.72)",
            }}
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            controls={false}
            preload="auto"
            aria-hidden="true"
            poster="/hero-radar.jpg"
            src="/hero-radar.mp4"
            className="w-full h-full object-cover"
            style={{
              filter: "contrast(1.12) brightness(0.72) saturate(0.72)",
              objectPosition: "center 35%",
            }}
            onError={() => setVideoFailed(true)}
          />
        )}
      </motion.div>

      {/* Halftone overlay */}
      <div className="absolute inset-0 wd-halftone-white opacity-30 mix-blend-overlay pointer-events-none" />

      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgb(var(--wd-bg)) 0%, rgb(var(--wd-bg) / 0.4) 45%, rgb(var(--wd-bg) / 0) 100%)",
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{
          background:
            "linear-gradient(0deg, rgb(var(--wd-bg)) 0%, rgb(var(--wd-bg) / 0.4) 45%, rgb(var(--wd-bg) / 0) 100%)",
        }}
      />

      {/* Central editorial pull-quote */}
      <div className="relative z-[3] h-full flex items-center justify-center px-[clamp(20px,5vw,72px)]">
        <div className="max-w-[900px] text-center flex flex-col items-center">
          <p className="font-serif italic text-[clamp(24px,3.6vw,48px)] leading-[1.15] tracking-[-0.01em] text-wd-bone">
            The substance is finally worthy of the craft.
          </p>

          <Link
            href="/studio/essays"
            className="group relative mt-8 inline-flex flex-col border-2 border-wd-bone hover:border-wd-gold transition-colors duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            {/* Corner registration ticks — extend outside the border */}
            <span
              aria-hidden="true"
              className="absolute -top-[6px] -left-[6px] w-[10px] h-[10px] border-t-[2px] border-l-[2px] border-wd-gold pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="absolute -top-[6px] -right-[6px] w-[10px] h-[10px] border-t-[2px] border-r-[2px] border-wd-gold pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-[6px] -left-[6px] w-[10px] h-[10px] border-b-[2px] border-l-[2px] border-wd-gold pointer-events-none"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-[6px] -right-[6px] w-[10px] h-[10px] border-b-[2px] border-r-[2px] border-wd-gold pointer-events-none"
            />

            {/* Top ink band — document metadata */}
            <span className="bg-wd-ink text-wd-bone font-mono text-[9px] tracking-[0.3em] uppercase px-5 py-1.5 flex items-center justify-between gap-8 min-w-[280px]">
              <span>Essays</span>
              <span className="text-wd-gold/90">By Ty Linegar</span>
            </span>

            {/* Main bone body — label + arrow */}
            <span className="bg-wd-bone text-wd-ink px-7 py-4 font-display text-[13px] tracking-[0.18em] uppercase flex items-center justify-center gap-3 group-hover:bg-wd-gold transition-colors duration-300">
              Read the Essays
              <span
                aria-hidden="true"
                className="text-[15px] group-hover:translate-x-1 transition-transform"
              >
                →
              </span>
            </span>
          </Link>
        </div>
      </div>

      {/* Radar sweep */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] pointer-events-none hidden md:block z-[2]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0) 8%, rgba(212,168,67,0.55) 50%, rgba(212,168,67,0) 92%, transparent 100%)",
          boxShadow: "0 0 16px rgba(212,168,67,0.4)",
          top: 0,
        }}
        animate={{ top: ["-2%", "102%"] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1,
        }}
      />
    </motion.section>
  );
}
