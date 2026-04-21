type Props = {
  label?: string;
  tone?: "gold" | "blaze" | "emerald";
  className?: string;
};

const toneMap = {
  gold: { bg: "bg-wd-gold", text: "text-wd-gold", glow: "shadow-[0_0_8px_rgba(212,168,67,0.6)]" },
  blaze: { bg: "bg-wd-blaze", text: "text-wd-blaze", glow: "shadow-[0_0_8px_rgba(255,90,31,0.7)]" },
  emerald: { bg: "bg-emerald-400", text: "text-emerald-400", glow: "shadow-[0_0_8px_rgba(52,211,153,0.6)]" },
};

export default function StatusDot({
  label = "ACTIVE",
  tone = "gold",
  className = "",
}: Props) {
  const t = toneMap[tone];
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.28em] uppercase ${t.text} ${className}`}
    >
      <span className={`h-[6px] w-[6px] rounded-full ${t.bg} ${t.glow} wd-blink`} aria-hidden="true" />
      {label}
    </span>
  );
}
