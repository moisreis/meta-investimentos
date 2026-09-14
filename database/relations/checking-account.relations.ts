import { defineRelations } from "drizzle-orm";
import { bankAccount, checkingAccount } from "@db-schemas";

// Defines the relations for the `checking_account` table.
// Links a checking account to its bank account.
export const checkingAccountRelations = defineRelations(
  { bankAccount, checkingAccount },
  (r) => ({
    checkingAccount: {
      bankAccount: r.one.bankAccount({
        from: r.checkingAccount.bankAccountId,
        to: r.bankAccount.id,
      }),
    },
  }),
);
