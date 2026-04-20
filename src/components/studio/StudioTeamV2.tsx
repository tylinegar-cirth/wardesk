"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ArticleModal from "./ArticleModal";

interface Spec {
  label: string;
  value: string;
}

interface TeamMemberData {
  name: string;
  surname: string;
  role: string;
  discipline: string;
  image: string;
  bio: string;
  specs: Spec[];
  hasArticle: boolean;
  linkedin: string;
}

const team: TeamMemberData[] = [
  {
    name: "Ty Linegar",
    surname: "Linegar",
    role: "Co-Founder & Executive Producer",
    discipline: "Production",
    image: "/team-ty.jpg",
    bio: "A decade producing campaigns for the world\u2019s biggest brands. Good work, great clients, but Ty wanted to apply the craft to something with more weight. War Desk Studio exists to serve the companies actually pushing Western capability forward.",
    specs: [
      { label: "Based", value: "El Segundo, CA" },
      { label: "Work", value: "National brand campaigns" },
      { label: "Focus", value: "Executive production" },
    ],
    hasArticle: true,
    linkedin: "#",
  },
  {
    name: "Sean Gilfillan",
    surname: "Gilfillan",
    role: "Co-Founder & Partner",
    discipline: "Strategy",
    image: "/team-sean.jpg",
    bio: "Ex-Pentagon strategist. US diplomat. Bronze Star veteran. Former CMO at Boeing and Viasat\u2019s $1B government division. Founded BaseFEST. 12 years Army, 15 months in Iraq. He\u2019s been on both sides, building campaigns for defense giants and buying what defense startups sell.",
    specs: [
      { label: "Based", value: "Washington, DC" },
      { label: "Work", value: "Boeing, Viasat, Pentagon" },
      { label: "Focus", value: "Narrative & go-to-market" },
    ],
    hasArticle: false,
    linkedin: "https://www.linkedin.com/in/seangilfillan/",
  },
  {
    name: "Samuel Bennetts",
    surname: "Bennetts",
    role: "Creative Director",
    discipline: "Direction",
    image: "/team-sam.jpg",
    bio: "20+ years directing and creative-directing across broadcast, live events, and immersive installations. Former creative leadership at ACNE and Toyota. Multi-disciplinary maker across directing, design, VFX, and emerging AI workflows.",
    specs: [
      { label: "Based", value: "Los Angeles, CA" },
      { label: "Work", value: "ACNE, Toyota" },
      { label: "Focus", value: "Film, design, VFX, AI" },
    ],
    hasArticle: false,
    linkedin: "#",
  },
];

function TeamCard({
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
      className="group relative border border-wd-border hover:border-wd-gold/45 transition-colors duration-500 bg-wd-surface/25 backdrop-blur-sm"
    >
      {/* Portrait block */}
      <div className="relative aspect-[4/5] overflow-hidden bg-wd-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.image}
          alt={member.name}
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
        {/* Halftone print texture */}
        <div className="absolute inset-0 wd-halftone-white opacity-20 mix-blend-overlay pointer-events-none" />
        {/* Scanline overlay — subtle newsprint feel */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 4px)",
          }}
        />

        {/* Top overlay: index + surname */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-wd-bone/80">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-bone bg-wd-ink/70 px-2 py-1 border border-wd-bone/25 backdrop-blur-sm">
            {member.surname}
          </span>
        </div>

        {/* Bottom overlay: discipline band */}
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-wd-ink/75 border-t border-wd-gold/40 flex items-center justify-between px-3 backdrop-blur-sm">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-wd-bone/75">
            {member.discipline}
          </span>
          <span className="font-display text-[10px] tracking-[0.06em] uppercase text-wd-gold">
            No.&nbsp;{String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Info block */}
      <div className="p-5 md:p-6 border-t border-wd-gold/25">
        <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-gold block mb-2">
          {member.role}
        </span>

        <h3 className="font-display text-[clamp(24px,2.6vw,32px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-text mb-4">
          {member.name}
        </h3>

        {/* Editorial spec rows */}
        <div className="mb-5 border-t border-b border-wd-border/60 py-3 space-y-1.5">
          {member.specs.map((spec) => (
            <div key={spec.label} className="flex items-baseline gap-3">
              <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-muted w-[56px] flex-shrink-0">
                {spec.label}
              </span>
              <span className="font-sans text-[12.5px] text-wd-text/90 leading-[1.35]">
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
        className="relative py-[clamp(72px,10vw,120px)] px-[clamp(16px,4vw,72px)] overflow-hidden"
      >
        <div className="relative max-w-[1600px] mx-auto">
          <motion.div
            ref={headerRef}
            className="mb-10 md:mb-14"
            initial={{ opacity: 0, y: 36 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-wd-gold mb-4">
              04 / Team
            </div>
            <h2 className="font-display text-[clamp(36px,5.5vw,76px)] uppercase leading-[0.95] tracking-[-0.025em] text-wd-text">
              Who we are.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1200px]">
            {team.map((member, i) => (
              <TeamCard
                key={member.name}
                member={member}
                index={i}
                onReadArticle={() => setShowArticle(true)}
              />
            ))}
          </div>
        </div>
      </section>

      {showArticle && <ArticleModal onClose={() => setShowArticle(false)} />}
    </>
  );
}
