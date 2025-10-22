/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		fs: {
			allow: [".."],
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./vitest.setup.ts",
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
			exclude: ["node_modules", "dist", "**/*.d.ts"],
		},
	},
});
