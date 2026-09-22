import { defineRelations } from "drizzle-orm"
import { application, position, transactionAllocation } from "@db-schemas"

// Connects an application to its position and allocations.
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
  })
)
