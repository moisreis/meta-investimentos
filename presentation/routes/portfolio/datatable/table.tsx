"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

interface PortfolioDatatableTableProps {
  table: EntityTable<PortfolioResponseDTO>
  onBulkDelete: (
    items: PortfolioResponseDTO[]
  ) => void | Promise<void>
}

/**
 * @summary
 * Renders the portfolio datatable.
 *
 * @remarks
 * Composes the shared entity datatable with the bulk
 * delete flow. The row dialogs render at the list page
 * level above this component.
 *
 * @param props - The table and its bulk delete callback.
 * @param props.table - The shared table instance.
 * @param props.onBulkDelete - Runs the bulk delete flow.
 *
 * @returns The portfolio datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioDatatableTable({
  table,
  onBulkDelete,
}: PortfolioDatatableTableProps) {
  return (
    <EntityDatatable table={table} onBulkDelete={onBulkDelete} />
  )
}

export { PortfolioDatatableTable }
