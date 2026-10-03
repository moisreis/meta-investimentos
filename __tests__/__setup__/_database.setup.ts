import { drizzle } from "drizzle-orm/neon-http"
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// -------------------------------------------------------------------
// LAZY INITIALIZATION - runs when initTestDatabase() is called
// -------------------------------------------------------------------
let testDbInstance: ReturnType<typeof drizzle> | null = null
let migrationsApplied = false

function getTestDatabaseUrl(): string {
  const PROD_URL = process.env.DATABASE_URL
  const TEST_URL = process.env.TEST_DATABASE_URL

  if (!TEST_URL) {
    throw new Error(
      "TEST_DATABASE_URL is not set. Define it in .env.test or CI secrets."
    )
  }
  if (PROD_URL && TEST_URL === PROD_URL) {
    throw new Error(
      "TEST_DATABASE_URL equals DATABASE_URL. Refusing to run tests against production database."
    )
  }
  return TEST_URL
}

function initializeDatabase() {
  if (testDbInstance) return testDbInstance

  const TEST_URL = getTestDatabaseUrl()
  testDbInstance = drizzle(TEST_URL)
  return testDbInstance
}

export function getTestDb() {
  return initializeDatabase()
}

// -------------------------------------------------------------------
// MIGRATIONS (run once) - Execute every migration.sql in order
// -------------------------------------------------------------------
const DATABASE_SCHEMAS = [
  "user",
  "portfolio",
  "audit",
  "bank",
  "benchmark",
  "fund",
  "performance",
  "report",
] as const

const MIGRATIONS_FOLDER = path.resolve(
  __dirname,
  "../../drizzle"
)

// Every folder under `drizzle` is one migration, and the
// folder name starts with the timestamp drizzle assigned, so
// sorting by name replays them in the order they were written.
// The folder is read rather than hard coded so a new
// migration is picked up without touching the test setup.
function ListMigrationFiles(): string[] {
  return fs
    .readdirSync(MIGRATIONS_FOLDER, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) =>
      path.join(MIGRATIONS_FOLDER, name, "migration.sql")
    )
    .filter((file) => fs.existsSync(file))
}

// Splits a migration into the individual statements drizzle
// separated with its statement-breakpoint marker.
function ToStatements(migrationSQL: string): string[] {
  return migrationSQL
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0)
}

export async function applyMigrationsOnce(): Promise<void> {
  if (migrationsApplied) return

  const TEST_URL = getTestDatabaseUrl()
  const { neon } = await import("@neondatabase/serverless")
  const sql = neon(TEST_URL)

  // Drop all schemas (CASCADE drops all tables in them)
  for (const schemaName of DATABASE_SCHEMAS) {
    try {
      await sql.query(
        `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`
      )
    } catch {
      // Ignore errors
    }
  }

  // Also clear migration history in public schema
  for (const table of [
    `"__drizzle_migrations"`,
    `"public"."__drizzle_migrations"`,
  ]) {
    try {
      await sql.query(`DROP TABLE IF EXISTS ${table} CASCADE`)
    } catch {
      // Ignore errors
    }
  }

  // Recreate schemas
  for (const schemaName of DATABASE_SCHEMAS) {
    await sql.query(`CREATE SCHEMA "${schemaName}"`)
  }

  // Replay every migration from the beginning. The Neon HTTP
  // driver runs one statement per request, so a multi
  // statement migration is split on drizzle's own marker.
  const MIGRATIONS = ListMigrationFiles()

  for (const file of MIGRATIONS) {
    const migrationSQL = fs.readFileSync(file, "utf-8")

    for (const statement of ToStatements(migrationSQL)) {
      await sql.query(statement)
    }
  }

  migrationsApplied = true
}

// -------------------------------------------------------------------
// TABLE ORDER FOR TRUNCATE (dependency-safe: children first)
// Schema-qualified table names with proper quoting
// -------------------------------------------------------------------
const TRUNCATE_ORDER = [
  // user schema
  '"user"."verification"',
  '"user"."session"',
  '"user"."account"',
  '"user"."user"',
  // audit schema
  '"audit"."audit_log"',
  // bank schema
  '"bank"."checking_account"',
  '"bank"."bank_account"',
  '"bank"."bank"',
  // portfolio schema
  '"portfolio"."transaction_allocation"',
  '"portfolio"."application"',
  '"portfolio"."withdrawal"',
  '"portfolio"."norms_portfolios"',
  '"portfolio"."norm"',
  '"portfolio"."position"',
  '"portfolio"."portfolio"',
  // fund schema
  '"fund"."quota"',
  '"fund"."category"',
  '"fund"."fund"',
  // performance schema
  '"performance"."position_performance"',
  '"performance"."portfolio_performance"',
  // benchmark schema
  '"benchmark"."benchmark_history"',
  '"benchmark"."benchmark"',
  // report schema
  '"report"."statement"',
] as const

// -------------------------------------------------------------------
// RESET DATABASE
// -------------------------------------------------------------------
export async function resetDatabase(): Promise<void> {
  const TEST_URL = getTestDatabaseUrl()
  const { neon } = await import("@neondatabase/serverless")
  const sql = neon(TEST_URL)

  // Truncate tables in dependency order (children first)
  // CASCADE handles foreign keys. Ignore "relation does not exist" errors
  // for tables that haven't been created yet (e.g., fresh test DB branch).
  for (const table of TRUNCATE_ORDER) {
    try {
      await sql.query(
        `TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`
      )
    } catch (error) {
      // Ignore "relation does not exist" errors (table not created yet)
      if (
        error instanceof Error &&
        error.message.includes("does not exist")
      ) {
        continue
      }
      throw error
    }
  }
  // Neon HTTP driver doesn't have end() method - connections are per-request
}

// -------------------------------------------------------------------
// TRANSACTION PER TEST (Neon HTTP driver does NOT support transactions)
// Fallback: call resetDatabase() in beforeEach for integration tests
// -------------------------------------------------------------------
export async function withTestTransaction<T>(
  fn: () => Promise<T>
): Promise<T> {
  // Neon HTTP driver doesn't support BEGIN/COMMIT/ROLLBACK
  // Caller must handle cleanup via resetDatabase() in beforeEach
  return fn()
}

// -------------------------------------------------------------------
// CLOSE
// -------------------------------------------------------------------
export async function closeDatabase(): Promise<void> {
  // drizzle with direct connection string doesn't expose a close method
  // The connection pool is managed by the driver
  testDbInstance = null
}

// Export for backward compatibility - lazily initialized
export const testDb = new Proxy(
  {} as ReturnType<typeof drizzle>,
  {
    get(_target, prop) {
      const db = initializeDatabase()
      return db[prop as keyof typeof db]
    },
  }
)
