/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Boutique palette built for the audience: rani pink (a rich
        // magenta-rose worn across Indian occasionwear) as the anchor
        // brand color, warm gold for thread/jewelry-inspired accents,
        // a soft blush background instead of the generic AI cream
        // (#F4F1EA), and a deep plum ink instead of flat black.
        // Token names (maroon/marigold/etc.) are kept from Phase 2 so
        // existing classes don't need renaming.
        ink: '#3B1C2E',
        paper: '#FDF4F1',
        'paper-dim': '#F6E1DC',
        maroon: {
          DEFAULT: '#A6205A',
          dark: '#7D1743',
          light: '#C8618C',
        },
        marigold: {
          DEFAULT: '#C89B3C',
          dark: '#A67D28',
        },
        thread: {
          DEFAULT: '#3F7D6D',
          dark: '#2C5B4E',
        },
        alert: {
          DEFAULT: '#C1521F',
          dark: '#9B4118',
        },
      },
      fontFamily: {
        // System-font stacks only: no web-font network dependency, since
        // the app must stay usable on budget Android phones/data plans.
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        display: [
          'ui-serif',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
      },
      borderRadius: {
        card: '14px',
        pill: '999px',
      },
      minHeight: {
        touch: '48px',
      },
      minWidth: {
        touch: '48px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(43,33,28,0.08), 0 1px 1px rgba(43,33,28,0.04)',
      },
    },
  },
  plugins: [],
};
