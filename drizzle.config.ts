import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Configure the *Drizzle Kit* CLI for database migration generation.
 *
 * Drizzle Kit reads the connection string from the `DATABASE_URL`
 * environment variable (loaded via `dotenv/config`) and points at the
 * schema and relation definition files under `infrastructure/database`.
 *
 * Migrations are written to `infrastructure/database/migrations`.
 *
 * @remarks
 * The config fails fast if `DATABASE_URL` is missing so that a missing
 * environment variable never produces a partial or ambiguous migration.
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export default defineConfig({
  // --------------------------------------
  // OUTPUT DIRECTORY
  // --------------------------------------
  out: "./infrastructure/database/migrations",

  // --------------------------------------
  // SCHEMA SOURCES
  // --------------------------------------
  schema: [
    "./infrastructure/database/schemas/index.ts",
    "./infrastructure/database/relations/**/*.relations.ts",
  ],

  // --------------------------------------
  // TARGET DIALECT
  // --------------------------------------
  dialect: "postgresql",

  // --------------------------------------
  // CONNECTION CREDENTIALS
  // --------------------------------------
  dbCredentials: {
    url: connectionString,
  },
});
