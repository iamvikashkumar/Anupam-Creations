# Anupam Creations

Tailoring • Alteration • Customisation

A mobile-first PWA for a single-user tailoring business: customer &
order management, item-level status tracking, PDF order receipts, and
WhatsApp-ready order confirmations — built for daily use on an Android
phone.

## Status

This repo is being built in phases (see project plan). Currently complete:
**Phase 1 (architecture)**, **Phase 2 (project setup)**, the public site,
and **Phase 4A (admin foundation)**. Customer, order, payment, photo, PDF,
and settings workflows are being added in later phases.

## Stack

- React + TypeScript + Vite, Tailwind CSS
- Firebase Authentication + Cloud Firestore (no custom backend)
- jsPDF for client-side receipt generation
- vite-plugin-pwa for installability
- Vitest + Testing Library for tests

## Local development

Requires Node.js 18+.

```bash
npm install
cp .env.example .env.local   # then fill in your Firebase project keys
npm run dev
```

Open the printed local URL on your phone (same Wi-Fi) or in a desktop
browser's mobile device emulator (360–430px width is the target).

## Firebase setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Authentication → Email/Password** and create one admin user
   (Anupam's login) — customers never get accounts.
3. Enable **Cloud Firestore** in production mode.
4. Copy the web app config into `.env.local` (see `.env.example`).
5. Seed the admin user's Firestore document at `users/{uid}` with
   `{ "role": "admin" }` using the UID from Firebase Authentication.
6. Deploy the security rules:
   `firebase deploy --only firestore:rules`

No Firebase Storage is used — cloth photos are never uploaded; they
stay in browser memory only long enough to build the PDF receipt.

## Build

```bash
npm run build      # type-checks then builds to dist/
npm run preview    # serve the production build locally
```

## Test

```bash
npm run test
```

## Deployment

Firebase Hosting is the default target (keeps auth, database, and
hosting in one project — simplest for a single admin user to manage).
Deployment steps will be finalized in Phase 16.

## Project structure

```
src/
  app/          routing, top-level app shell
  pages/public/ marketing site: Home, Services, About, Contact
  pages/admin/  Login, Dashboard, Orders, Customers, Settings, Calendar
  components/   shared UI building blocks
  features/     customers, orders, payments, pdf, share, photos
  lib/firebase/ Firebase init + Firestore access layer
  lib/utils/    id generation, date math, validation
  types/        shared TypeScript types
  test/         test setup + specs
```
