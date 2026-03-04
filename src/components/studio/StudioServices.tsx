"use client";

import Reveal from "@/components/ui/Reveal";

const flagshipTags = [
  "Strategy",
  "Design",
  "Fabrication",
  "Video Walls",
  "Content",
  "On-site Support",
];

const services = [
  {
    icon: (
      <svg className="w-8 h-8 text-wd-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    title: "Brand Films",
    desc: "Recruitment films, capability videos, founder stories. Cinematic content that matches the gravity of what you\u2019re building.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-wd-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
      </svg>
    ),
    title: "Campaigns",
    desc: "Go-to-market support for defense tech. Positioning, messaging, and content strategy built for serious buyers.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-wd-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    title: "Investor Content",
    desc: "Pitch videos, sizzle reels, and investor materials that communicate traction and vision.",
  },
];

export default function StudioServices() {
  return (
    <section
      id="services"
      className="py-[clamp(56px,9vw,110px)] px-[clamp(20px,5vw,72px)] max-w-[1240px] mx-auto"
    >
      <Reveal>
        <div className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          What We Do
        </div>
        <h2 className="font-serif text-[clamp(28px,3.8vw,42px)] font-normal text-wd-text leading-[1.1] mb-3">
          Own the floor at every conference
        </h2>
        <p className="font-sans text-[clamp(14px,1.4vw,16px)] font-light text-wd-sub leading-[1.65] max-w-[560px] mb-10">
          Your booth is where deals close. We build the presence your pipeline
          deserves — then keep that momentum going year-round.
        </p>
      </Reveal>

      {/* Flagship card */}
      <Reveal delay={0.07}>
        <div className="bg-wd-surface border border-wd-border rounded-2xl p-[clamp(28px,4vw,48px)] mb-8">
          <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-gold mb-3">
            Flagship Offering
          </div>
          <h3 className="font-serif text-[clamp(22px,2.8vw,32px)] font-normal text-wd-text leading-[1.15] mb-3">
            Roadshow & Booth Production
          </h3>
          <p className="font-sans text-sm text-wd-sub leading-[1.7] max-w-[600px] mb-6">
            AUSA. SOFIC. Space Symposium. Sea-Air-Space. These are the rooms
            where contracts start. We produce booth experiences built for market
            leaders — video walls, demo environments, collateral, and the
            content to drive them.
          </p>
          <div className="flex flex-wrap gap-2">
            {flagshipTags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] tracking-[0.08em] uppercase py-[5px] px-3 border border-wd-border text-wd-muted rounded-md bg-wd-overlay/[0.02]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Service cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((svc, i) => (
          <Reveal key={svc.title} delay={0.14 + i * 0.07}>
            <div className="bg-wd-card border border-wd-border rounded-[14px] p-6 hover:border-wd-border-hov transition-colors h-full">
              <div className="mb-4">{svc.icon}</div>
              <h4 className="font-serif text-lg text-wd-text mb-2">
                {svc.title}
              </h4>
              <p className="font-sans text-sm text-wd-sub leading-relaxed">
                {svc.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
