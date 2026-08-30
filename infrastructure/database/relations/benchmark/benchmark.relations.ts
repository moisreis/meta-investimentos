import { defineRelations } from "drizzle-orm";
import { benchmark, benchmarkHistory, fund } from "../../schemas";

/**
 * Defines the relations applicable to the `benchmark` table.
 *
 * A benchmark can own multiple {@link benchmarkHistory} and
 * {@link fund} rows, each linked through their foreign keys.
 */
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
  }),
);
