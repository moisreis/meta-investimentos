import { sql } from "drizzle-orm";
import {
  check,
  index,
  numeric,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { cvmImport } from "./cvm-import.schema";
import { fund } from "./fund.schema";

/**
 * Defines the `quota_import` table within the `fund` database schema.
 *
 * The table records the provenance of a single quota row that an import
 * run attempted to write. It links the row back to the {@link cvmImport}
 * run and the {@link fund}, storing the date, the price and the action
 * taken (`INSERT`, `UPDATE` or `SKIP`). Import consumers can use these
 * rows to decide which portfolios are affected by a run and must have
 * their performance recalculated.
 */
export const quotaImport = pgSchema("fund").table(
  "quota_import",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    importId: uuid("import_id")
      .notNull()
      .references(() => cvmImport.id),
    fundId: uuid("fund_id")
      .notNull()
      .references(() => fund.id),
    date: timestamp("date", { withTimezone: true }).notNull(),
    price: numeric("price", { precision: 18, scale: 6 }).notNull(),
    action: text("action").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    /**
     * Enforces that the imported price is non-negative.
     */
    check("quota_import_price_nonneg", sql`${table.price} >= 0`),

    /**
     * Restricts the recorded action to the supported set.
     */
    check(
      "quota_import_action_check",
      sql`${table.action} in ('INSERT', 'UPDATE', 'SKIP')`,
    ),

    /**
     * Speeds up lookups of provenance rows by their import run and by
     * the affected fund.
     */
    index("quota_import_import_id_idx").on(table.importId),
    index("quota_import_fund_id_idx").on(table.fundId),
  ],
);
