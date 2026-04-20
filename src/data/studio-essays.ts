export interface EssayBlock {
  type: "p" | "h2" | "pull" | "divider";
  text?: string;
}

export interface Essay {
  slug: string;
  title: string;
  subtitle?: string;
  /** Short line above the title. Optional — only include when it comes from
   *  the source material, never invented. */
  kicker?: string;
  author: string;
  date: string;
  readingTime: string;
  summary: string;
  pullQuote: string;
  bgWord: string;
  blocks: EssayBlock[];
}

export const essays: Essay[] = [
  {
    slug: "the-meaning-problem",
    title: "The Meaning Problem",
    kicker: "Why we built War Desk Studio",
    author: "Ty Linegar",
    date: "April 2026",
    readingTime: "6 min read",
    summary:
      "Consumer brands manufacture meaning from a void. Hard tech is the inverse. The feeling is earned. The story is already true.",
    pullQuote: "The substance is finally worthy of the craft.",
    bgWord: "MEANING",
    blocks: [
      {
        type: "p",
        text: "I\u2019ve spent years working on national brand campaigns. Big brands, real budgets, the kind of work that looks impressive in a portfolio. And the job was always the same: find the meaning.",
      },
      {
        type: "p",
        text: "The problem is that for most consumer products, there isn\u2019t any. Hair product. Soda. Insurance. A thousand competitors doing the same thing for the same price. So the job is to manufacture meaning. Build mythology. Attach the product to identity, to aspiration, to belonging. Make people feel like buying this particular thing says something about who they are.",
      },
      {
        type: "p",
        text: "That\u2019s the craft, it sells, and there is real skill in it. But there\u2019s a hollow center to the whole enterprise that was always hard to tune out. You\u2019re building on nothing. The brand is the product because there\u2019s no other differentiation. The story you\u2019re telling isn\u2019t a story about anything real. I don\u2019t think this is inherently evil. It\u2019s just the logic of consumer markets. When the thing itself doesn\u2019t matter much, the narrative has to do all the work. And after enough years, you start to wonder what it would feel like to tell a story that was already true.",
      },
      { type: "divider" },
      {
        type: "p",
        text: "There\u2019s a different economy emerging, and a lot of it runs through El Segundo. Defense tech startups. Companies building satellites, autonomous platforms, power systems, infrastructure that matters. Hard tech. These founders are a different species. They\u2019re building things because they believe those things need to exist. For national security. For energy independence. For the kind of future where humanity becomes more capable rather than just more connected.",
      },
      {
        type: "p",
        text: "The stakes are different. The buyers are different. A defense procurement officer evaluates on substance. Whether your system works, whether your team can deliver, whether you understand their constraints. They\u2019re also human. They chose their career for a reason. They believe in something. Campaigns should make them feel the weight of what a founder has built and connect them to the mission.",
      },
      {
        type: "p",
        text: "And the founders themselves are serious. Many are Faustian idealists who have dedicated their souls to advancing civilization. Many of them left comfortable careers because they thought something important wasn\u2019t getting built. There\u2019s an inherent mismatch between these companies and the agencies that should serve them.",
      },
      { type: "divider" },
      {
        type: "p",
        text: "Traditional agencies are optimized for consumer brands. Their playbooks, their instincts, their talent pipelines are built for a world where the job is manufacturing meaning. Creating desire. Making people feel something about products that are interchangeable. Bring that machinery to hard tech and it actively damages. The slick campaign that would crush it for a DTC brand reads as unserious to a defense buyer. The brand voice that sounds \u201cauthentic\u201d in consumer markets sounds performative and cringe to engineers. The agency\u2019s instinct to lead with emotion over substance is exactly backwards for an audience that needs to trust the specs before they\u2019ll trust the story.",
      },
      {
        type: "p",
        text: "When a founder solving nuclear waste storage or building better missile defense encounters an agency that wants to spend weeks deconstructing \u201cbrand purpose,\u201d there\u2019s a disconnect that can\u2019t be bridged by a better pitch deck. What\u2019s driving me though isn\u2019t just an opportunity to correct what agencies get wrong. It\u2019s the sense of the divine possible when you get it right. Amplifying an undeniable force through story and content is an incredibly fulfilling promise.",
      },
      { type: "divider" },
      {
        type: "p",
        text: "When I look at this industry, I see a company cloud seeding to transform barren desert wastelands into thriving green landscapes. Teams building the infrastructure for humanity to reach other worlds. Startups engineering power systems that could reshape civilization. Defense technology with otherworldly capability protecting the people and values that make any of this possible. This is as beautiful on a deep level as it is technically impressive. There\u2019s genuine cinematic weight to what\u2019s being built. The raw material is better than anything a consumer brand could dream of.",
      },
      {
        type: "p",
        text: "The issue with traditional agencies isn\u2019t the absence of craft. The craft is there. It\u2019s that the craft is in service of nothing. When you\u2019re selling shampoo, you have to manufacture feeling from a void. Hard tech is the inverse. The feeling is earned. The story is already true. The creative work is finally worthy of itself \u2014 genuine meaning given form. This is a new frontier, and we are watching the early innings of something civilizationally significant. A generation of builders focused on energy, defense, space, infrastructure, doing the kind of work that actually moves the needle on what humanity is capable of.",
      },
      {
        type: "p",
        text: "This movement deserves storytelling that takes it seriously. Something that matches the ambition of what\u2019s being built. That captures the weight of it. That makes people feel what\u2019s true.",
      },
      {
        type: "pull",
        text: "The substance is finally worthy of the craft. That\u2019s what War Desk Studio is built for. Because Business Is War.",
      },
    ],
  },
  {
    slug: "everyone-has-a-content-guy",
    title: "Everyone Has a Content Guy. That\u2019s the Problem.",
    author: "Ty Linegar",
    date: "April 2026",
    readingTime: "8 min read",
    summary:
      "1,500 drone startups later, when every company\u2019s content is interchangeable, nobody\u2019s content works.",
    pullQuote:
      "The gap in defense tech content isn\u2019t really about production quality. The gap is storytelling.",
    bgWord: "NARRATIVE",
    blocks: [
      {
        type: "p",
        text: "A decade ago, the defense drone conversation was dominated by a handful of platforms from a handful of primes. General Atomics owned the category, the Pentagon was the buyer, and that was more or less the end of it. Today there are nearly 1,500 drone startups in the US alone all competing with each other. Y Combinator alone has backed over a dozen. $49.1 billion in defense tech venture capital was deployed in 2025, and it feels like we\u2019re only halfway up the hockey stick. With that much competition, narrative starts to become incredibly important.",
      },
      {
        type: "p",
        text: "For decades, the defense industry operated on a logic that made content essentially irrelevant. The Department of Defense was a monopsony buyer. Contracts were cost-plus and multigenerational. The competitive set was five or six primes who all knew each other by name. Marketing, to the extent it existed, was congressional testimony, retired generals working trade show booths, and press releases issued after deals had already closed in rooms the public never saw. Raytheon didn\u2019t land the Tomahawk program because they told a better story than General Dynamics. Lockheed didn\u2019t win the F-35 because their brand film hit harder than Boeing\u2019s. Content in defense was a trophy on the shelf, polished after the game was already won.",
      },
      {
        type: "p",
        text: "That world is gone.",
      },
      {
        type: "p",
        text: "The standard telling is that Palantir and Anduril disrupted defense by bringing Silicon Valley energy to the Pentagon. True, but it misses what actually changed. What they revealed was that in a market with more buyers, more competitors, faster cycles, and a new generation of talent making employment decisions the way consumers make brand decisions, content becomes strategic infrastructure.",
      },
      {
        type: "p",
        text: "Alex Karp didn\u2019t run advertising campaigns. He became the most recognizable voice in the defense technology conversation. Every podcast, every book, every public disagreement with Silicon Valley orthodoxy was strategic positioning. Palmer Luckey did the same through product and personal presence. Content became an aspirational core that made us all know instinctively that these companies were inevitable titans before they were. They knew how to build a narrative flywheel that pulled in talent, investors, and buyers simultaneously.",
      },
      {
        type: "p",
        text: "Neither narrative engine was accidental. Neither was built by a freelancer with a camera. They were fully integrated strategies, and the companies that emerged felt like forces of nature. That\u2019s what a real content operation produces.",
      },
      { type: "h2", text: "1,500 drone companies later" },
      {
        type: "p",
        text: "As soon as the Series A closes, there\u2019s a content guy with a RED camera on a test range somewhere in the desert, shooting slow-motion footage of hardware against a mountain backdrop, set to ambient music, cut to 60 seconds. Sometimes there\u2019s a drone shot of a drone.",
      },
      {
        type: "p",
        text: "It looks relatively cinematic. It looks professional. And if you\u2019ve spent any time scrolling through defense tech content in the last two years, you\u2019ve already noticed it all looks more or less the same. In an increasingly competitive landscape, when every company\u2019s content is interchangeable, nobody\u2019s content works.",
      },
      {
        type: "p",
        text: "Some companies understand something the rest don\u2019t. Watch Shield AI\u2019s hardware move through a frame and the pacing alone tells you they operate at a different altitude. Rainmaker\u2019s brand carries a weight that makes you FEEL something before you even understand what they\u2019re building. The difference is perceived on a deeper level immediately, and you can trace that feeling back to one thing: story.",
      },
      {
        type: "pull",
        text: "The gap in defense tech content isn\u2019t really about production quality. The gap is storytelling.",
      },
      {
        type: "p",
        text: "A competent freelancer with a cinema camera can get you 80% of the way to something that looks professional. What is the narrative spine of your company? What is the through-line that makes an engineer at SpaceX feel like joining you is the most important thing they could do with their career? What is the version of your mission that makes a DoD acquisition officer feel the weight of what you\u2019ve built before you\u2019ve walked them through a single spec? That\u2019s where the real creative work lives, and unless you\u2019ve picked up an absolute savant, your camera op isn\u2019t going to get you there.",
      },
      {
        type: "p",
        text: "This is the craft that built Coca-Cola, Nike, Mercedes-Benz, and every Fortune 500 brand that lives rent-free in your head. The ability to find the story inside a company and make it feel inevitable. Consumer brands have to manufacture that story from nothing. In defense tech, the story is already there. The engineering is real, the stakes are real, the mission is real. The raw material is better than anything a consumer brand could dream of. It just needs people who know how to find it and give it form.",
      },
      {
        type: "p",
        text: "To every founder reading this: until now, you couldn\u2019t access the people who do this at the highest level. The directors, creative directors, DPs, and producers who\u2019ve spent careers building campaigns for the world\u2019s biggest brands have been locked inside agencies that won\u2019t touch a defense contract. Fortune 500 creative talent and defense tech have been on opposite sides of a locked door for decades.",
      },
      { type: "h2", text: "The bigger revolution" },
      {
        type: "p",
        text: "If this shift were only happening inside defense tech, it would already be worth paying attention to. The same realization is rippling through the most powerful institutions in technology at the same time.",
      },
      {
        type: "p",
        text: "OpenAI just acquired TBPN, a daily tech talk show that launched in late 2024 and generated $5 million in advertising revenue in its first year. It\u2019s on track to exceed $30 million this year. OpenAI paid hundreds of millions of dollars for the narrative engine \u2014 the ability to shape, every single day, how the most influential audience in technology thinks about AI. Sam Altman bought it because in a world where public perception shapes regulation, talent flows, and partnership dynamics, controlling the conversation is the strategic advantage. Everyone watching that acquisition felt the ground shift.",
      },
      {
        type: "p",
        text: "At the same time, Andreessen Horowitz has been building what amounts to an entire media operation inside a venture capital firm. Podcast studios, video production, long-form writing, events programming, in-house research. They hired Erik Torenberg, who built On Deck and the Turpentine podcast network. They brought on Alex Danco, one of the sharpest technology essayists of the past decade. They launched a New Media Fellowship to train the next generation of media operators. Their recent recruiting push is essentially for a full film and content division. A venture capital firm built a production studio, and it\u2019s the core of how a16z competes for the best founders, shapes the narrative around its portfolio, and defends its position as the most influential firm in technology.",
      },
      {
        type: "p",
        text: "When the most sophisticated capital allocators in the world are investing hundreds of millions of dollars into content and media capabilities, something structural has changed. We\u2019re watching the early stages of a permanent shift in how power is built and defended.",
      },
      { type: "h2", text: "The window" },
      {
        type: "p",
        text: "We\u2019re living through an explosion of well-funded companies competing in overlapping categories. We\u2019ve seen the proven success of narrative-first strategies at the highest levels of tech and defense. The most powerful organizations in the world are institutionalizing content as strategic infrastructure because they\u2019ve seen the data and the future.",
      },
      {
        type: "p",
        text: "The window is narrower than most founders think, because narrative done right, snowballs. The company that establishes itself as the defining voice in its category today will be exponentially harder to displace three years from now. Every month you wait, the gap widens between you and the company that started building.",
      },
      {
        type: "p",
        text: "War Desk Studio exists for the ones who understand which side of that line they want to be on.",
      },
      {
        type: "pull",
        text: "Because Business Is War.",
      },
    ],
  },
];

export const essayBySlug = (slug: string) => essays.find((e) => e.slug === slug);
