import { index, numeric, pgSchema, timestamp, uuid } from "drizzle-orm/pg-core";
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
    date: timestamp("date").notNull(),
    amount: numeric("amount").notNull(),
    quotas: numeric("quotas").notNull(),
    reversedAt: timestamp("reversed_at"),
    reversedByUserId: uuid("reversed_by_user_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    /**
     * Speeds up lookups of withdrawals by their position and date.
     */
    index("withdrawal_position_date_idx").on(table.positionId, table.date),
  ],
);
