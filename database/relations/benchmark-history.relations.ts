import { defineRelations } from "drizzle-orm"
import { benchmark, benchmarkHistory } from "@db-schemas"

// Connects a history record to its benchmark.
export const benchmarkHistoryRelations = defineRelations(
  { benchmark, benchmarkHistory },
  (r) => ({
    benchmarkHistory: {
      benchmark: r.one.benchmark({
        from: r.benchmarkHistory.benchmarkId,
        to: r.benchmark.id,
      }),
    },
  })
)
