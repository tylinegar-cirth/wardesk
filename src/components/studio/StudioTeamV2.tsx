"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ArticleModal from "./ArticleModal";

const team = [
  {
    name: "Ty Linegar",
    role: "Co-Founder & Executive Producer",
    image: "/team-ty.jpg",
    bio: "A decade producing campaigns for the world\u2019s biggest brands. Good work, great clients \u2014 but Ty wanted to apply the craft to something with more weight. War Desk Studio exists to serve the companies actually pushing Western capability forward.",
    credentials: ["National Campaigns", "Brand Strategy", "Los Angeles"],
    hasArticle: true,
    linkedin: "#",
  },
  {
    name: "Sean Gilfillan",
    role: "Co-Founder & Partner",
    image: "/team-sean.jpg",
    bio: "Ex-Pentagon strategist. US diplomat. Bronze Star veteran. Former CMO at Boeing and Viasat\u2019s $1B government division. Founded BaseFEST. 12 years Army, 15 months in Iraq. He\u2019s been on both sides \u2014 building campaigns for defense giants and buying what defense startups sell.",
    credentials: ["Pentagon", "Boeing", "Viasat", "Bronze Star", "Army"],
    hasArticle: false,
    linkedin: "https://www.linkedin.com/in/seangilfillan/",
  },
  {
    name: "Samuel Bennetts",
    role: "Creative Director",
    image: "/team-sam.jpg",
    bio: "20+ years directing and creative-directing across broadcast, live events, and immersive installations. Former creative leadership at ACNE and Toyota. Multi-disciplinary maker across directing, design, VFX, and emerging AI workflows.",
    credentials: ["Toyota", "Ferrari", "Audi", "Starlink", "Coca-Cola", "Shell"],
    hasArticle: false,
    linkedin: "#",
  },
];

function TeamMember({
  member,
  index,
  onReadArticle,
}: {
  member: (typeof team)[0];
  index: number;
  onReadArticle: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0 items-stretch ${
        index > 0 ? "mt-1" : ""
      }`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.9,
        delay: 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[480px] ${
          isReversed ? "lg:order-2" : "lg:order-1"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.image}
          alt={member.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle gradient overlay at bottom for mobile */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, transparent 50%, rgba(8,8,10,0.8) 100%)",
          }}
        />
        {/* Side gradient for desktop — fades into text area */}
        <div
          className={`absolute inset-0 hidden lg:block ${
            isReversed ? "scale-x-[-1]" : ""
          }`}
          style={{
            background:
              "linear-gradient(90deg, transparent 60%, rgb(var(--wd-bg)) 100%)",
          }}
        />
        {/* Member number watermark */}
        <div
          className={`absolute top-6 font-mono text-[11px] tracking-[0.3em] uppercase opacity-40 text-white ${
            isReversed ? "right-6 lg:left-6 lg:right-auto" : "left-6"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Content */}
      <div
        className={`relative flex flex-col justify-center py-10 px-6 lg:py-16 lg:px-14 ${
          isReversed ? "lg:order-1" : "lg:order-2"
        }`}
      >
        {/* Role */}
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-wd-gold mb-4 block">
          {member.role}
        </span>

        {/* Name */}
        <h3 className="font-serif text-[clamp(32px,4vw,48px)] font-normal text-wd-text leading-[1.05] mb-6">
          {member.name}
        </h3>

        {/* Bio */}
        <p className="font-sans text-[15px] text-wd-sub leading-[1.75] mb-7 max-w-[440px]">
          {member.bio}
        </p>

        {/* Credential tags */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          {member.credentials.map((cred) => (
            <span
              key={cred}
              className="font-mono text-[8px] tracking-[0.15em] uppercase py-1 px-2.5 rounded border border-wd-border text-wd-muted"
            >
              {cred}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-6 items-center">
          {member.linkedin && member.linkedin !== "#" && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-text transition-colors duration-300"
            >
              LinkedIn &rarr;
            </a>
          )}
          {member.hasArticle && (
            <button
              onClick={onReadArticle}
              className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-gold hover:text-wd-text transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer"
            >
              Read Manifesto &rarr;
            </button>
          )}
        </div>

        {/* Subtle decorative line */}
        <div
          className={`absolute bottom-0 h-px ${
            isReversed ? "right-0 left-14" : "left-0 right-14"
          }`}
          style={{
            background: isReversed
              ? "linear-gradient(90deg, rgba(255,255,255,0.04), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.04))",
          }}
        />
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
      <section id="team" className="relative py-[clamp(64px,10vw,120px)]">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
            Who We Are
          </div>
          <h2 className="font-serif text-[clamp(28px,4vw,48px)] font-normal text-wd-text leading-[1.08] max-w-[500px]">
            The Team
          </h2>
        </motion.div>

        {/* Team members — full bleed */}
        <div className="max-w-[1400px] mx-auto">
          {team.map((member, i) => (
            <TeamMember
              key={member.name}
              member={member}
              index={i}
              onReadArticle={() => setShowArticle(true)}
            />
          ))}
        </div>
      </section>

      {showArticle && (
        <ArticleModal onClose={() => setShowArticle(false)} />
      )}
    </>
  );
}
