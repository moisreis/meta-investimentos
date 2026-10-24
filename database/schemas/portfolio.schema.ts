import {
  index,
  integer,
  numeric,
  pgSchema,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { user } from "@db-schemas/user.schema"

// Stores the portfolios owned by a user.
// Carries the interest rate. The allocation of a portfolio
// lives in the norms attached to it, in `norms_portfolios`.
export const portfolio = pgSchema("portfolio").table(
  "portfolio",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    acronym: text("acronym").notNull(),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    annualInterestRate: numeric("annual_interest_rate", {
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
    // Speeds up lookups of portfolios by their owning user.
    index("portfolio_user_id_idx").on(table.userId),
  ]
)
