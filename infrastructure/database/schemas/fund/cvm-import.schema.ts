import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Defines the `cvm_import` table within the `fund` database schema.
 *
 * The table records a single CVM historical quota import run. It keeps
 * the requested date range and scope, the lifecycle timestamps, the
 * final status, any error message and the result counts so every import
 * can be audited and, if it fails, retried or inspected.
 */
export const cvmImport = pgSchema("fund").table(
  "cvm_import",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: text("source").notNull().default("CVM"),
    status: text("status").notNull().default("RUNNING"),
    requestedStart: timestamp("requested_start", { withTimezone: true }),
    requestedEnd: timestamp("requested_end", { withTimezone: true }),
    requestedFundCnpjs: text("requested_fund_cnpjs").array(),
    monthsBack: integer("months_back").notNull().default(12),
    filesFound: integer("files_found").notNull().default(0),
    filesDownloaded: integer("files_downloaded").notNull().default(0),
    filesUnavailable: integer("files_unavailable").notNull().default(0),
    recordsMatched: integer("records_matched").notNull().default(0),
    recordsImported: integer("records_imported").notNull().default(0),
    recordsUpserted: integer("records_upserted").notNull().default(0),
    recordsSkipped: integer("records_skipped").notNull().default(0),
    error: text("error"),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    /**
     * Restricts the import status to the supported lifecycle states.
     */
    check(
      "cvm_import_status_check",
      sql`${table.status} in ('RUNNING', 'SUCCESS', 'PARTIAL', 'FAILED')`,
    ),

    /**
     * Speeds up lookups of imports finished on a given date.
     */
    index("cvm_import_finished_at_idx").on(table.finishedAt),
  ],
);
