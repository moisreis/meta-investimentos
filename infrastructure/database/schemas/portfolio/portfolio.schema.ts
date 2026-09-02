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
import { user } from "../user/user.schema";

/**
 * Defines the `portfolio` table within the `portfolio` database schema.
 *
 * The table stores the investment portfolios owned by a user, with
 * the target allocation parameters used by the allocation engine.
 */
export const portfolio = pgSchema("portfolio").table(
  "portfolio",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    acronym: text("acronym").notNull(),
    name: text("name").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
    annualInterestRate: numeric("annual_interest_rate", {
      precision: 5,
      scale: 2,
    }).notNull(),
    minAllocation: numeric("min_allocation", {
      precision: 5,
      scale: 2,
    }).notNull(),
    maxAllocation: numeric("max_allocation", {
      precision: 5,
      scale: 2,
    }).notNull(),
    targetAllocation: numeric("target_allocation", {
      precision: 5,
      scale: 2,
    }).notNull(),
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
     * Enforces the allocation ordering invariant: min ≤ target ≤ max.
     */
    check(
      "portfolio_allocation_order",
      sql`${table.minAllocation} <= ${table.targetAllocation} AND ${table.targetAllocation} <= ${table.maxAllocation}`,
    ),

    /**
     * Speeds up lookups of portfolios by their owning user.
     */
    index("portfolio_user_id_idx").on(table.userId),
  ],
);
