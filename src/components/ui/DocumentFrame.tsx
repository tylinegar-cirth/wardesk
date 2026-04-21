import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: "bone" | "ink" | "gold";
};

/**
 * DocumentFrame — an inverted panel that reads like a classified document
 * page. Use sparingly for document-style moments (e.g. specs, bios, briefs).
 */
export default function DocumentFrame({
  children,
  className = "",
  variant = "bone",
}: Props) {
  const tone =
    variant === "bone"
      ? "bg-wd-bone text-wd-ink"
      : variant === "ink"
      ? "bg-wd-ink text-wd-bone"
      : "bg-wd-gold text-wd-ink";

  return (
    <div className={`relative ${tone} ${className}`}>
      {/* Corner tick marks — classified document cues */}
      <span className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2 border-current opacity-70" aria-hidden="true" />
      <span className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2 border-current opacity-70" aria-hidden="true" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-current opacity-70" aria-hidden="true" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-current opacity-70" aria-hidden="true" />
      {children}
    </div>
  );
}
