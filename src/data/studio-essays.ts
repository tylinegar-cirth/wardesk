export interface EssayBlock {
  type: "p" | "h2" | "pull" | "divider";
  text?: string;
}

export interface Essay {
  slug: string;
  title: string;
  subtitle?: string;
  kicker: string;
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
    kicker: "On the real architecture behind Palantir and Anduril",
    author: "Ty Linegar",
    date: "April 2026",
    readingTime: "10 min read",
    summary:
      "Most defense tech startups copied the aesthetic and missed the architecture underneath it. They hired the camera, not the thinking layer.",
    pullQuote:
      "A content guy can make things look good. A content guy cannot tell a defense buyer why you\u2019re different from the startup down the road.",
    bgWord: "NARRATIVE",
    blocks: [
      {
        type: "p",
        text: "There was a time when defense companies didn\u2019t need content. Not in the way we talk about content now \u2014 not as a growth lever, not as a recruiting tool, not as something that shapes whether you win or lose.",
      },
      {
        type: "p",
        text: "Raytheon didn\u2019t land the Tomahawk program because of a killer LinkedIn presence. Lockheed didn\u2019t win the F-35 because their sizzle reel was tighter than Boeing\u2019s. For decades, the defense industry operated on a logic that made content irrelevant: the buyer was a monopsony. The Department of Defense was essentially the only customer, the relationships were institutional and multigenerational, contracts were cost-plus, and the competitive set was five or six primes who all knew each other. The \u201cmarketing\u201d was congressional testimony, trade show booths staffed by retired generals, and press releases issued after the deal was already done. Content, to the extent it existed, was purely congratulatory. A formality. A rubber stamp on a decision that was made in a closed room two years earlier.",
      },
      {
        type: "p",
        text: "That world is gone. And most of the industry hasn\u2019t caught up to what replaced it.",
      },
      { type: "h2", text: "What Palantir and Anduril Actually Did" },
      {
        type: "p",
        text: "The standard telling of this story is that Palantir and Anduril \u201cdisrupted\u201d defense by bringing Silicon Valley energy to the Pentagon. That\u2019s true but incomplete. What they actually disrupted was the information architecture around how defense companies build trust and compete.",
      },
      {
        type: "p",
        text: "Palantir understood something that no traditional defense contractor had ever needed to understand: in an era where procurement decisions are increasingly influenced by public narrative \u2014 where congressional staffers read Twitter, where program officers Google you before a meeting, where the talent you need to hire is evaluating your company the same way they\u2019d evaluate a consumer brand \u2014 the CEO is the content strategy.",
      },
      {
        type: "p",
        text: "Alex Karp didn\u2019t run advertising campaigns. He became the most interesting person in the defense technology conversation. Every podcast appearance, every provocative statement about democracies needing technological superiority, every public disagreement with Silicon Valley orthodoxy \u2014 those weren\u2019t PR moves. They were strategic positioning. Karp built a narrative moat around Palantir that made the company feel singular, philosophical, consequential. The press didn\u2019t cover Palantir because of a media push. They covered Palantir because Karp made the company mean something beyond its products.",
      },
      {
        type: "p",
        text: "Anduril took a different route to the same destination. Palmer Luckey brought consumer technology instincts \u2014 not just in product development, but in brand construction. Anduril felt like a company that had already won before it had. The name itself (Tolkien\u2019s flame of the west, the sword that was reforged) is a brand decision. Luckey\u2019s personal presence \u2014 loud, unapologetic, immediately recognizable \u2014 gave the company an identity that was inseparable from its founder. Every profile, every feature, every podcast appearance created a feedback loop: Anduril attracted attention, which attracted talent, which produced results, which attracted more attention.",
      },
      {
        type: "p",
        text: "Here\u2019s the thing that most people watching from the outside missed: none of this was accidental, and none of it was achieved by a freelancer with a camera. These were fully integrated narrative strategies \u2014 content as a first-class strategic function, not a department that reports to marketing. The content wasn\u2019t documenting the companies. The content was building the companies. There is a meaningful difference.",
      },
      { type: "h2", text: "One Thousand Drone Companies" },
      {
        type: "p",
        text: "Here\u2019s what happened next: the money showed up.",
      },
      {
        type: "p",
        text: "$49.1 billion in defense tech venture capital was deployed in 2025. The global defense market is projected to grow from $2.75 trillion in 2026 to $4.26 trillion by 2035. The space that used to have a handful of players now has hundreds of well-funded startups, many backed by the same tier-one firms, all chasing the same contracts, the same engineers, and the same investor attention.",
      },
      {
        type: "p",
        text: "Take drones. A decade ago, there was the MQ-9 Reaper and that was more or less the conversation. General Atomics owned the category. Today there are over a thousand funded drone companies building ISR platforms, loitering munitions, autonomous swarms, counter-UAS systems, cargo delivery, maritime surveillance, communications relay \u2014 every conceivable application of unmanned systems, across every domain, at every price point.",
      },
      {
        type: "p",
        text: "And every single one of them hired a content guy.",
      },
      {
        type: "p",
        text: "The pattern is almost mechanical at this point. The Series A closes. The founder posts about it on LinkedIn with a paragraph about the mission. Within six weeks, there\u2019s a freelancer with a RED camera on a test range somewhere in the desert, shooting slow-motion footage of hardware against a mountain backdrop, set to ambient music, cut to 60 seconds. Maybe there\u2019s a drone shot of a drone \u2014 the irony is lost on no one. It looks cinematic. It looks professional.",
      },
      {
        type: "p",
        text: "And it looks exactly like what forty other companies posted last month.",
      },
      {
        type: "p",
        text: "This is the content commodity trap, and nearly the entire defense tech startup ecosystem has fallen into it. When every company\u2019s content is interchangeable \u2014 same aesthetic, same music, same type of footage, same vague messaging about \u201cthe future of defense\u201d \u2014 nobody\u2019s content works. It\u2019s beautiful and completely invisible. It doesn\u2019t communicate what makes you different. It doesn\u2019t tell a DoD acquisition officer why they should trust your platform over the competing system they evaluated last Tuesday. It doesn\u2019t tell an engineer at SpaceX why your mission is worth leaving for. It just proves you have a camera budget.",
      },
      { type: "h2", text: "The Wrong Lesson from the Right Examples" },
      {
        type: "p",
        text: "What happened is that hundreds of companies watched Palantir and Anduril succeed and drew the wrong conclusion. They saw that content mattered and concluded that they needed to produce content. But Palantir and Anduril didn\u2019t succeed because they produced content. They succeeded because they had a narrative \u2014 a clear, differentiated, strategic story about who they were, what they believed, and why they mattered \u2014 and then used content to propagate it.",
      },
      {
        type: "p",
        text: "The distinction sounds semantic. It is not. It\u2019s the difference between having something to say and having a camera. Most defense tech startups hired the camera. They got the execution layer without the thinking layer. They copied the aesthetic and missed the architecture underneath it.",
      },
      {
        type: "pull",
        text: "A content guy can make things look good. A content guy cannot sit in a room with your leadership team and articulate why your approach to autonomy is fundamentally different from the company down the road.",
      },
      {
        type: "p",
        text: "A content guy cannot tell you that your recruitment film should feel different from your investor sizzle reel, that a DoD buyer evaluates credibility through entirely different signals than a Series B lead, that the language you use on your website can make or break your relationship with a program office. A content guy does not know what ITAR means, doesn\u2019t understand why certain imagery reads as credible to a military audience and other imagery reads as cosplay, and has never thought about what happens when a consumer agency\u2019s instincts meet a procurement officer\u2019s expectations.",
      },
      {
        type: "p",
        text: "This isn\u2019t a knock on the talent. There are brilliant camera operators and editors in the freelance world. But you don\u2019t solve a strategy problem with a production hire, any more than you solve an engineering problem by buying a nicer IDE.",
      },
      { type: "h2", text: "The Uncomfortable Consumer Parallel" },
      {
        type: "p",
        text: "There\u2019s something underneath all of this that nobody in defense tech wants to say out loud, so I\u2019ll say it carefully: the competitive dynamic in parts of this space is starting to resemble the consumer market.",
      },
      {
        type: "p",
        text: "Not the products. The products are serious, differentiated, and consequential in ways that consumer goods never are. The engineering is real. The stakes are life and death. I would never flatten that distinction and neither should anyone else.",
      },
      {
        type: "p",
        text: "But the market structure is converging. When you have dozens of companies offering broadly similar capabilities \u2014 whether it\u2019s small UAS for tactical ISR, or AI-enabled sensor fusion, or autonomous maritime systems \u2014 to the same set of buyers, with broadly similar technical maturity, the technology alone stops being the tiebreaker. The story starts to matter. The brand starts to carry weight.",
      },
      {
        type: "p",
        text: "At the margins \u2014 and the margins are where most competitions are decided \u2014 the company with the clearest story, the strongest public identity, and the most trusted brand wins. When a procurement officer is evaluating three platforms that all meet spec, the one whose company they already know and trust gets the benefit of the doubt. When an engineer is choosing between two offers with similar compensation, the company whose mission feels alive and whose culture looks real on the internet wins. Every single time.",
      },
      { type: "h2", text: "The Bigger Revolution" },
      {
        type: "p",
        text: "If this shift were only happening inside defense tech, it would already be worth paying attention to. But defense is just one front in a much larger transformation in how serious institutions think about media and narrative.",
      },
      {
        type: "p",
        text: "OpenAI just acquired TBPN. Sam Altman didn\u2019t buy a media company because he needed marketing. He bought it because in a world where public perception shapes regulation, talent flows, and partnership dynamics, controlling the conversation is the strategic advantage. That\u2019s what a content operation is worth when it\u2019s done right. Not as a cost center. As infrastructure.",
      },
      {
        type: "p",
        text: "Meanwhile, Andreessen Horowitz has spent years building what amounts to an entire media company inside a venture capital firm. Not a marketing department with a blog \u2014 a full-stack production operation with podcast studios, video production, long-form writing, social media, events programming, and in-house research. A venture capital firm built a production studio. And it isn\u2019t a vanity project. It\u2019s the core of how a16z competes for the best founders.",
      },
      {
        type: "p",
        text: "When the most sophisticated capital allocators in technology are investing hundreds of millions of dollars into content and media capabilities, that isn\u2019t a trend you can wait out. That\u2019s a permanent structural shift in how power is built, maintained, and defended.",
      },
      { type: "h2", text: "What This Means for Defense" },
      {
        type: "p",
        text: "Defense tech companies have a choice, and the window to make it is narrower than most of them think.",
      },
      {
        type: "p",
        text: "Option one: keep doing what you\u2019re doing. Hire a freelancer, produce some nice-looking footage, post it when you remember to, and hope that your technology speaks for itself. This was a viable strategy when the space had fewer players and the bar for content was lower. It isn\u2019t viable anymore, and it\u2019s getting less viable by the quarter.",
      },
      {
        type: "p",
        text: "Option two: recognize that the game has changed and invest accordingly. Build a real content function \u2014 not just production capability, but strategic narrative capability. Work with people who understand your buyers, your competitive landscape, and the specific rules of engagement in defense and national security.",
      },
      {
        type: "pull",
        text: "The content revolution in defense tech isn\u2019t coming. It\u2019s here. And most of the industry is still bringing a content guy to a content war.",
      },
    ],
  },
];

export const essayBySlug = (slug: string) => essays.find((e) => e.slug === slug);
