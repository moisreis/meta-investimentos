import { drizzle } from "drizzle-orm/neon-http";

/**
 * Create and export the shared *Drizzle* database client.
 *
 * The client connects to the Neon database using the
 * `DATABASE_URL` environment variable via the HTTP driver, which is
 * suited to serverless/edge runtimes.
 *
 * This is the single shared `db` instance used across the application,
 * including by the *Better Auth* adapter.
 *
 * @remarks
 * The module fails fast if `DATABASE_URL` is missing so that a missing
 * environment variable never produces a partially-configured client.
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const db = drizzle(connectionString);
