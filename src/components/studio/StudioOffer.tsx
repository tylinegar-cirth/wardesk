import ShockStations from "@/components/transonic/ShockStations";

// What the studio does: four headings and the elements under each, nothing else.
// The site's job is to show the scope. How we work is for the call and the one-pager.
const DISCIPLINES = [
  {
    name: "Narrative & Voice",
    items: ["Market read", "Brand narrative", "Voice architecture", "Content strategy"],
  },
  {
    name: "Embedded Creative",
    items: [
      "Founder interviews",
      "Product explainers",
      "LinkedIn and social content",
      "Motion graphics",
      "Product photography",
      "Creative direction",
    ],
  },
  {
    name: "Campaigns & Films",
    items: ["Capability films", "Investor films", "Recruitment films", "Launch campaigns", "Brand films", "Vodcasts"],
  },
  {
    name: "Roadshow & Live Events",
    items: ["AUSA", "SOFIC", "Space Symposium", "Launch events", "Booth and stage content"],
  },
];

export default function StudioOffer() {
  return (
    <section
      id="studio"
      data-transonic-band
      aria-label="Studio"
      className="relative bg-wd-bg px-[clamp(20px,5vw,72px)] pt-[clamp(72px,11vw,160px)] pb-[clamp(72px,10vw,140px)] scroll-mt-16"
    >
      <div className="relative max-w-[1400px] mx-auto">
        <ShockStations trigger="view" field="title" firstMs={120} params={{ rest: 0.02, seams: 3, gusts: 0.5 }}>
          <h2 className="font-display uppercase text-wd-bone leading-[0.92] tracking-[-0.03em] text-[clamp(40px,6.2vw,104px)] max-w-[1150px]">
            <span data-word="payoff">Story wins contracts, capital, and talent.</span>
          </h2>
        </ShockStations>
        <p className="font-sans text-[clamp(18px,1.6vw,22px)] leading-[1.55] text-wd-bone/70 max-w-[640px] mt-[clamp(32px,4vw,56px)]">
          We define the story, develop the strategy, then deliver the films, campaigns, and
          content to carry it.
        </p>

        <div className="mt-[clamp(56px,8vw,120px)] border-b border-wd-bone/15">
          {DISCIPLINES.map((d) => (
            <div
              key={d.name}
              className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-x-12 gap-y-5 border-t border-wd-bone/15 py-[clamp(28px,3.4vw,48px)]"
            >
              <h3 className="font-display uppercase text-wd-bone leading-[0.98] tracking-[-0.02em] text-[clamp(26px,2.7vw,42px)] text-balance">
                {d.name}
              </h3>
              <ul className="min-[1360px]:columns-2 min-[1360px]:gap-x-10 max-w-[680px] md:-mt-[0.35vw]">
                {d.items.map((item) => (
                  <li
                    key={item}
                    className="break-inside-avoid font-display font-medium uppercase text-[clamp(16px,1.35vw,20px)] leading-[1.75] tracking-[0.01em] [word-spacing:0.14em] text-wd-bone/85"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
