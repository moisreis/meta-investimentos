import { defineRelations } from "drizzle-orm";
import { bank, bankAccount, fund } from "../../schemas";

/**
 * Defines the relations applicable to the `bank` table.
 *
 * A bank can own multiple {@link bankAccount} and {@link fund} rows,
 * linked through the `bankId` foreign keys.
 */
export const bankRelations = defineRelations(
  { bank, bankAccount, fund },
  (r) => ({
    bank: {
      bankAccounts: r.many.bankAccount({
        from: r.bank.id,
        to: r.bankAccount.bankId,
      }),
      funds: r.many.fund({
        from: r.bank.id,
        to: r.fund.bankId,
      }),
    },
  }),
);
