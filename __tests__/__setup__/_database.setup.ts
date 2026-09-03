import { Pool } from "@neondatabase/serverless";
import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";

config({ path: ".env.test" });

if (!process.env.TEST_DATABASE_URL) {
  throw new Error(
    "TEST_DATABASE_URL is not set. Make sure .env.test points at the Neon test branch.",
  );
}

const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });

/**
 * Provides the shared database connection for tests.
 *
 * The code loads the test environment from the `.env.test`
 * file. It connects to the Neon test branch with Drizzle.
 *
 * Tests use this connection to insert seed data and to
 * create repositories.
 */
export const db = drizzle({ client: pool });

const TABLES = [
  '"audit"."audit_log"',
  '"bank"."bank_account"',
  '"bank"."checking_account"',
  '"bank"."bank"',
  '"benchmark"."benchmark_history"',
  '"benchmark"."benchmark"',
  '"fund"."quota"',
  '"fund"."fund"',
  '"fund"."category"',
  '"performance"."portfolio_performance"',
  '"performance"."position_performance"',
  '"portfolio"."transaction_allocation"',
  '"portfolio"."application"',
  '"portfolio"."withdrawal"',
  '"portfolio"."norms_portfolios"',
  '"portfolio"."position"',
  '"portfolio"."norm"',
  '"portfolio"."portfolio"',
  '"report"."statement"',
  '"user"."verification"',
  '"user"."session"',
  '"user"."account"',
  '"user"."user"',
] as const;

/**
 * Removes all data from every table in the test database.
 *
 * The code truncates each table with the `RESTART IDENTITY`
 * and `CASCADE` options. This resets the identity counters
 * and removes dependent rows.
 *
 * Tests call this function between runs to ensure a clean,
 * predictable database state.
 *
 * @returns A promise that resolves when the truncation
 *          completes.
 */
export async function resetDatabase(): Promise<void> {
  const TABLE_LIST = TABLES.join(", ");

  await db.execute(
    sql.raw(`TRUNCATE TABLE ${TABLE_LIST} RESTART IDENTITY CASCADE`),
  );
}

/**
 * Closes the database connection pool.
 *
 * The code ends every pooled connection and releases the
 * underlying resources.
 *
 * Tests call this function once at the end of the test
 * suite.
 *
 * @returns A promise that resolves when the pool closes.
 */
export async function closeDatabase(): Promise<void> {
  await pool.end();
}
