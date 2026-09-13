import type { ReactNode } from 'react';
import { buildWhatsAppLink } from '@/lib/utils/businessInfo';

interface WhatsAppButtonProps {
  message: string;
  children: ReactNode;
  /** 'secondary' is an outlined button for light backgrounds; 'inverse' is
   * for use on the maroon banner (light outline, readable on dark). */
  variant?: 'primary' | 'secondary' | 'inverse';
}

export default function WhatsAppButton({
  message,
  children,
  variant = 'primary',
}: WhatsAppButtonProps) {
  const base =
    'inline-flex min-h-touch items-center justify-center gap-2 rounded-pill px-6 py-3 text-base font-semibold transition-transform duration-150 active:scale-95';
  const styles = {
    primary: 'bg-maroon text-paper shadow-card hover:bg-maroon-dark',
    secondary: 'border-2 border-maroon text-maroon hover:bg-maroon/5',
    inverse: 'border-2 border-paper text-paper hover:bg-paper/10',
  }[variant];

  return (
    <a
      href={buildWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.6 6.3A8.9 8.9 0 0 0 3.1 16.9L2 22l5.2-1.1a8.9 8.9 0 0 0 13.4-7.8 8.9 8.9 0 0 0-3-6.8Zm-5.6 13.6a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.8.6.6-2.7-.2-.3a7.4 7.4 0 1 1 6.5 3.6Zm4-5.5c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1s-.6.7-.7.8-.3.2-.5.1a6 6 0 0 1-1.8-1.1 6.7 6.7 0 0 1-1.2-1.5c-.1-.2 0-.3.1-.5l.4-.4c.1-.1.1-.2.2-.4a.4.4 0 0 0 0-.4c-.1-.1-.5-1.2-.7-1.6-.2-.4-.4-.4-.5-.4h-.4a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2 4.7 4.7 0 0 0 1 2.5 10.6 10.6 0 0 0 4.1 3.6c.6.2 1 .4 1.4.5.6.2 1.1.1 1.5.1.5-.1 1.3-.5 1.5-1s.2-.9.1-1c0-.1-.2-.2-.4-.3Z" />
      </svg>
      {children}
    </a>
  );
}
