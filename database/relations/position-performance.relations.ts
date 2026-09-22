import { defineRelations } from "drizzle-orm"
import { position, positionPerformance } from "@db-schemas"

// Connects a performance record to its position.
export const positionPerformanceRelations = defineRelations(
  { position, positionPerformance },
  (r) => ({
    positionPerformance: {
      position: r.one.position({
        from: r.positionPerformance.positionId,
        to: r.position.id,
      }),
    },
  })
)
