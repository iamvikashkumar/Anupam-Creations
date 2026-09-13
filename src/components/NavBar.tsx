import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-paper-dim bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-display text-xl font-bold text-maroon">
          Anupam Creations
        </Link>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-touch min-w-touch items-center justify-center rounded-card text-maroon sm:hidden"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>

        {/* Desktop nav */}
        <nav className="hidden gap-8 sm:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-base font-medium transition-colors ${
                  isActive ? 'text-maroon' : 'text-ink/70 hover:text-maroon'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-paper-dim px-5 py-3 sm:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `min-h-touch rounded-card px-3 py-3 text-base font-medium ${
                  isActive ? 'bg-maroon/10 text-maroon' : 'text-ink/80'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
