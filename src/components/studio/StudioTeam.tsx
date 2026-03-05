"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import ArticleModal from "./ArticleModal";

const team = [
  {
    name: "Ty Linegar",
    role: "Co-Founder & Executive Producer",
    image: "/team-ty.jpg",
    bio: "A decade producing campaigns for the world\u2019s biggest brands. Good work, great clients \u2014 but Ty wanted to apply the craft to something with more weight. War Desk Studio exists to serve the companies actually pushing Western capability forward: defense, aerospace, space, energy, autonomy. The work that matters. Based in Los Angeles.",
    hasArticle: true,
    linkedin: "#",
  },
  {
    name: "Sean Gilfillan",
    role: "Co-Founder & Partner",
    image: "/team-sean.jpg",
    bio: "Ex-Pentagon strategist. US diplomat. Bronze Star veteran. Former CMO at Boeing (VC/M&A) and Viasat\u2019s $1B government division. Founded BaseFEST, the largest music festival on military bases. 12 years Army, 15 months in Iraq. Sean\u2019s been on both sides \u2014 building campaigns for defense giants and buying what defense startups sell. Now helping hard tech founders tell stories that land.",
    hasArticle: false,
    linkedin: "https://www.linkedin.com/in/seangilfillan/",
  },
];

export default function StudioTeam() {
  const [showArticle, setShowArticle] = useState(false);

  return (
    <>
      <section
        id="team"
        className="py-[clamp(56px,9vw,110px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto"
      >
        <Reveal>
          <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
            The Team
          </div>
          <h2 className="font-serif text-[clamp(28px,3.8vw,42px)] font-normal text-wd-text leading-[1.1] mb-3">
            The Team
          </h2>
          <p className="font-sans text-[clamp(14px,1.4vw,16px)] font-light text-wd-sub leading-[1.65] max-w-[600px] mb-10">
            We&apos;ve spent careers mastering the craft. Now we&apos;re
            pointing it at the companies advancing Western capability.
          </p>
        </Reveal>

        <div className="space-y-4">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={0.07 * i}>
              <div className="bg-wd-card border border-wd-border rounded-[14px] p-6 md:p-8 flex gap-6 items-start max-[640px]:flex-col hover:border-wd-border-hov transition-colors">
                {/* Headshot */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-xl text-wd-text mb-0.5">
                    {member.name}
                  </h3>
                  <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-wd-gold mb-3">
                    {member.role}
                  </div>
                  <p className="font-sans text-sm text-wd-sub leading-[1.7] mb-4">
                    {member.bio}
                  </p>
                  <div className="flex gap-4 items-center">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[10px] tracking-[0.05em] text-wd-muted hover:text-wd-text transition-colors"
                      >
                        LinkedIn &rarr;
                      </a>
                    )}
                    {member.hasArticle && (
                      <button
                        onClick={() => setShowArticle(true)}
                        className="font-mono text-[10px] tracking-[0.05em] text-wd-gold hover:text-wd-text transition-colors bg-transparent border-none p-0 cursor-pointer"
                      >
                        Read Manifesto &rarr;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {showArticle && (
        <ArticleModal onClose={() => setShowArticle(false)} />
      )}
    </>
  );
}
