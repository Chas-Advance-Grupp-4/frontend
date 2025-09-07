# Driver Frontend (PWA)

PWA for transporters/drivers to scan packages, check in to vehicles, and view status of shipments.

## Quick Start

```bash
cd driver-frontend
npm install
npm run dev
```

## Scripts

```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview production build
npm run lint      # lint source files
```

## Env Variables

Create driver-frontend/.env.local:

VITE_API_BASE_URL=http://localhost:8000

## Features

- Scan packages via QR code
- Assign shipments to vehicle
- View status of shipments in vehicle (temp/humidity)
