import Link from "next/link";
import BoomUnderline from "@/components/transonic/BoomUnderline";

// The crew credit that follows the billing block: role over name, like a film's
// end credits. Credentials are the studio's existing trust lines.
const CREW = [
  {
    role: "Executive Producer",
    name: "Ty Linegar",
    line: "A decade producing national campaigns for Chevrolet, Spotify, Amazon, and LinkedIn.",
  },
  {
    role: "Creative Director",
    name: "Samuel Bennetts",
    line: "Twenty years directing broadcast, live events, and immersive work. Former creative leadership at ACNE and Toyota.",
  },
];

export default function StudioCrew() {
  return (
    <section
      id="crew"
      aria-label="Crew"
      className="relative bg-wd-bg px-[clamp(20px,5vw,72px)] pt-[clamp(40px,6vw,80px)] pb-[clamp(96px,12vw,170px)] text-center"
    >
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
        {CREW.map((c) => (
          <div key={c.name}>
            <div className="font-sans text-[11px] uppercase tracking-[0.16em] text-wd-bone/55">{c.role}</div>
            <div className="font-display uppercase text-wd-bone leading-[0.95] tracking-[-0.025em] text-[clamp(26px,2.9vw,44px)] mt-3 whitespace-nowrap">
              {c.name}
            </div>
            <p className="font-sans text-[15px] leading-[1.6] text-wd-bone/60 max-w-[380px] mx-auto mt-4">{c.line}</p>
          </div>
        ))}
      </div>

      <div className="max-w-[1000px] mx-auto mt-16">
        <div className="font-sans text-[11px] uppercase tracking-[0.16em] text-wd-bone/55">Production</div>
        <p className="font-sans text-[15px] leading-[1.6] text-wd-bone/60 mt-3">
          DPs, editors, motion designers, and sound, crewed to every shoot day.
        </p>
      </div>

      <p className="font-sans text-[15px] text-wd-bone/60 mt-[clamp(56px,7vw,96px)]">
        Why we started the studio:{" "}
        <Link
          href="/studio/essays/the-meaning-problem"
          className="font-serif italic text-[19px] text-wd-bone transition-colors"
        >
          <BoomUnderline variant="shaped">The Meaning Problem</BoomUnderline>
        </Link>
      </p>
    </section>
  );
}
