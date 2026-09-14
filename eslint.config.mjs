import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Stores the **ESLint** rules for the project.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

/**
 * @summary
 * Exports the **ESLint** project configuration.
 *
 * @remarks
 * The config uses **Next.js** and **TypeScript** rules.
 * It also ignores generated and build-related files.
 *
 * @explanation
 * This config defines the project's linting rules.
 * It combines **Next.js** rules with **TypeScript** rules.
 * Use it as the main **ESLint** config in the project.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-13
 */
export default eslintConfig;
