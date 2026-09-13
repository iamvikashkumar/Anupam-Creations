import { businessInfo } from '@/lib/utils/businessInfo';

export default function Footer() {
  return (
    <footer className="border-t border-paper-dim bg-paper-dim/40">
      <div className="mx-auto max-w-5xl px-5 py-10 text-center sm:text-left">
        <p className="font-display text-lg font-bold text-maroon">{businessInfo.name}</p>
        <p className="mt-1 text-sm text-ink/60">{businessInfo.tagline}</p>
        <p className="mt-4 text-sm text-ink/60">{businessInfo.areaServed}</p>
        <p className="text-sm text-ink/60">{businessInfo.hours}</p>
        <p className="mt-6 text-xs text-ink/40">
          © {new Date().getFullYear()} {businessInfo.name}
        </p>
      </div>
    </footer>
  );
}
