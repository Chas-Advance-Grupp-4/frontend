export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
if (!API_BASE_URL) {
  // Optional: warn in dev
  // eslint-disable-next-line no-console
  console.warn("VITE_API_BASE_URL is not set");
}
