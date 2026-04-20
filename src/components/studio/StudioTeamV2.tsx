"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ArticleModal from "./ArticleModal";

interface TeamMemberData {
  name: string;
  role: string;
  image: string;
  bio: string;
  hasArticle: boolean;
  linkedin: string;
}

const team: TeamMemberData[] = [
  {
    name: "Ty Linegar",
    role: "Co-Founder & Executive Producer",
    image: "/team-ty.jpg",
    bio: "A decade producing campaigns for the world\u2019s biggest brands. Good work, great clients, but Ty wanted to apply the craft to something with more weight. War Desk Studio exists to serve the companies actually pushing Western capability forward.",
    hasArticle: true,
    linkedin: "#",
  },
  {
    name: "Sean Gilfillan",
    role: "Co-Founder & Partner",
    image: "/team-sean.jpg",
    bio: "Ex-Pentagon strategist. US diplomat. Bronze Star veteran. Former CMO at Boeing and Viasat\u2019s $1B government division. Founded BaseFEST. 12 years Army, 15 months in Iraq. He\u2019s been on both sides, building campaigns for defense giants and buying what defense startups sell.",
    hasArticle: false,
    linkedin: "https://www.linkedin.com/in/seangilfillan/",
  },
  {
    name: "Samuel Bennetts",
    role: "Creative Director",
    image: "/team-sam.jpg",
    bio: "20+ years directing and creative-directing across broadcast, live events, and immersive installations. Former creative leadership at ACNE and Toyota. Multi-disciplinary maker across directing, design, VFX, and emerging AI workflows.",
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
    >
      {/* Portrait */}
      <div className="relative aspect-[4/5] mb-5 overflow-hidden bg-wd-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.image}
          alt={member.name}
          className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
        />
        <span className="absolute top-3 left-4 font-mono text-[10px] tracking-[0.3em] text-white/50">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Role */}
      <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-wd-gold block mb-2">
        {member.role}
      </span>

      {/* Name */}
      <h3 className="font-display text-[clamp(22px,2.5vw,30px)] uppercase leading-[0.95] tracking-[-0.02em] text-wd-text mb-4">
        {member.name}
      </h3>

      {/* Bio */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-[1200px]">
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
