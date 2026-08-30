import {
  index,
  numeric,
  pgSchema,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { fund } from "./fund.schema";

/**
 * Defines the `quota` table within the `fund` database schema.
 *
 * The table stores the daily quota price of a fund, with a single
 * price record per date.
 */
export const quota = pgSchema("fund").table(
  "quota",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fundId: uuid("fund_id")
      .notNull()
      .references(() => fund.id),
    date: timestamp("date").notNull(),
    price: numeric("price").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    /**
     * Enforces that a fund holds a single quota price per date.
     */
    uniqueIndex("quota_fund_date_uidx").on(table.fundId, table.date),

    /**
     * Speeds up lookups of quota records by their full key.
     */
    index("quota_fund_date_idx").on(table.fundId, table.date),
  ],
);
