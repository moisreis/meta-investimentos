import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  numeric,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "@db-schemas/user.schema";
import { position } from "@db-schemas/position.schema";

// Defines the `application` table in the `portfolio`
// database schema. Stores monetary applications with quotas.
export const application = pgSchema("portfolio").table(
  "application",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    positionId: uuid("position_id")
      .notNull()
      .references(() => position.id),
    date: timestamp("date", { withTimezone: true }).notNull(),
    amount: numeric("amount", { precision: 18, scale: 6 }).notNull(),
    quotas: numeric("quotas", { precision: 18, scale: 6 }).notNull(),
    reversedAt: timestamp("reversed_at", { withTimezone: true }),
    reversedByUserId: text("reversed_by_user_id").references(() => user.id),
    version: integer("version").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Enforces that the application amount is non-negative.
    check("application_amount_nonneg", sql`${table.amount} >= 0`),

    // Enforces that the application quotas are non-negative.
    check("application_quotas_nonneg", sql`${table.quotas} >= 0`),

    // Speeds up lookups of applications by position and date.
    index("application_position_date_idx").on(table.positionId, table.date),
  ],
);
