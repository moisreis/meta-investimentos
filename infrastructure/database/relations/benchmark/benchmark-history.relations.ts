import { defineRelations } from "drizzle-orm";
import { benchmark, benchmarkHistory } from "../../schemas";

/**
 * Defines the relations applicable to the `benchmark_history` table.
 *
 * A history record always belongs to exactly one {@link benchmark},
 * linked through the `benchmarkId` foreign key.
 */
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
