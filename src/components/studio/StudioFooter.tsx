import Link from "next/link";
import BoomUnderline from "@/components/transonic/BoomUnderline";

// One quiet line to close: no ticker, no badges.
export default function StudioFooter() {
  return (
    <footer className="relative bg-wd-bg border-t border-wd-bone/10 px-[clamp(20px,5vw,72px)] py-9">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 font-sans text-[13px] text-wd-bone/50">
        <Link href="/studio" className="flex items-center gap-3 text-wd-bone/80 hover:text-wd-bone transition-colors">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-gold.png" alt="" className="h-6 w-auto" />
          War Desk Studio
        </Link>
        <nav className="flex flex-wrap gap-x-7 gap-y-2">
          <Link href="/studio/essays" className="hover:text-wd-bone transition-colors">
            <BoomUnderline variant="shaped" idle="none">Essays</BoomUnderline>
          </Link>
          <a href="mailto:ty@thewardesk.com" className="hover:text-wd-bone transition-colors">
            <BoomUnderline variant="shaped" idle="none">ty@thewardesk.com</BoomUnderline>
          </a>
          <Link href="/studio/login" className="hover:text-wd-bone transition-colors">
            <BoomUnderline variant="shaped" idle="none">Client portal</BoomUnderline>
          </Link>
        </nav>
        <p>&copy; 2026 War Desk Studio, El Segundo, California</p>
      </div>
    </footer>
  );
}
