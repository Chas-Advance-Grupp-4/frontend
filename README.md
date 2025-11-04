# Chas Advance – Frontend Monorepo

This repository contains all frontend applications for the Chas Advance project.

We use **npm workspaces** to manage multiple apps. It also contains a shared directory with shared code, (`common/`).

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

- Node.js 22
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

Each app has its own .env file:

- customer-frontend/.env.local
- admin-frontend/.env.local
- driver-frontend/.env.local

  Common example:
  VITE_API_BASE_URL=http://localhost:8000

## Development Notes

- Use common/ for shared code (UI, hooks, utils).
- Keep app-specific logic inside each app folder.
- Commit messages follow Conventional Commits.

## Unified Azure SWA Workflow

This workflow (.github/workflows/deployment.yml) manages all frontend applications — admin, customer, and driver — within a single YAML file, replacing six separate pipelines for development and production.

### Automated Flow

- Pull Requests → Automatically creates Preview Environments for both develop (staging) and main (production)
- Push to develop → Deploys to the permanent staging environments on Azure
- Push to main → Deploys to the permanent production environments on Azure
- PR closed or merged → Automatically removes the temporary preview environments

### Optimization

- Uses a matrix strategy to deploy all three apps in parallel (admin, customer, driver)
- Combines staging, production, and preview logic in a single unified pipeline
- Automatically switches between the correct deployment tokens and environment variables depending on the branch
- Eliminates duplicated YAML code, ensuring consistency and easier maintenance across all frontends

### Result

A clean, scalable, and fully automated CI/CD pipeline that provides fast, reliable, and unified deployments for all frontend applications.

### Permanent staging URLs:

- Admin app: https://gray-desert-0157fa003.3.azurestaticapps.net
- Driver app: https://gentle-stone-0caf78303.3.azurestaticapps.net
- Customer app: https://ambitious-sea-0fd974703.3.azurestaticapps.net

### Permanent production URLs:

- Admin app: https://gray-flower-0469d3603.3.azurestaticapps.net
- Driver app: https://happy-forest-03e248603.3.azurestaticapps.net
- Customer app: https://jolly-moss-0f56b0603.3.azurestaticapps.net
