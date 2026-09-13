type IconProps = { className?: string };

const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function NeedleIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20 18 6" />
      <circle cx="19.5" cy="4.5" r="1.5" />
      <path d="M4 20c-1 0-1.5-.5-1.5-1.5S3 17 4 17" />
    </svg>
  );
}

export function ScissorsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <path d="M20 5 7.5 14M20 19 7.5 10" />
    </svg>
  );
}

export function FoldedFabricIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 8c4-2 12-2 16 0v9c-4 2-12 2-16 0Z" />
      <path d="M4 8v9M20 8v9" />
      <path d="M8 6.5v2M12 5.5v2M16 6.5v2" />
    </svg>
  );
}

export function SareeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M9 3c0 4-3 6-3 12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3c0-6-3-8-3-12" />
      <path d="M9 3c1 1 5 1 6 0" />
      <path d="M8 11h8M7.5 15h9" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.3-3.6A7.9 7.9 0 0 1 4 12Z" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 20s-7-4.4-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z" />
    </svg>
  );
}
