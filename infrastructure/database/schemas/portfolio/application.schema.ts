import { index, numeric, pgSchema, timestamp, uuid } from "drizzle-orm/pg-core";
import { position } from "./position.schema";

/**
 * Defines the `application` table within the `portfolio` database
 * schema.
 *
 * The table stores the monetary applications made into a position,
 * with the resulting quota quantity. An application can be reversed,
 * in which case the reversal timestamp and author are recorded.
 */
export const application = pgSchema("portfolio").table(
  "application",
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
     * Speeds up lookups of applications by their position and date.
     */
    index("application_position_date_idx").on(table.positionId, table.date),
  ],
);
