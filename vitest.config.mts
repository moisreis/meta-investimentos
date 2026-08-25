import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

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
          name: "calculators",
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
          name: "value-objects",
          include: ["**/__unit__/value-objects/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          environment: "jsdom",
        },
      },

      // --------------------------------------
      // INTEGRATION TESTS
      // --------------------------------------
      {
        extends: true,
        test: {
          name: "integration",
          include: ["**/__integration__/**/*.{test,spec}.{ts,tsx,js,jsx}"],
          environment: "jsdom",
        },
      },
    ],
  },
});
