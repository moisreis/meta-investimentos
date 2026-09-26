"use client"

import { useEntityRowActions } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import type { EntityRowActionsModel } from "@/presentation/parts/hooks/use-entity-row-actions.hook"
import { deletePortfolioAction } from "@/presentation/routes/portfolio/actions/delete-portfolio.action"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

/**
 * @summary
 * Binds the portfolio row actions to the shared
 * entity row actions hook.
 *
 * @remarks
 * Maps the row id to the route delete server action
 * and wires the detail screen navigation of the
 * row. The shared hook owns the confirm dialog
 * state and the delete result toast status.
 *
 * @returns The row actions and delete dialog state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
function usePortfolioRowActions(): EntityRowActionsModel<PortfolioResponseDTO> {
  return useEntityRowActions<PortfolioResponseDTO>({
    runDelete: (id) =>
      deletePortfolioAction({ portfolioId: id }),
    onView: (row, router) => router.push(`/portfolio/${row.id}`),
  })
}

export { usePortfolioRowActions }
