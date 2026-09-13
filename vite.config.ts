/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// Anupam Creations — mobile-first PWA for a single-user tailoring business.

export default defineConfig({
  // IMPORTANT for GitHub Pages
  base: '/Anupam-Creations/',

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png',
      ],

      manifest: {
        name: 'Anupam Creations',
        short_name: 'Anupam Creations',

        description:
          'Tailoring • Alteration • Customisation',

        theme_color: '#7A3B2E',
        background_color: '#FBF6EF',

        display: 'standalone',
        orientation: 'portrait',

        // IMPORTANT for GitHub Pages
        start_url: '/Anupam-Creations/',

        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },

      workbox: {
        // App shell only.
        // Order data is never cached offline.
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],

        navigateFallbackDenylist: [/^\/admin/],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});