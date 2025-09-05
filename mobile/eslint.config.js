// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactNative from "eslint-plugin-react-native";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  // Ignore build/artifacts
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/android/**",
      "**/ios/**",
      "**/.expo/**",
      "**/.expo-shared/**",
      "**/web-build/**",
    ],
  },

  // Base JS + TS recommendations
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // App rules (React / RN)
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.es2023,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-native": reactNative,
    },
    settings: { react: { version: "detect" } },
    rules: {
      // React / Hooks
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Native hygiene (tune as you like)
      "react-native/no-unused-styles": "warn",
      "react-native/split-platform-components": "warn",
      "react-native/no-inline-styles": "off",
      "react-native/no-color-literals": "off",
    },
  },

  // Disable stylistic rules that conflict with Prettier (use Prettier for formatting)
  prettier,
];
