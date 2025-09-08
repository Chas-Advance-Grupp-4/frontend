import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // points to frontend/common/src from admin-frontend
      "@frontend/common": resolve(__dirname, "../common/src"),
    },
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
