"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ArticleModal from "./ArticleModal";
import Bracket from "@/components/ui/Bracket";
import StatusDot from "@/components/ui/StatusDot";

interface TeamMemberData {
  name: string;
  role: string;
  image: string;
  serial: string;
  bio: string;
  specs: { label: string; value: string }[];
  hasArticle: boolean;
  linkedin: string;
}

const team: TeamMemberData[] = [
  {
    name: "Ty Linegar",
    role: "Co-Founder & Executive Producer",
    image: "/team-ty.jpg",
    serial: "OP-01 / LINEGAR",
    bio: "A decade producing campaigns for the world\u2019s biggest brands. Good work, great clients, but Ty wanted to apply the craft to something with more weight. War Desk Studio exists to serve the companies actually pushing Western capability forward.",
    specs: [
      { label: "SPEC", value: "EXECUTIVE PRODUCTION" },
      { label: "TOUR", value: "10+ YEARS / NAT'L BRANDS" },
      { label: "BASE", value: "EL SEGUNDO, CA" },
    ],
    hasArticle: true,
    linkedin: "#",
  },
  {
    name: "Sean Gilfillan",
    role: "Co-Founder & Partner",
    image: "/team-sean.jpg",
    serial: "OP-02 / GILFILLAN",
    bio: "Ex-Pentagon strategist. US diplomat. Bronze Star veteran. Former CMO at Boeing and Viasat\u2019s $1B government division. Founded BaseFEST. 12 years Army, 15 months in Iraq. He\u2019s been on both sides, building campaigns for defense giants and buying what defense startups sell.",
    specs: [
      { label: "SPEC", value: "STRATEGY / DEFENSE" },
      { label: "TOUR", value: "12 YRS ARMY · PENTAGON" },
      { label: "HONOR", value: "BRONZE STAR VETERAN" },
    ],
    hasArticle: false,
    linkedin: "https://www.linkedin.com/in/seangilfillan/",
  },
  {
    name: "Samuel Bennetts",
    role: "Creative Director",
    image: "/team-sam.jpg",
    serial: "OP-03 / BENNETTS",
    bio: "20+ years directing and creative-directing across broadcast, live events, and immersive installations. Former creative leadership at ACNE and Toyota. Multi-disciplinary maker across directing, design, VFX, and emerging AI workflows.",
    specs: [
      { label: "SPEC", value: "CREATIVE / DIRECTION" },
      { label: "TOUR", value: "20+ YRS BROADCAST + LIVE" },
      { label: "DISCIPLINE", value: "FILM / DESIGN / VFX / AI" },
    ],
    hasArticle: false,
    linkedin: "#",
  },
];

function OperatorCard({
  member,
  index,
  onReadArticle,
}: {
  member: TeamMemberData;
  index: number;
  onReadArticle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{
        duration: 1.05,
        delay: index * 0.11,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative border border-wd-border hover:border-wd-gold/40 transition-colors duration-500 bg-wd-surface/30 backdrop-blur-sm"
    >
      {/* Portrait block */}
      <div className="relative aspect-[4/5] overflow-hidden bg-wd-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.image}
          alt={member.name}
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
        {/* Halftone overlay */}
        <div className="absolute inset-0 wd-halftone-white opacity-20 mix-blend-overlay pointer-events-none" />
        {/* Scanline gradient */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 4px)",
          }}
        />
        {/* Corner serial */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <span className="font-mono text-[9px] tracking-[0.24em] text-wd-bone bg-wd-ink/80 px-2 py-1 border border-wd-bone/30 backdrop-blur-sm">
            {member.serial}
          </span>
          <StatusDot label="ACTIVE" tone="gold" className="bg-wd-ink/80 px-2 py-1 border border-wd-gold/30 backdrop-blur-sm text-[8px]" />
        </div>
        {/* Bottom marker bar */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-wd-ink/70 border-t border-wd-gold/40 flex items-center justify-between px-3 backdrop-blur-sm">
          <span className="font-mono text-[8px] tracking-[0.28em] uppercase text-wd-bone/80">
            FIELD TESTED
          </span>
          <span className="font-mono text-[8px] tracking-[0.28em] uppercase text-wd-gold">
            {`/// OPR ${String(index + 1).padStart(2, "0")}`}
          </span>
        </div>
      </div>

      {/* Info block */}
      <div className="p-5 md:p-6 border-t border-wd-gold/25">
        <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-gold block mb-2">
          {member.role}
        </span>
        <h3 className="font-display text-[clamp(22px,2.5vw,30px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-text mb-4">
          {member.name}
        </h3>

        {/* Spec table */}
        <div className="mb-5 border-t border-b border-wd-border/60 py-3 space-y-1.5">
          {member.specs.map((spec) => (
            <div key={spec.label} className="flex items-baseline gap-3">
              <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-muted w-[70px] flex-shrink-0">
                {spec.label}
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-wd-text">
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        <p className="font-sans text-[13px] text-wd-sub leading-[1.7] mb-4">
          {member.bio}
        </p>

        {member.hasArticle && (
          <button
            onClick={onReadArticle}
            className="font-mono text-[10px] tracking-[0.18em] uppercase text-wd-gold hover:text-wd-text transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer flex items-center gap-2"
          >
            <span aria-hidden="true" className="h-[1px] w-3 bg-wd-gold" />
            Read Manifesto &rarr;
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function StudioTeamV2() {
  const [showArticle, setShowArticle] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  return (
    <>
      <section
        id="team"
        className="relative py-[clamp(80px,10vw,130px)] px-[clamp(16px,4vw,72px)] overflow-hidden"
      >
        {/* Oversized background mark */}
        <div className="absolute -left-[4vw] top-[60px] font-display text-[clamp(120px,22vw,340px)] text-wd-gold/[0.04] uppercase leading-[0.86] tracking-[-0.04em] pointer-events-none select-none z-0">
          Operators
        </div>

        <div className="relative z-[1] max-w-[1600px] mx-auto">
          <motion.div
            ref={headerRef}
            className="mb-12 md:mb-16"
            initial={{ opacity: 0, y: 36 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-wd-gold/30 flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <Bracket variant="gold" size="sm">
                  SECTION 04 // OPERATORS
                </Bracket>
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-muted">
                  UNIT ROSTER — WHO WE ARE
                </span>
              </div>
              <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-wd-gold/80">
                03 OPERATORS / ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-12 gap-6 items-end">
              <div className="col-span-12 md:col-span-8">
                <h2 className="font-display text-[clamp(40px,6.5vw,88px)] uppercase leading-[0.92] tracking-[-0.025em] text-wd-text">
                  <span className="text-wd-gold">Operators</span> on the ground.
                </h2>
              </div>
              <div className="col-span-12 md:col-span-4">
                <p className="font-sans text-[13px] text-wd-sub leading-[1.65] max-w-[320px]">
                  A small unit with deep reps on both sides of the buy. Pentagon
                  procurement, DTC launches, broadcast, live ops. Every project
                  is staffed from the roster — no agency bench drift.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {team.map((member, i) => (
              <OperatorCard
                key={member.name}
                member={member}
                index={i}
                onReadArticle={() => setShowArticle(true)}
              />
            ))}
          </div>

          <div className="mt-10 pt-5 border-t border-wd-gold/20 flex items-center justify-between font-mono text-[9px] tracking-[0.26em] uppercase text-wd-muted flex-wrap gap-3">
            <span>{"// END UNIT ROSTER"}</span>
            <span className="text-wd-gold/80">EXTENDED BENCH AVAILABLE ON REQUEST</span>
          </div>
        </div>
      </section>

      {showArticle && <ArticleModal onClose={() => setShowArticle(false)} />}
    </>
  );
}
