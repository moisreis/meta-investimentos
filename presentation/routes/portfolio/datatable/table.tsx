"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import { EntityTableDeleteDialog } from "@/presentation/parts/datatable/dialogs/entity-table-delete-dialog"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import { usePortfolioRowActions } from "../hooks/use-portfolio-row-actions.hook"
import {
  PORTFOLIO_DATATABLE,
  FormatDeletePortfolioDescription,
} from "../settings/labels.settings"

interface PortfolioDatatableTableProps {
  table: EntityTable<PortfolioResponseDTO>
  onBulkDelete: (
    items: PortfolioResponseDTO[]
  ) => void | Promise<void>
  rowActions: ReturnType<typeof usePortfolioRowActions>
}

/**
 * @summary
 * Renders the portfolio datatable and its row delete
 * dialog.
 *
 * @remarks
 * Composes the shared entity datatable with the bulk
 * delete flow and the single-row delete dialog driven
 * by the row actions state.
 *
 * @param props - The table, its bulk delete callback and
 * the row actions model.
 *
 * @returns The portfolio datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function PortfolioDatatableTable({
  table,
  onBulkDelete,
  rowActions,
}: PortfolioDatatableTableProps) {
  return (
    <>
      <EntityDatatable
        table={table}
        onBulkDelete={onBulkDelete}
      />

      <EntityTableDeleteDialog
        open={rowActions.deleteOpen}
        onOpenChange={rowActions.setDeleteOpen}
        title={PORTFOLIO_DATATABLE.DELETE_TITLE}
        description={
          rowActions.deleteTarget
            ? FormatDeletePortfolioDescription(
                rowActions.deleteTarget.name
              )
            : ""
        }
        confirmLabel={PORTFOLIO_DATATABLE.DELETE_CONFIRM_LABEL}
        cancelLabel={PORTFOLIO_DATATABLE.DELETE_CANCEL_LABEL}
        pending={rowActions.deletePending}
        onConfirm={rowActions.handleConfirmDelete}
      />
    </>
  )
}

export { PortfolioDatatableTable }
