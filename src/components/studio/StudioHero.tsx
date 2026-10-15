"use client";

import { useEffect, useRef } from "react";
import ChromaticEcho from "@/components/ui/ChromaticEcho";
import ShockStations from "@/components/transonic/ShockStations";
import BoomUnderline from "@/components/transonic/BoomUnderline";
import { openReel, REEL_LENGTH } from "@/components/studio/ReelModal";

// Cold open. The picture fades up in a 2.39:1 band, so the page itself is the letterbox.
// Then the title lands a word at a time, and as each word lands the shocks on its full stop
// snap out of the dot and bend the picture behind it (TRANSONIC: shocks stand on the full
// stop). They hold while the title is on screen and grow when the page moves fast. The echo
// on WAR. comes alive as it lands. Sound is one plain action, and its underline carries
// the boom.
const ROLL_AT_MS = 700;

export default function StudioHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // The picture holds on its first frame while it fades up, then rolls, so the truck's grille
    // fills the frame just as WAR. lands and its shocks have something to bend.
    const roll = window.setTimeout(() => v.play().catch(() => {}), ROLL_AT_MS);
    const onVis = () => {
      if (!document.hidden && v.paused && performance.now() > ROLL_AT_MS) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearTimeout(roll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section
      aria-label="War Desk Studio"
      className="relative h-[100svh] min-h-[560px] bg-wd-bg flex flex-col justify-center overflow-hidden"
    >
      {/* The picture: scope on desktop, a taller crop on phones */}
      <div data-transonic-band className="relative w-full h-[68svh] md:h-auto md:aspect-[2.39/1] md:max-h-[calc(100svh-150px)]">
        <video
          ref={videoRef}
          src="/hero-scope.mp4"
          poster="/hero-scope.jpg"
          preload="auto"
          muted
          loop
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          className="wd-cold-picture absolute inset-0 w-full h-full object-cover"
        />
        {/* Grade the corner the title sits in, nothing else. It runs 1px past the picture's
            bottom edge: at fractional band heights the video is drawn through the last device
            pixel row and the grade stops short of it, which left a bright hairline. */}
        <div
          aria-hidden="true"
          data-transonic-scrim
          className="absolute inset-x-0 top-0 -bottom-px pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,12,0.78) 0%, rgba(10,10,12,0.28) 34%, transparent 58%), linear-gradient(to right, rgba(10,10,12,0.5) 0%, transparent 48%)",
          }}
        />

        <div className="absolute inset-x-[clamp(20px,5vw,72px)] bottom-[clamp(20px,4vw,52px)] flex items-end justify-between gap-10">
          <ShockStations>
            <h1 className="wd-shock-arm font-display font-semibold uppercase text-wd-bone leading-[0.86] tracking-[-0.035em] text-[clamp(52px,9vw,156px)]">
              <span data-word>Business.</span>
              <br />
              <span data-word>Is.</span>{" "}
              <span data-word="payoff">
                <ChromaticEcho className="text-wd-gold">War.</ChromaticEcho>
              </span>
            </h1>
          </ShockStations>
          <button
            type="button"
            onClick={openReel}
            className="wd-cold-after hidden md:inline-block shrink-0 mb-3 font-sans text-[15px] text-wd-bone/85 hover:text-wd-bone transition-colors"
          >
            <BoomUnderline variant="n">Watch with sound, {REEL_LENGTH}</BoomUnderline>
          </button>
        </div>
      </div>

      {/* Lower letterbox: what the studio is, in one line */}
      <div className="wd-cold-after absolute inset-x-[clamp(20px,5vw,72px)] bottom-[clamp(16px,3.2vh,34px)] flex items-baseline justify-between gap-6">
        <p className="font-sans text-[14px] md:text-[15px] text-wd-bone/60 max-w-[760px]">
          Films and content for defense, aerospace, and hard tech. El Segundo, California.
        </p>
        <button
          type="button"
          onClick={openReel}
          className="md:hidden shrink-0 font-sans text-[14px] text-wd-bone/85"
        >
          <BoomUnderline variant="n">Watch, {REEL_LENGTH}</BoomUnderline>
        </button>
      </div>
    </section>
  );
}
