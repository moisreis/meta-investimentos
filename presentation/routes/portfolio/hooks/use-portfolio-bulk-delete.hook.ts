"use client"

import { useEntityBulkDeleteAction } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import type { EntityBulkDeleteModel } from "@/presentation/parts/hooks/use-entity-bulk-delete-action.hook"
import { bulkDeletePortfoliosAction } from "@/presentation/routes/portfolio/actions/bulk-delete-portfolios.action"
import { PORTFOLIO_DATATABLE } from "@/presentation/routes/portfolio/settings/labels.settings"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

/**
 * @summary
 * Binds the portfolio bulk delete flow to the shared
 * entity bulk delete action.
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
 * @date 2026-09-26
 */
function usePortfolioBulkDelete(): EntityBulkDeleteModel<PortfolioResponseDTO> {
  return useEntityBulkDeleteAction<PortfolioResponseDTO>({
    run: (ids) =>
      bulkDeletePortfoliosAction({ portfolioIds: ids }),
    labels: PORTFOLIO_DATATABLE,
  })
}

export { usePortfolioBulkDelete }
