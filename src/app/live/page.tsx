import Link from "next/link";

export default function LivePage() {
  return (
    <div className="min-h-screen bg-wd-bg flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <Link href="/" className="mb-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="War Desk"
          className="h-[120px] w-auto dark:invert mx-auto"
        />
      </Link>

      {/* Heading */}
      <div className="font-mono text-[10px] tracking-[0.4em] uppercase text-wd-gold mb-4">
        War Desk Live
      </div>
      <h1 className="font-serif text-[clamp(32px,5vw,56px)] text-wd-text mb-6 leading-[1.1]">
        The conversation the industry<br className="hidden sm:block" /> actually needs.
      </h1>
      <p className="font-sans text-[15px] text-wd-sub leading-[1.7] max-w-[480px] mb-10">
        Every week, a senior defense leader sits down with a founder building
        the future. No scripts. No PR handlers. The signal you can&apos;t get
        anywhere else.
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
