import { defineRelations } from "drizzle-orm";
import { benchmark, benchmarkHistory } from "@db-schemas";

// Defines the relations for the `benchmark_history` table.
// Links a history record to its benchmark.
export const benchmarkHistoryRelations = defineRelations(
  { benchmark, benchmarkHistory },
  (r) => ({
    benchmarkHistory: {
      benchmark: r.one.benchmark({
        from: r.benchmarkHistory.benchmarkId,
        to: r.benchmark.id,
      }),
    },
  }),
);
