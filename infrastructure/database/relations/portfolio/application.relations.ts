import { defineRelations } from "drizzle-orm";
import { application, position, transactionAllocation } from "../../schemas";

/**
 * Defines the relations applicable to the `application` table.
 *
 * An application always belongs to exactly one {@link position} and
 * can be consumed by multiple {@link transactionAllocation} rows,
 * each linked through their foreign keys.
 */
export const applicationRelations = defineRelations(
  { position, application, transactionAllocation },
  (r) => ({
    application: {
      position: r.one.position({
        from: r.application.positionId,
        to: r.position.id,
      }),
      allocations: r.many.transactionAllocation({
        from: r.application.id,
        to: r.transactionAllocation.applicationId,
      }),
    },
  }),
);
