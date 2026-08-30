import { defineRelations } from "drizzle-orm";
import { application, transactionAllocation, withdrawal } from "../../schemas";

/**
 * Defines the relations applicable to the `transaction_allocation`
 * table.
 *
 * An allocation always links exactly one {@link application} to one
 * {@link withdrawal}, referenced through the `applicationId` and
 * `withdrawId` foreign keys.
 */
export const transactionAllocationRelations = defineRelations(
  { application, withdrawal, transactionAllocation },
  (r) => ({
    transactionAllocation: {
      application: r.one.application({
        from: r.transactionAllocation.applicationId,
        to: r.application.id,
      }),
      withdraw: r.one.withdrawal({
        from: r.transactionAllocation.withdrawId,
        to: r.withdrawal.id,
      }),
    },
  }),
);
