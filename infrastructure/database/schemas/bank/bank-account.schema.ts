import {
  index,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { portfolio } from "../portfolio/portfolio.schema";
import { bank } from "./bank.schema";

/**
 * Defines the `bank_account` table within the `bank` database schema.
 *
 * The table stores the bank accounts linked to a portfolio, uniquely
 * identified by the bank and the agency/account number.
 */
export const bankAccount = pgSchema("bank").table(
  "bank_account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => portfolio.id),
    bankId: uuid("bank_id")
      .notNull()
      .references(() => bank.id),
    agency: text("agency").notNull(),
    accountNumber: text("account_number").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    /**
     * Enforces that a portfolio may link a given bank account at
     * most once.
     */
    uniqueIndex("bank_account_portfolio_bank_agency_number_uidx").on(
      table.portfolioId,
      table.bankId,
      table.agency,
      table.accountNumber,
    ),

    /**
     * Speeds up lookups of bank accounts by their full key.
     */
    index("bank_account_portfolio_bank_agency_number_idx").on(
      table.portfolioId,
      table.bankId,
      table.agency,
      table.accountNumber,
    ),

    /**
     * Speeds up lookups of bank accounts by their bank.
     */
    index("bank_account_bank_id_idx").on(table.bankId),
  ],
);
