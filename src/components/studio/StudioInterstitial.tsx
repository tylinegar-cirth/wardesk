"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import Bracket from "@/components/ui/Bracket";
import StatusDot from "@/components/ui/StatusDot";
import FlagStripes from "@/components/ui/FlagStripes";

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
      className="relative w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Bone manifesto pull-quote panel */}
      <div className="relative bg-wd-bone text-wd-ink py-[clamp(60px,9vw,130px)] px-[clamp(20px,5vw,72px)] overflow-hidden">
        {/* Halftone background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(rgba(18,18,20,0.35) 1px, transparent 1.2px)",
            backgroundSize: "6px 6px",
          }}
          aria-hidden="true"
        />

        {/* Oversized background wordmark */}
        <div className="absolute -right-[6vw] top-[10%] font-display text-[clamp(160px,26vw,420px)] text-wd-ink/[0.06] uppercase leading-[0.82] tracking-[-0.04em] pointer-events-none select-none" aria-hidden="true">
          MEANING
        </div>

        <div className="relative max-w-[1400px] mx-auto">
          {/* Header strip */}
          <div className="flex items-center justify-between mb-10 pb-4 border-b-2 border-wd-ink/40 flex-wrap gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <Bracket variant="ink" size="sm">
                DOCUMENT 00 // MANIFESTO
              </Bracket>
              <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-ink/60">
                EXCERPT / THE MEANING PROBLEM
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FlagStripes className="w-8 h-4 opacity-70" variant="ink" />
              <StatusDot label="DECLASSIFIED" tone="gold" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
            <div className="col-span-12 lg:col-span-8">
              <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-wd-ink/50 mb-5">
                BY TY LINEGAR — CO-FOUNDER & EXECUTIVE PRODUCER
              </div>

              <p className="font-serif italic text-[clamp(28px,4.2vw,64px)] leading-[1.05] tracking-[-0.015em] text-wd-ink mb-8">
                The substance is finally worthy of the craft.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10">
                <p className="font-sans text-[15px] leading-[1.7] text-wd-ink/80">
                  For most consumer products, the job is to manufacture meaning.
                  Build mythology from a void. Attach the product to identity,
                  to aspiration, to belonging. The brand is the product because
                  there is no other differentiation.
                </p>
                <p className="font-sans text-[15px] leading-[1.7] text-wd-ink/80">
                  Hard tech is the inverse. The feeling is earned. The story is
                  already true. A generation of builders focused on energy,
                  defense, space, infrastructure — doing the kind of work that
                  actually moves the needle on what humanity is capable of.
                </p>
              </div>

              <p className="font-display text-[clamp(24px,3.5vw,46px)] uppercase leading-[0.94] tracking-[-0.025em] text-wd-ink">
                This movement deserves storytelling
                <br />
                that takes it <span className="text-wd-blaze">seriously</span>.
              </p>
            </div>

            {/* Right meta column */}
            <div className="col-span-12 lg:col-span-4 lg:border-l-2 border-wd-ink/40 lg:pl-8">
              <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-ink/50 leading-[1.9] mb-8">
                <div className="flex justify-between gap-3 border-b border-wd-ink/20 pb-2 mb-2">
                  <span>DOC</span>
                  <span className="text-wd-ink">WD-MANIFESTO-00</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-wd-ink/20 pb-2 mb-2">
                  <span>FILED</span>
                  <span className="text-wd-ink">2026 · EL SEGUNDO</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-wd-ink/20 pb-2 mb-2">
                  <span>LENGTH</span>
                  <span className="text-wd-ink">04 CHAPTERS</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>STATUS</span>
                  <span className="text-wd-blaze">ACTIVE · ONGOING</span>
                </div>
              </div>

              <Link
                href="/studio/manifesto"
                className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase py-4 px-7 bg-wd-ink text-wd-bone border-2 border-wd-ink hover:bg-wd-bone hover:text-wd-ink transition-colors font-bold"
              >
                Read full manifesto
                <span className="text-[14px] group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Footer stripe */}
          <div className="mt-12 pt-4 border-t-2 border-wd-ink/40 flex items-center justify-between flex-wrap gap-3 font-mono text-[9px] tracking-[0.24em] uppercase text-wd-ink/60">
            <span>{"// END EXCERPT — DOCUMENT 00"}</span>
            <div className="flex items-center gap-3">
              <span>N 33°55&apos;09&quot; W 118°24&apos;59&quot;</span>
              <FlagStripes className="w-6 h-3 opacity-60" variant="ink" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Radar video band below bone panel ── */}
      <div className="relative h-[clamp(280px,36vh,460px)] overflow-hidden bg-wd-bg">
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
                filter: "contrast(1.12) brightness(0.68) saturate(0.7)",
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
                filter: "contrast(1.12) brightness(0.68) saturate(0.7)",
                objectPosition: "center 35%",
              }}
              onError={() => setVideoFailed(true)}
            />
          )}
        </motion.div>

        {/* Halftone overlay */}
        <div className="absolute inset-0 wd-halftone-white opacity-40 mix-blend-overlay pointer-events-none" />

        {/* Top fade */}
        <div
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgb(var(--wd-bone) / 0.95) 0%, rgb(var(--wd-bg) / 0) 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(0deg, rgb(var(--wd-bg)) 0%, rgb(var(--wd-bg) / 0) 100%)",
          }}
        />

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
            duration: 4.5,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0.8,
          }}
        />

        {/* Corner labels on top of video */}
        <div className="absolute top-5 left-5 z-[3] font-mono text-[9px] tracking-[0.26em] uppercase text-wd-gold/80 hidden md:block">
          [ RADAR — ACTIVE SWEEP ]
        </div>
        <div className="absolute top-5 right-5 z-[3] font-mono text-[9px] tracking-[0.26em] uppercase text-wd-bone/60 hidden md:block">
          RANGE / 40NM · BEARING / 090°
        </div>
      </div>
    </motion.section>
  );
}
