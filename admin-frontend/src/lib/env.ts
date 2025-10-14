export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
if (!API_BASE_URL) {
  console.warn("VITE_API_BASE_URL is not set");
}
