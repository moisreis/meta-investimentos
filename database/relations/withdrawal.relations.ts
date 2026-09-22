import { defineRelations } from "drizzle-orm"
import { position, transactionAllocation, withdrawal } from "@db-schemas"

// Connects a withdrawal to its position and allocations.
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
  })
)
