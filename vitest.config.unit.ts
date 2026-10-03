import { defineConfig } from "vitest/config"
import { resolve } from "path"

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      "@/*": resolve(__dirname, "./*"),
      "@errors": resolve(__dirname, "./errors"),
      "@errors/*": resolve(__dirname, "./errors/*"),
      "@constants": resolve(__dirname, "./constants"),
      "@constants/*": resolve(__dirname, "./constants/*"),
      "@domain": resolve(__dirname, "./domain"),
      "@domain/*": resolve(__dirname, "./domain/*"),
      "@clients": resolve(__dirname, "./clients"),
      "@clients/*": resolve(__dirname, "./clients/*"),
      "@database": resolve(__dirname, "./database"),
      "@database/*": resolve(__dirname, "./database/*"),
      "@db-schemas": resolve(__dirname, "./database/schemas"),
      "@db-schemas/*": resolve(
        __dirname,
        "./database/schemas/*"
      ),
      "@db-relations": resolve(
        __dirname,
        "./database/relations"
      ),
      "@db-relations/*": resolve(
        __dirname,
        "./database/relations/*"
      ),
      "@value-objects": resolve(__dirname, "./value-objects"),
      "@value-objects/*": resolve(
        __dirname,
        "./value-objects/*"
      ),
      "@lib": resolve(__dirname, "./lib"),
      "@lib/*": resolve(__dirname, "./lib/*"),
      "@services": resolve(__dirname, "./services"),
      "@services/*": resolve(__dirname, "./services/*"),
      "@infrastructure": resolve(__dirname, "./infrastructure"),
      "@infrastructure/*": resolve(
        __dirname,
        "./infrastructure/*"
      ),
    },
  },
  test: {
    name: "unit",
    include: ["__tests__/__unit__/**/*.test.ts"],
    exclude: [
      "__tests__/__integration__/**",
      "__tests__/__setup__/**",
    ],
    environment: "node",
    globals: true,
    setupFiles: [
      "__tests__/__setup__/_environment.setup.ts",
      "__tests__/__setup__/_factories.setup.ts",
      "__tests__/__setup__/_fakes.setup.ts",
      "__tests__/__setup__/_clock.setup.ts",
    ],
    coverage: {
      provider: "v8",
      thresholds: {
        "domain/**": { lines: 95, branches: 95 },
        "services/**": { lines: 85, branches: 85 },
        "value-objects/**": { lines: 95, branches: 95 },
        "lib/**": { lines: 90, branches: 90 },
      },
    },
    testTimeout: 10_000,
  },
})
