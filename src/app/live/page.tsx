import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function LivePage() {
  return (
    <div className="min-h-screen bg-wd-bg flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <Link href="/" className="mb-12 max-[480px]:mb-8">
        <Logo alt="War Desk" className="h-[60px] w-auto mx-auto max-[480px]:h-[40px]" />
      </Link>

      {/* Heading */}
      <h1 className="font-mono text-[clamp(24px,5vw,48px)] font-bold tracking-[0.3em] uppercase text-wd-text mb-6 leading-[1.1] max-[480px]:tracking-[0.15em]">
        War Desk <span className="text-wd-gold">Live</span>
      </h1>
      <p className="font-serif text-[clamp(16px,2vw,20px)] text-wd-sub italic mb-4 leading-[1.4]">
        The conversation the industry actually needs.
      </p>
      <p className="font-sans text-[13px] text-wd-muted leading-[1.7] max-w-[400px] mb-10">
        Every week, a senior defense leader sits down with a founder building
        the future. No scripts. No PR handlers.
      </p>

      {/* Coming soon badge */}
      <div className="font-mono text-[11px] tracking-[0.15em] uppercase py-3.5 px-8 bg-wd-overlay/[0.03] text-wd-sub border border-wd-border rounded-lg backdrop-blur-[8px] mb-12">
        Coming soon
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="font-mono text-[10px] tracking-[0.1em] uppercase text-wd-muted hover:text-wd-gold transition-colors"
      >
        &larr; Back to War Desk
      </Link>
    </div>
  );
}
