"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deletePortfolioPerformanceAction } from "@/presentation/routes/portfolio-performance/actions/delete-portfolio-performance.action"
import type { PortfolioPerformanceRow } from "@/presentation/types/portfolio-performance-row.types"

/**
 * @summary
 * Binds the portfolio performance row actions to the shared
 * entity row actions hook.
 *
 * @remarks
 * Maps the row id to the route delete server action
 * only. The shared hook owns the confirm dialog
 * state and the delete result toast status.
 *
 * @returns The row actions and delete dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function usePortfolioPerformanceRowActions() {
  return useEntityRowActions<PortfolioPerformanceRow>({
    runDelete: (id) =>
      deletePortfolioPerformanceAction({ performanceId: id }),
  })
}

export { usePortfolioPerformanceRowActions }
