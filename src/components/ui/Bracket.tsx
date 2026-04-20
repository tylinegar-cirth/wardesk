import { ReactNode } from "react";

type BracketProps = {
  children: ReactNode;
  className?: string;
  variant?: "gold" | "blaze" | "muted" | "bone" | "ink";
  size?: "xs" | "sm" | "md";
};

const colorMap = {
  gold: "text-wd-gold border-wd-gold/50",
  blaze: "text-wd-blaze border-wd-blaze/60",
  muted: "text-wd-muted border-wd-muted/40",
  bone: "text-wd-bone border-wd-bone/50",
  ink: "text-wd-ink border-wd-ink/40",
};

const sizeMap = {
  xs: "text-[9px] tracking-[0.22em] px-1.5 py-[3px]",
  sm: "text-[10px] tracking-[0.24em] px-2 py-[4px]",
  md: "text-[11px] tracking-[0.28em] px-2.5 py-[5px]",
};

export default function Bracket({
  children,
  className = "",
  variant = "gold",
  size = "sm",
}: BracketProps) {
  return (
    <span
      className={`font-mono uppercase inline-flex items-center gap-1.5 ${sizeMap[size]} ${colorMap[variant]} ${className}`}
    >
      <span aria-hidden="true">[</span>
      {children}
      <span aria-hidden="true">]</span>
    </span>
  );
}
