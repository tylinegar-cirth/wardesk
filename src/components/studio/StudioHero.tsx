"use client";

import ChromaticEcho from "@/components/ui/ChromaticEcho";
import ShockStations from "@/components/transonic/ShockStations";
import { openReel, REEL_LENGTH } from "@/components/studio/ReelModal";

// Cold open. One still of defense hardware fades up in a 2.39:1 band, so the page itself is the
// letterbox. Then the title lands a word at a time, and its shocks bend the picture behind it
// (TRANSONIC, cut). The consumer work lives inside the reel, where its captions say whose it is,
// so the front page of a defense studio doesn't open on car brands nobody has explained yet.
// The one action is the reel, and after the title it is the biggest thing on the screen.
const STILL = "/hero-still.jpg";
// Phones show a tall crop of the still; this keeps the aircraft in it. The shock engine reads
// the same object-position, so the bent picture stays registered with the one on the page.
const PICTURE = "absolute inset-0 w-full h-full object-cover object-[88%_50%] md:object-center";

export default function StudioHero() {
  return (
    <section
      aria-label="War Desk Studio"
      className="relative h-[100svh] min-h-[560px] bg-wd-bg flex flex-col justify-center overflow-hidden"
    >
      {/* The picture: scope on desktop, a taller crop on phones */}
      <div data-transonic-band className="relative w-full h-[62svh] md:h-auto md:aspect-[2.39/1] md:max-h-[calc(100svh-150px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STILL} alt="" aria-hidden="true" decoding="async" className={`wd-cold-picture ${PICTURE}`} />
        {/* The shock engine takes its picture from a video element (or its poster while the video
            loads). This one never loads, plays or shows: it carries the still as its poster and
            the same fade, so the shocks bend exactly what is on the page. */}
        <video
          poster={STILL}
          preload="none"
          muted
          playsInline
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          className={`wd-cold-picture invisible ${PICTURE}`}
        />
        {/* Grade the corner the title sits in, nothing else. It runs 1px past the picture's
            bottom edge: at fractional band heights the picture is drawn through the last device
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
          <ReelButton className="hidden md:inline-flex mb-2" />
        </div>
      </div>

      {/* Lower letterbox: the reel on phones, then what the studio is, in one line */}
      <div className="wd-cold-after absolute inset-x-[clamp(20px,5vw,72px)] bottom-[clamp(16px,3.2vh,34px)] flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-6">
        <ReelButton className="flex md:hidden w-full justify-center" />
        <p className="font-sans text-[14px] md:text-[15px] text-wd-bone/60 max-w-[760px]">
          Films and content for defense, aerospace, and hard tech. El Segundo, California.
        </p>
      </div>
    </section>
  );
}

// The one action on the cold open: the reel, with sound. Big, plain and unmissable.
function ReelButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openReel}
      aria-label={`Watch the reel, ${REEL_LENGTH}, with sound`}
      className={`wd-cold-after group shrink-0 items-center gap-4 h-[56px] md:h-[60px] pl-[9px] pr-6 border border-wd-bone/60 bg-[rgba(10,10,12,0.4)] backdrop-blur-[6px] text-wd-bone transition-colors duration-200 hover:bg-wd-bone hover:border-wd-bone hover:text-wd-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wd-gold ${className}`}
    >
      <span
        aria-hidden="true"
        className="grid place-items-center w-[38px] h-[38px] md:w-[42px] md:h-[42px] rounded-full bg-wd-gold text-wd-bg"
      >
        <svg viewBox="0 0 12 12" className="w-[13px] h-[13px] translate-x-[1px]">
          <path d="M2.5 1.3v9.4L10.6 6z" fill="currentColor" />
        </svg>
      </span>
      <span className="font-mono font-medium uppercase tracking-[0.18em] text-[13px] md:text-[14px]">Watch the reel</span>
      <span className="font-mono tracking-[0.08em] text-[13px] md:text-[14px] opacity-60">{REEL_LENGTH}</span>
    </button>
  );
}
