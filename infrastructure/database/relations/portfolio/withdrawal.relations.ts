import { defineRelations } from "drizzle-orm";
import { position, transactionAllocation, withdrawal } from "../../schemas";

/**
 * Defines the relations applicable to the `withdrawal` table.
 *
 * A withdrawal always belongs to exactly one {@link position} and can
 * consume multiple {@link transactionAllocation} rows, each linked
 * through their foreign keys.
 */
export const withdrawalRelations = defineRelations(
  { position, withdrawal, transactionAllocation },
  (r) => ({
    withdrawal: {
      position: r.one.position({
        from: r.withdrawal.positionId,
        to: r.position.id,
      }),
      allocations: r.many.transactionAllocation({
        from: r.withdrawal.id,
        to: r.transactionAllocation.withdrawId,
      }),
    },
  }),
);
