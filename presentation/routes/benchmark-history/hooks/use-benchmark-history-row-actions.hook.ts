"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deleteBenchmarkHistoryAction } from "@/presentation/routes/benchmark-history/actions/delete-benchmark-history.action"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"

/**
 * @summary
 * Binds the index history row actions to the shared
 * entity row actions hook.
 *
 * @remarks
 * Maps the row id to the route delete server action only. The
 * shared hook owns the confirm dialog state and the delete
 * result toast status.
 *
 * @returns The row actions and delete dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function useBenchmarkHistoryRowActions() {
  return useEntityRowActions<BenchmarkHistoryRow>({
    runDelete: (id) =>
      deleteBenchmarkHistoryAction({ benchmarkHistoryId: id }),
  })
}

export { useBenchmarkHistoryRowActions }
