import { defineRelations } from "drizzle-orm"
import { application, transactionAllocation, withdrawal } from "@db-schemas"

// Connects an allocation to its application and withdrawal.
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
  })
)
