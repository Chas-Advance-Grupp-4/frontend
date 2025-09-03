src/store/

Centralized state management for the app. Holds global state, slices, and actions that can be used across screens and components.

Examples:

authStore.ts (current user, tokens, login/logout actions)

shipmentStore.ts (list of shipments, filters, selected shipment)

uiStore.ts (theme, loading indicators, modals)

Zustand is installed for this.

👉 Think: the single source of truth for your app’s data and state, accessible from anywhere in the app.
