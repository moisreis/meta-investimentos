"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeletePortfolioPerformancesAction } from "@/presentation/routes/portfolio-performance/actions/bulk-delete-portfolio-performances.action"
import { PORTFOLIO_PERFORMANCE_DATATABLE } from "@/presentation/routes/portfolio-performance/settings/labels.settings"
import type { PortfolioPerformanceRow } from "@/presentation/types/portfolio-performance-row.types"

/**
 * @summary
 * Binds the portfolio performance bulk delete flow to the
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
function usePortfolioPerformanceBulkDelete() {
  return useEntityBulkDeleteAction<PortfolioPerformanceRow>({
    run: (ids) =>
      bulkDeletePortfolioPerformancesAction({
        performanceIds: ids,
      }),
    labels: PORTFOLIO_PERFORMANCE_DATATABLE,
  })
}

export { usePortfolioPerformanceBulkDelete }
