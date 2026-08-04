// Chromatic echo — the house signature (style guide 07).
//
// Two duplicate text layers sit BEHIND the crisp glyph (never text-shadow,
// per the guide) with blaze offset right and cool offset left, carrying the
// guide's asymmetric 0.82 factor so the split never reads as a mechanical
// mirror. The site variation ramps the separation across the word: nothing at
// the left edge, its full (slight) value by the right.
//
// Offsets are in `em`, so the separation scales with type size on its own —
// matching the guide's rule that the base offset tracks the point size.
export default function ChromaticEcho({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={`wd-echo ${className}`} data-echo={children}>
      {children}
    </span>
  );
}
