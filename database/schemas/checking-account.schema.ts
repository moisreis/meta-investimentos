import {
  index,
  numeric,
  pgSchema,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import { bankAccount } from "@db-schemas/bank-account.schema"

// Stores the daily balance of a bank account.
// Holds one balance per bank account and date.
export const checkingAccount = pgSchema("bank").table(
  "checking_account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bankAccountId: uuid("bank_account_id")
      .notNull()
      .references(() => bankAccount.id),
    date: timestamp("date", { withTimezone: true }).notNull(),
    value: numeric("value", {
      precision: 18,
      scale: 6,
    }).notNull(),
  },
  (table) => [
    // Enforces that a bank account holds one balance per date.
    uniqueIndex("checking_account_bank_account_date_uidx").on(
      table.bankAccountId,
      table.date
    ),

    // Speeds up lookups of checking records by their full key.
    index("checking_account_bank_account_date_idx").on(
      table.bankAccountId,
      table.date
    ),
  ]
)
