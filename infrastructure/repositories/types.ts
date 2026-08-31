import type { PgAsyncDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

/**
 * The *Drizzle* query-builder surface required by repositories.
 *
 * Both the production **neon-http** client
 * (`/infrastructure/clients/drizzle.client.ts`) and the test
 * **neon-serverless** client (`/__tests__/__setup__/_database.setup.ts`)
 * extend `PgAsyncDatabase`, so either can be injected into a
 * repository.
 *
 * Repositories receive the client through the constructor instead of
 * importing the shared instance so they:
 * - stay decoupled from the environment-specific client bootstrap;
 * - can be exercised against the dedicated test database without
 *   `DATABASE_URL` being present.
 */
export type DbClient = PgAsyncDatabase<PgQueryResultHKT>;
