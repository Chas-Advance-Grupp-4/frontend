# Chas Advance – Frontend Monorepo

This repository contains all frontend applications for the Chas Advance project.

We use **npm workspaces** to manage multiple apps and a shared package (`common/`).

## Structure

frontend/
├── common/ # Shared components, hooks, utils, types
├── customer-frontend/ # PWA for senders/receivers
├── admin-frontend/ # PWA for logistics/admin
├── driver-frontend/ # PWA for transporters/drivers
├── package.json # Workspace root
├── tsconfig.base.json # Shared TypeScript config
└── .gitignore

## Prerequisites

- Node.js 18+ (20 recommended)
- npm 9+

## Getting Started

1. Install dependencies (from root):

   ```bash
   npm install

   ```

2. Run one of the apps:
   npm run dev:customer # Start Customer app
   npm run dev:admin # Start Admin app
   npm run dev:driver # Start Driver app

3. Lint all workspaces:
   npm run lint

## Environment Variables

Each app has its own .env.local file:

- customer-frontend/.env.local
- admin-frontend/.env.local
- driver-frontend/.env.local
  Common example:
  VITE_API_BASE_URL=http://localhost:8000

## Development Notes

- Use common/ for shared code (UI, hooks, utils).
- Keep app-specific logic inside each app folder.
- Commit messages follow Conventional Commits.
