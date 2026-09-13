import type { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  startingFrom?: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
  startingFrom,
}: ServiceCardProps) {
  return (
    <div className="card flex flex-col gap-3 p-5 transition-shadow hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-maroon/10 text-maroon">
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-ink/65">{description}</p>
      {startingFrom && (
        <p className="mt-auto text-sm font-semibold text-marigold-dark">
          Starting from {startingFrom}
        </p>
      )}
    </div>
  );
}
