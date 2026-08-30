import { defineRelations } from "drizzle-orm";
import { bank, bankAccount, checkingAccount, portfolio } from "../../schemas";

/**
 * Defines the relations applicable to the `bank_account` table.
 *
 * A bank account always belongs to exactly one {@link portfolio} and
 * one {@link bank}, and can hold multiple {@link checkingAccount}
 * records, each linked through their foreign keys.
 */
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
