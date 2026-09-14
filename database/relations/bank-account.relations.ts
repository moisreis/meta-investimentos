import { defineRelations } from "drizzle-orm";
import { bank, bankAccount, checkingAccount, portfolio } from "@db-schemas";

// Defines the relations applicable to the `bank_account` table.
// Links a bank account's portfolio, bank, and checking accounts.
export const bankAccountRelations = defineRelations(
  { bankAccount, portfolio, bank, checkingAccount },
  (r) => ({
    bankAccount: {
      portfolio: r.one.portfolio({
        from: r.bankAccount.portfolioId,
        to: r.portfolio.id,
      }),
      bank: r.one.bank({
        from: r.bankAccount.bankId,
        to: r.bank.id,
      }),
      checkingAccounts: r.many.checkingAccount({
        from: r.bankAccount.id,
        to: r.checkingAccount.bankAccountId,
      }),
    },
  }),
);
