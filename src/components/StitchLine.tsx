/**
 * A hand-stitched dashed line that draws itself in once on load — the
 * one deliberate motion moment for the site (see hero in HomePage).
 * Purely decorative: hidden from assistive tech.
 */
export default function StitchLine({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 24"
      className={`stitch-line ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 12c20-10 40 10 60 0s40-10 60 0 40 10 60 0 40-10 60 0 40 10 60 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="6 8"
      />
    </svg>
  );
}
