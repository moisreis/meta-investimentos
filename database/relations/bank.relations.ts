import { defineRelations } from "drizzle-orm";
import { bank, bankAccount, fund } from "@db-schemas";

// Defines the relations applicable to the `bank` table.
// Links a bank to its bank accounts and funds.
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
