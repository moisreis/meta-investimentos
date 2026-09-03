import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Configure *Vitest* test projects.
 *
 * The test suite splits into two projects: **unit** and **integration**.
 * *Vitest* selects tests by folder name.
 *
 * Files under a `__unit__` folder run as the **unit** project.
 * Files under an `__integration__` folder run as the **integration** project.
 *
 * Each project extends this config. Each project inherits the
 * plugins and the environment settings.
 *
 * Run a single project with the `--project` flag.
 *
 * @example
 * ```ts
 * vitest --project unit
 * ```
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },

  test: {
    coverage: {
      provider: "v8",
      include: ["business/**/*.ts"],
      reporter: ["text", "lcov"],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 90,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: { label: "CALCULATORS", color: "yellow" },
          include: ["**/__unit__/calculators/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          environment: "jsdom",
        },
      },
      {
        extends: true,
        test: {
          name: { label: "VALUE OBJECTS", color: "green" },
          include: [
            "**/__unit__/value-objects/**/*.{test,spec}.{ts,tsx,js,jsx}",
          ],
          environment: "jsdom",
        },
      },
      {
        extends: true,
        test: {
          name: { label: "ENTITIES", color: "blue" },
          include: ["**/__unit__/entities/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          environment: "jsdom",
        },
      },
      {
        extends: true,
        test: {
          name: { label: "INTERFACES", color: "black" },
          include: ["**/__unit__/interfaces/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          environment: "jsdom",
        },
      },
      {
        extends: true,
        test: {
          name: { label: "ERRORS", color: "magenta" },
          include: ["**/__unit__/errors/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          environment: "node",
        },
      },
      {
        extends: true,
        test: {
          name: { label: "DOMAIN EVENTS", color: "cyan" },
          include: [
            "**/__unit__/domain-events/**/*.{test,spec}.{ts,tsx,js,jsx}",
          ],
          environment: "node",
        },
      },
      {
        extends: true,
        test: {
          name: { label: "REPOSITORIES", color: "white" },
          include: [
            "**/__integration__/repositories/**/*.{test,spec}.{ts,tsx,js,jsx}",
          ],
          environment: "node",
          testTimeout: 30_000,
          hookTimeout: 30_000,
          fileParallelism: false,
        },
      },
    ],
  },
});
