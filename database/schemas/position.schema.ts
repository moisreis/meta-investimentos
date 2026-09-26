import { sql } from "drizzle-orm"
import {
  check,
  index,
  integer,
  numeric,
  pgSchema,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import { fund } from "@db-schemas/fund.schema"
import { portfolio } from "@db-schemas/portfolio.schema"

// Stores the holdings of a fund inside a portfolio.
// Keeps the initial balance and its reference date.
export const position = pgSchema("portfolio").table(
  "position",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => portfolio.id),
    fundId: uuid("fund_id")
      .notNull()
      .references(() => fund.id),
    initialBalance: numeric("initial_balance", {
      precision: 18,
      scale: 6,
    }),
    initialBalanceDate: timestamp("initial_balance_date", {
      withTimezone: true,
    }),
    allocation: numeric("allocation", {
      precision: 5,
      scale: 2,
    })
      .default("100")
      .notNull(),
    version: integer("version").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    // Enforces that the initial balance is non-negative.
    check(
      "position_initial_balance_nonneg",
      sql`${table.initialBalance} >= 0`
    ),

    // Enforces that the allocation is a valid share.
    check(
      "position_allocation_range",
      sql`${table.allocation} >= 0 AND ${table.allocation} <= 100`
    ),

    // Enforces that a portfolio holds one position per fund.
    uniqueIndex("position_portfolio_fund_uidx").on(
      table.portfolioId,
      table.fundId
    ),

    // Speeds up lookups of positions by their owning portfolio.
    index("position_portfolio_id_idx").on(table.portfolioId),

    // Speeds up lookups of positions by their fund.
    index("position_fund_id_idx").on(table.fundId),
  ]
)
