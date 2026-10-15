"use client";

import { useEffect } from "react";
import StudioNav from "@/components/studio/StudioNav";
import StudioHero from "@/components/studio/StudioHero";
import StudioOffer from "@/components/studio/StudioOffer";
import StudioBrands from "@/components/studio/StudioBrands";
import StudioCrew from "@/components/studio/StudioCrew";
import StudioContact from "@/components/studio/StudioContact";
import StudioFooter from "@/components/studio/StudioFooter";

// The page runs like a film: a cold open that is the reel, what the studio does, the end
// credits, the crew, then a person to call. (Direction from the Oct 2026 research
// report "Bespoke studio website design".) The roll call of films (StudioWork) is off the
// page: it replayed the reel's own films straight after the reel. It stays in the repo.
// The reel player is mounted by the nav, so "Work" opens it on every page that has the nav.

// Shared studio page body. `scrollTo` is the section id to land on at mount
// (used by the /credits deep-link route). Falls back to the URL hash so
// /studio#credits-style links work too. Intent comes from a prop, not the
// pathname, so it survives the App Router's production URL normalization.
export default function StudioPageContent({
  scrollTo,
}: {
  scrollTo?: string;
}) {
  useEffect(() => {
    const target =
      scrollTo || (window.location.hash ? window.location.hash.slice(1) : "");
    if (!target) return;
    const NAV = 64; // clear the fixed nav
    const prevRestoration =
      "scrollRestoration" in history ? history.scrollRestoration : null;
    // Stop the App Router from restoring scroll to top while we position.
    if (prevRestoration) history.scrollRestoration = "manual";

    let id = 0;
    let done = false;
    const start = Date.now();

    const stop = () => {
      if (done) return;
      done = true;
      clearTimeout(id);
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("touchstart", onIntent);
      window.removeEventListener("keydown", onIntent);
      window.removeEventListener("pointerdown", onIntent);
      // Hand scroll behaviour back to the browser.
      if (prevRestoration) history.scrollRestoration = prevRestoration;
    };
    // The moment the user tries to move, stop fighting them.
    const onIntent = () => stop();

    const tick = () => {
      if (done) return;
      const el = document.getElementById(target);
      if (el) {
        const top = el.getBoundingClientRect().top;
        // Close enough? Landed — let go immediately.
        if (Math.abs(top - NAV) < 40) {
          stop();
          return;
        }
        window.scrollTo({
          top: Math.max(0, top + window.scrollY - NAV),
          behavior: "auto",
        });
      }
      // Only keep nudging briefly while the hero/sections settle.
      if (Date.now() - start < 1500) {
        id = window.setTimeout(tick, 120);
      } else {
        stop();
      }
    };

    window.addEventListener("wheel", onIntent, { passive: true });
    window.addEventListener("touchstart", onIntent, { passive: true });
    window.addEventListener("keydown", onIntent);
    window.addEventListener("pointerdown", onIntent);
    id = window.setTimeout(tick, 60);

    return stop;
  }, [scrollTo]);

  return (
    <div className="wd-app">
      <StudioNav />
      <main>
        <StudioHero />
        <StudioOffer />
        <StudioBrands />
        <StudioCrew />
        <StudioContact />
      </main>
      <StudioFooter />
    </div>
  );
}
