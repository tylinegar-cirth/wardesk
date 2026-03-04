const statusStyles: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-wd-gold-glow text-wd-gold border-wd-gold/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  "no-show": "bg-white/5 text-wd-muted border-wd-border",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  paused: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  available: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  limited: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  unavailable: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block font-mono text-[9px] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full border ${
        statusStyles[status] || "bg-white/5 text-wd-muted border-wd-border"
      }`}
    >
      {status}
    </span>
  );
}
