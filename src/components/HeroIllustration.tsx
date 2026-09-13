/**
 * A hand-composed illustration of a draped saree pallu with a gold
 * "zari" border and paisley accents — built from scratch in the brand
 * palette so it's fully ownable (no stock photography, no licensing).
 */
export default function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 420"
      className={className}
      role="img"
      aria-label="Illustration of a draped saree with a decorative gold border"
    >
      {/* soft backdrop circle */}
      <circle cx="210" cy="210" r="190" fill="#F6E1DC" />

      {/* paisley accents, scattered */}
      <g fill="#C89B3C" opacity="0.35">
        <path d="M70 90c14-10 30 2 26 18-3 12-18 16-28 8-12-9-10-20 2-26Z" />
        <path d="M350 300c12-9 26 2 23 15-3 11-16 14-25 7-10-8-9-18 2-22Z" />
        <path d="M340 95c10-7 22 2 19 13-2 9-13 12-21 6-8-6-7-15 2-19Z" />
      </g>

      {/* draped fabric — layered folds */}
      <path
        d="M120 60
           C 90 140, 90 260, 130 360
           L 170 360
           C 150 270, 155 150, 190 70
           Z"
        fill="#C8618C"
      />
      <path
        d="M170 70
           C 150 160, 150 270, 175 360
           L 215 360
           C 205 270, 205 160, 225 65
           Z"
        fill="#A6205A"
      />
      <path
        d="M225 65
           C 210 160, 210 270, 225 360
           L 265 360
           C 255 265, 260 150, 280 75
           Z"
        fill="#7D1743"
      />

      {/* pleats — thin lighter lines over the main drape */}
      <g stroke="#F6C9D6" strokeWidth="2" opacity="0.5" fill="none">
        <path d="M150 80c-16 90-16 190 6 275" />
        <path d="M190 78c-12 92-12 190 4 277" />
        <path d="M235 78c-10 92-6 188 2 277" />
      </g>

      {/* gold zari border along the drape edge */}
      <path
        d="M280 75c10-4 18-9 24-16"
        stroke="#C89B3C"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <g fill="#C89B3C">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx={128 + i * 28} cy={362} r="4" />
        ))}
      </g>
      <path
        d="M110 360h180"
        stroke="#C89B3C"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
