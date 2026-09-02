import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  numeric,
  pgSchema,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "../user/user.schema";
import { position } from "./position.schema";

/**
 * Defines the `withdrawal` table within the `portfolio` database
 * schema.
 *
 * The table stores the monetary redemptions made from a position,
 * with the resulting quota quantity. A withdrawal can be reversed,
 * in which case the reversal timestamp and author are recorded.
 */
export const withdrawal = pgSchema("portfolio").table(
  "withdrawal",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    positionId: uuid("position_id")
      .notNull()
      .references(() => position.id),
    date: timestamp("date", { withTimezone: true }).notNull(),
    amount: numeric("amount", { precision: 18, scale: 6 }).notNull(),
    quotas: numeric("quotas", { precision: 18, scale: 6 }).notNull(),
    reversedAt: timestamp("reversed_at", { withTimezone: true }),
    reversedByUserId: uuid("reversed_by_user_id").references(() => user.id),
    version: integer("version").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    /**
     * Enforces that the withdrawal amount is non-negative.
     */
    check("withdrawal_amount_nonneg", sql`${table.amount} >= 0`),

    /**
     * Enforces that the withdrawal quotas are non-negative.
     */
    check("withdrawal_quotas_nonneg", sql`${table.quotas} >= 0`),

    /**
     * Speeds up lookups of withdrawals by their position and date.
     */
    index("withdrawal_position_date_idx").on(table.positionId, table.date),
  ],
);
