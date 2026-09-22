import { defineRelations } from "drizzle-orm"
import { benchmark, benchmarkHistory, fund } from "@db-schemas"

// Connects a benchmark to its history records and funds.
export const benchmarkRelations = defineRelations(
  { benchmark, benchmarkHistory, fund },
  (r) => ({
    benchmark: {
      benchmarkHistories: r.many.benchmarkHistory({
        from: r.benchmark.id,
        to: r.benchmarkHistory.benchmarkId,
      }),
      funds: r.many.fund({
        from: r.benchmark.id,
        to: r.fund.benchmarkId,
      }),
    },
  })
)
