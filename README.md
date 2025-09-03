# Chas Advance – Frontend repo

This repo contains two frontend apps:

- **`pwa/`** – Web PWA (Vite + React + TypeScript + Tailwind + shadcn/ui)
- **`mobile/`** – Mobile app (Expo + React Native + TypeScript)

---

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm 9+ (or pnpm/yarn if you prefer)

For mobile development:

- Xcode (iOS) / Android Studio (Android)
- Expo CLI via `npx` (no global install needed)

---

## Repo Structure

```
├─ pwa/ # Web PWA (Vite/React/TS/Tailwind)
│  ├─ public/ # Static assets (favicon, manifest, robots.txt)
│  └─ src/
│     ├─ assets/ # Images, fonts imported in code
│     ├─ components/ # Reusable UI components
│     ├─ pages/ # Route-level pages
│     ├─ routes/ # Router config & guards
│     ├─ hooks/ # Custom hooks
│     └─ lib/ # API client, config, helpers
└─ mobile/ # Expo/React Native app (TypeScript)
    └─ src/
        ├─ assets/ # App-bundled icons, images, fonts
        ├─ components/ # Reusable UI components
        ├─ screens/ # Screen-level views
        ├─ navigation/ # Stack/Tab navigators
        ├─ hooks/ # Custom hooks
        └─ lib/ # API client, config, helpers
```

---

## Environment Variables

### PWA (`frontend-pwa/`)

Create `.env.local`:

```
VITE_API_BASE_URL=http://localhost:8000
```

### Mobile (`frontend-mobile/`)

Use Expo public env var (available at runtime). In `.env` or `app.json`:

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:8000
```

Read it in code:

```ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
```

---

## Installation Steps

1. **Install dependencies**

   From repo root (run per app):

   ```bash
   cd pwa && npm install
   cd mobile && npm install
   ```

2. **Run the apps (dev)**

   **PWA**

   ```bash
   cd frontend-pwa
   npm run dev
   # open the shown URL (usually http://localhost:5173)
   ```

   **Mobile (Expo)**

   ```bash
   cd frontend-mobile
   npm run web         # run on web
   # or:
   npm run ios         # iOS simulator (requires Xcode)
   npm run android     # Android emulator (requires Android Studio)
   ```

---

## Common Scripts

### PWA

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview build
- `npm run lint` – ESLint

### Mobile

- `npm run web` – Expo web
- `npm run ios` – Expo iOS
- `npm run android` – Expo Android
- `npm run start` – Expo bundler (choose platform)
- `npm run lint` – ESLint (flat config)

---

## API Integration

Both apps expect a backend running at `API_BASE_URL`. Set `VITE_API_BASE_URL` (PWA) and `EXPO_PUBLIC_API_BASE_URL` (Mobile) to the backend URL you’re using (local, staging, etc.).

## Linting & Formatting

ESLint is configured in both apps. Run `npm run lint` (and `npm run lint:fix` if defined) inside each app. Prettier config is included; use your editor’s “Format on Save”.

---

## Troubleshooting

- **Expo web requires deps:** If `expo start --web` complains, run:

  ```bash
  npx expo install react-dom react-native-web @expo/metro-runtime
  ```

- **CORS errors:** Enable CORS on the backend for your dev origins (PWA, Expo web).

- **Env not picked up:**
  - PWA: use `.env.local` and restart `npm run dev`.
  - Expo: use `EXPO_PUBLIC_*` variables and restart the dev server.

---

## Contributing

1. Create a feature branch (from dev)
2. Make changes inside one app (pwa or mobile).
3. Run lints/tests locally.
4. Open a PR.
