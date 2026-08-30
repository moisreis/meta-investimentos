import { defineRelations } from "drizzle-orm";
import { bankAccount, checkingAccount } from "../../schemas";

/**
 * Defines the relations applicable to the `checking_account` table.
 *
 * A checking account record always belongs to exactly one
 * {@link bankAccount}, linked through the `bankAccountId` foreign key.
 */
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
