"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeleteBenchmarkHistoryAction } from "@/presentation/routes/benchmark-history/actions/bulk-delete-benchmark-history.action"
import { BENCHMARK_HISTORY_DATATABLE } from "@/presentation/routes/benchmark-history/settings/labels.settings"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"

/**
 * @summary
 * Binds the benchmark history bulk delete flow to the
 * shared entity bulk delete action.
 *
 * @remarks
 * Maps the selected row ids to the route bulk delete
 * server action and reuses the route datatable copy for
 * the outcome toast.
 *
 * @returns The bulk delete callback for the datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-20
 */
function useBenchmarkHistoryBulkDelete() {
  return useEntityBulkDeleteAction<BenchmarkHistoryRow>({
    run: (ids) =>
      bulkDeleteBenchmarkHistoryAction({
        benchmarkHistoryIds: ids,
      }),
    labels: BENCHMARK_HISTORY_DATATABLE,
  })
}

export { useBenchmarkHistoryBulkDelete }
