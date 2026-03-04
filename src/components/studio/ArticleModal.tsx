"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ArticleModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[32px]"
        style={{ WebkitBackdropFilter: "blur(32px) saturate(0.7)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[680px] max-h-[90vh] bg-wd-surface border border-wd-border rounded-[20px] overflow-auto shadow-[0_32px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(var(--wd-overlay),0.04)]"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-wd-surface/95 backdrop-blur-[12px] border-b border-wd-border px-8 py-5 flex items-center justify-between">
            <div>
              <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-wd-gold mb-1">
                Why We Built War Desk Studio
              </div>
              <h2 className="font-serif text-[22px] text-wd-text">
                The Meaning Problem
              </h2>
            </div>
            <button
              onClick={onClose}
              className="bg-wd-overlay/5 border border-wd-border rounded-[10px] w-[34px] h-[34px] text-wd-muted text-base flex items-center justify-center transition-all duration-200 hover:bg-wd-overlay/10 hover:text-wd-text hover:scale-105 flex-shrink-0"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="font-mono text-[10px] text-wd-muted mb-8">
              By Ty Linegar
            </div>

            <div className="font-sans text-sm text-wd-sub leading-[1.8] space-y-5">
              <p>
                I&apos;ve spent years working on national brand campaigns. Big
                brands, real budgets, the kind of work that looks impressive in a
                portfolio. And the job, if I&apos;m honest about it, was always
                the same: find the meaning.
              </p>

              <p>The problem is that for most consumer products, there isn&apos;t any.</p>

              <p>
                Hair product. Soda. Insurance... A drop in an ocean of
                competitors who do it just as well for roughly the same price. So
                our job is to manufacture meaning. Build mythology. Attach the
                product to identity — to aspiration, to belonging. You make
                people feel like buying this particular thing says something about
                who they are.
              </p>

              <p>
                It works. That&apos;s the craft, and there&apos;s real skill in it.
                But there&apos;s also a hollow center to the whole enterprise that
                you learn to stop noticing. You&apos;re building on nothing. The
                brand is the product because there&apos;s no other
                differentiation. The story you&apos;re telling isn&apos;t a story
                about anything real.
              </p>

              <p>
                I don&apos;t think this is evil. It&apos;s just the logic of consumer
                markets. When the thing itself doesn&apos;t matter much, the
                narrative has to do all the work.
              </p>

              <p>
                But it&apos;s exhausting. And after enough years, you start to
                wonder what it would feel like to tell a story that was already
                true.
              </p>

              {/* Divider */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-0.5 bg-wd-gold/30 rounded-full" />
              </div>

              <p>
                There&apos;s a different economy emerging, and a lot of it runs
                through El Segundo.
              </p>

              <p>
                Not the El Segundo of aerospace&apos;s old guard, though
                that&apos;s part of the DNA. Something newer. The SpaceX
                diaspora. Defense tech startups. Companies building power
                systems, satellites, autonomous platforms, infrastructure that
                matters. Hard tech.
              </p>

              <p>
                These founders are a different species. They&apos;re not
                optimizing for the next funding round or trying to capture
                attention in a crowded market. They&apos;re building things
                because they believe those things need to exist. For national
                security. For energy independence. For the kind of future where
                humanity becomes more capable rather than just more connected.
              </p>

              <p>
                The stakes are different. The buyers are different. A defense
                procurement officer evaluates on substance. Whether your system
                works, whether your team can deliver, whether you understand
                their constraints. But they&apos;re also human. They chose their
                career for a reason. They believe in something. Campaigns should
                make them feel the weight of what a founder has built and connect
                them to the mission.
              </p>

              <p>
                And the founders themselves are serious in a way that&apos;s
                become rare. Many are Faustian idealists who have dedicated their
                souls to advancing civilization. Many of them left comfortable
                careers because they thought something important wasn&apos;t
                getting built.
              </p>

              {/* Divider */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-0.5 bg-wd-gold/30 rounded-full" />
              </div>

              <p>
                Here&apos;s the mismatch: traditional agencies are optimized for
                consumer brands.
              </p>

              <p>
                Their playbooks, their instincts, their talent pipelines are all
                built for a world where the job is manufacturing meaning.
                Creating desire. Making people feel something about products that
                don&apos;t inherently matter.
              </p>

              <p>
                Bring that machinery to hard tech and it doesn&apos;t just
                underperform. It actively damages.
              </p>

              <p>
                The slick campaign that would crush it for a DTC brand reads as
                unserious to a defense buyer. The brand voice that sounds
                &quot;authentic&quot; in consumer markets sounds performative and
                cringe to engineers. The agency&apos;s instinct to lead with
                emotion over substance is exactly backwards for an audience that
                needs to trust the specs before they&apos;ll trust the story.
              </p>

              <p>
                When a founder who is solving nuclear waste storage or building
                better missile defense systems encounters an agency that wants to
                spend weeks deconstructing &quot;brand purpose&quot;, there&apos;s
                a disconnect that can&apos;t be bridged by a better pitch deck.
              </p>

              {/* Divider */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-0.5 bg-wd-gold/30 rounded-full" />
              </div>

              <p>
                What&apos;s driving me though isn&apos;t just an opportunity to
                correct what agencies get wrong, it&apos;s the sense of the
                divine possible when you get it right. Amplifying an undeniable
                force through story and content is an incredibly fulfilling
                promise.
              </p>

              <p>
                When I look at this industry, I see a company cloud seeding to
                transform barren desert wastelands into thriving green
                landscapes. Teams building the infrastructure for humanity to
                reach other worlds. Startups engineering power systems that could
                reshape civilization. Otherworldly defense technology protecting
                the people and values that make any of this possible.
              </p>

              <p>
                This isn&apos;t just technically impressive. It&apos;s beautiful.
                There&apos;s genuine cinematic weight to what&apos;s being built.
                The raw material is better than anything a consumer brand could
                dream of.
              </p>

              <p>
                The problem with traditional agencies isn&apos;t that they lack
                craft and creativity. It&apos;s that their craft and creativity is
                in service of nothing. When you&apos;re selling shampoo, you have
                to manufacture feeling from a void. Hard tech is the inverse. The
                feeling is earned. The story is already true. Which means the
                creative work stops being manipulation and becomes finally worthy
                of itself, as genuine meaning given form.
              </p>

              {/* Divider */}
              <div className="flex justify-center py-3">
                <div className="w-12 h-0.5 bg-wd-gold/30 rounded-full" />
              </div>

              <p>
                This IS a new frontier, and we are watching the early innings of
                something civilizationally significant. A generation of builders
                focused on energy, defense, space, infrastructure — the kind of
                work that actually moves the needle on what humanity is capable
                of.
              </p>

              <p>
                This movement deserves storytelling that takes it seriously. Not
                the hollow machinery of consumer marketing. Not performance. Not
                manufactured meaning.
              </p>

              <p>
                Something that matches the ambition of what&apos;s being built.
                That captures the weight of it. That makes people feel
                what&apos;s true.
              </p>

              <p className="font-medium text-wd-gold">
                The substance is finally worthy of the craft. That&apos;s what
                War Desk Studio is built for.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
