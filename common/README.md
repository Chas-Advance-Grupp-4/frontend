# Common Package

Shared library for all frontend apps. Contains reusable components, hooks, types, and utilities.

## Structure

- `src/components/` → UI components (Button, Card, StatusBadge, etc.)
- `src/hooks/` → custom React hooks (e.g. useAuth, useShipments)
- `src/lib/` → API client, helpers, config
- `src/types/` → shared TypeScript types
- `src/utils/` → utility functions

## Usage

Example, how to import from any frontend app:

```ts
import { StatusBadge } from "@frontend/common/components/StatusBadge";
import { useShipments } from "@frontend/common/hooks/useShipments";
```

## Scripts

npm run lint → lint common source
