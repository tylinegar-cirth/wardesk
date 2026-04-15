"use client";

/**
 * CAD-style registration brackets that frame a section or element.
 * Inspired by architectural drawing corner marks — adds a technical/premium
 * accent without visual clutter.
 *
 * Usage:
 *   <div className="relative">
 *     <CornerBrackets />
 *     ...content
 *   </div>
 */
export default function CornerBrackets({
  size = 28,
  inset = 16,
  color = "rgba(212,168,67,0.5)",
  strokeWidth = 1,
  className = "",
}: {
  size?: number;
  inset?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  const Bracket = ({
    pos,
  }: {
    pos: "tl" | "tr" | "bl" | "br";
  }) => {
    const common: React.CSSProperties = {
      position: "absolute",
      width: size,
      height: size,
      pointerEvents: "none",
    };
    const style: React.CSSProperties = {
      ...common,
      ...(pos === "tl" && { top: inset, left: inset }),
      ...(pos === "tr" && { top: inset, right: inset }),
      ...(pos === "bl" && { bottom: inset, left: inset }),
      ...(pos === "br" && { bottom: inset, right: inset }),
    };
    // Paths: two lines forming the corner
    const paths: Record<typeof pos, string> = {
      tl: `M0 ${size * 0.5} L0 0 L${size * 0.5} 0`,
      tr: `M${size * 0.5} 0 L${size} 0 L${size} ${size * 0.5}`,
      bl: `M0 ${size * 0.5} L0 ${size} L${size * 0.5} ${size}`,
      br: `M${size * 0.5} ${size} L${size} ${size} L${size} ${size * 0.5}`,
    };
    return (
      <svg style={style} viewBox={`0 0 ${size} ${size}`} fill="none">
        <path
          d={paths[pos]}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
        {/* Tiny inner hatch lines for the "architectural drawing" feel */}
        {pos === "tl" && (
          <g stroke={color} strokeWidth={strokeWidth * 0.5} opacity={0.5}>
            <line x1="2" y1="2" x2={size * 0.35} y2="2" />
            <line x1="2" y1="2" x2="2" y2={size * 0.35} />
          </g>
        )}
        {pos === "tr" && (
          <g stroke={color} strokeWidth={strokeWidth * 0.5} opacity={0.5}>
            <line x1={size * 0.65} y1="2" x2={size - 2} y2="2" />
            <line x1={size - 2} y1="2" x2={size - 2} y2={size * 0.35} />
          </g>
        )}
        {pos === "bl" && (
          <g stroke={color} strokeWidth={strokeWidth * 0.5} opacity={0.5}>
            <line x1="2" y1={size * 0.65} x2="2" y2={size - 2} />
            <line x1="2" y1={size - 2} x2={size * 0.35} y2={size - 2} />
          </g>
        )}
        {pos === "br" && (
          <g stroke={color} strokeWidth={strokeWidth * 0.5} opacity={0.5}>
            <line x1={size - 2} y1={size * 0.65} x2={size - 2} y2={size - 2} />
            <line x1={size * 0.65} y1={size - 2} x2={size - 2} y2={size - 2} />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden>
      <Bracket pos="tl" />
      <Bracket pos="tr" />
      <Bracket pos="bl" />
      <Bracket pos="br" />
    </div>
  );
}
