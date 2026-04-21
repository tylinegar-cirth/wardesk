type Props = {
  className?: string;
  variant?: "gold" | "bone" | "blaze" | "ink";
  orientation?: "horizontal" | "vertical";
};

const colorMap = {
  gold: "rgba(212,168,67,0.85)",
  bone: "rgba(240,233,216,0.7)",
  blaze: "rgba(255,90,31,0.85)",
  ink: "rgba(18,18,20,0.85)",
};

export default function FlagStripes({
  className = "",
  variant = "gold",
  orientation = "horizontal",
}: Props) {
  const color = colorMap[variant];
  return (
    <div
      className={className}
      style={{
        background: `repeating-linear-gradient(
          ${orientation === "horizontal" ? "0deg" : "90deg"},
          ${color} 0 2px,
          transparent 2px 5px
        )`,
      }}
      aria-hidden="true"
    />
  );
}
