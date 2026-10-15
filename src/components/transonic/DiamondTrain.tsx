// TRANSONIC · shock diamonds.
// In a supersonic plume the diamonds stand in a row along the axis, brightest at the
// nozzle and weaker downstream, about one plume-width apart. Here they are a countdown:
// they light from the nozzle outward over `durationMs`, and when someone holds the
// current item the whole train stands lit, the way the pattern holds at steady thrust.
// Remount (change `key`) to restart the count.

type Props = {
  count?: number;
  durationMs: number;
  running: boolean;
  className?: string;
};

export default function DiamondTrain({ count = 5, durationMs, running, className = "" }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`wd-diamonds ${running ? "is-running" : "is-held"} ${className}`}
      style={{ "--wd-dur": `${durationMs}ms`, "--wd-n": count } as React.CSSProperties}
    >
      {Array.from({ length: count }, (_, i) => (
        <i key={i} style={{ "--i": i } as React.CSSProperties} />
      ))}
    </span>
  );
}
