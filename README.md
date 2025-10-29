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

# Deployment

## Azure Static Web App for preview and staging

Every time you create a Pull Request (PR) from a feature branch (for example, feature/ui-change) into the 'develop' branch,
GitHub Actions automatically triggers the Azure Static Web Apps pipeline. There is one for each app; Customer, Admin and Driver.

That workflow builds our frontend apps and deploys them to a temporary environment — called a Preview Deployment. When the PR is closed or merged, the preview environment is automatically deleted by your second job (close_pull_request_job) and the main staging environment is built instead.

This makes it easy for others (like reviewers) to open a PR, click the temporary URL, and instantly see what your change looks like — without needing to pull your code locally.

Preview Deployment = for internal review during a PR

- Purpose: Temporary test version for each PR
- Trigger: PR opened/updated
- URL: Unique per branch

Staging = for external review and testing after merge

- Purpose: Stable version of latest dev code
- Trigger: Merge to develop
- URL: One permanent URL for each app

The latest code from develop is built and deployed to the main staging URLs:

- Admin app: https://gray-desert-0157fa003.3.azurestaticapps.net
- Driver app: https://gentle-stone-0caf78303.3.azurestaticapps.net
- Customer app: https://ambitious-sea-0fd974703.3.azurestaticapps.net

These sites always reflects the current, stable development version of our project.

## Azure Static Web App for production

The latest code from main is built and deployed to the main production URLs:

- Admin app: https://gray-flower-0469d3603.3.azurestaticapps.net
- Driver app: https://happy-forest-03e248603.3.azurestaticapps.net
- Customer app: https://jolly-moss-0f56b0603.3.azurestaticapps.net

It follows the same pattern, with a temp preview built on PR and a permanent on merge to main.
