import {
  index,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "../user/user.schema";
import { portfolio } from "./portfolio.schema";

/**
 * Defines the `portfolio_permission` table within the `portfolio`
 * database schema.
 *
 * The table stores the permissions granted to users on portfolios,
 * controlling access levels (VIEWER or EDITOR) for shared portfolios.
 */
export const portfolioPermission = pgSchema("portfolio").table(
  "portfolio_permission",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => portfolio.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["VIEWER", "EDITOR"] }).notNull(),
    grantedByUserId: text("granted_by_user_id")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("portfolio_permission_user_id_idx").on(table.userId),
    index("portfolio_permission_portfolio_id_idx").on(table.portfolioId),
    uniqueIndex("portfolio_permission_user_portfolio_uidx").on(
      table.userId,
      table.portfolioId,
    ),
  ],
);
