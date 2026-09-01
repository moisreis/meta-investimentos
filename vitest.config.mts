import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
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
  // --------------------------------------
  // VITEST PLUGINS
  // --------------------------------------
  plugins: [tsconfigPaths(), react()],
  test: {
    // --------------------------------------
    // PROJECT LIST
    // --------------------------------------
    projects: [
      // --------------------------------------
      // CALCULATOR TESTS
      // --------------------------------------
      {
        extends: true,
        test: {
          name: { label: "CALCULATORS", color: "yellow" },
          include: ["**/__unit__/calculators/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          environment: "jsdom",
        },
      },

      // --------------------------------------
      // VALUE OBJECT TESTS
      // --------------------------------------
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

      // --------------------------------------
      // ENTITY TESTS
      // --------------------------------------
      {
        extends: true,
        test: {
          name: { label: "ENTITIES", color: "blue" },
          include: ["**/__unit__/entities/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          environment: "jsdom",
        },
      },

      // --------------------------------------
      // REPOSITORY INTERFACE TESTS
      // --------------------------------------
      {
        extends: true,
        test: {
          name: { label: "INTERFACES", color: "black" },
          include: ["**/__unit__/interfaces/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          environment: "jsdom",
        },
      },

      // --------------------------------------
      // INTEGRATION TESTS
      // --------------------------------------
      {
        extends: true,
        test: {
          name: { label: "REPOSITORIES", color: "white" },
          include: ["**/__integration__/repositories/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          // Repository tests talk to a real Neon database through the
          // serverless WebSocket driver, which clashes with the jsdom
          // global `Event`. They are plain Node tests.
          environment: "node",
          // Tests hit a remote database; give hooks and tests enough
          // head-room to tolerate latency without flaking.
          testTimeout: 30_000,
          hookTimeout: 30_000,
          // Tests share a single PostgreSQL database and wipe it through
          // `resetDatabase`; running files in parallel would make each
          // file truncate the other's fixtures mid-suite.
          fileParallelism: false,
        },
      },
    ],
  },
});
