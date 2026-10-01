"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PortfolioPerformanceRow } from "@/presentation/types/portfolio-performance-row.types"

interface PortfolioPerformanceDatatableTableProps {
  table: EntityTable<PortfolioPerformanceRow>
  /**
   * Enables the bulk delete confirm flow for the selected
   * rows.
   */
  onBulkDelete?: (
    items: PortfolioPerformanceRow[]
  ) => void | Promise<void>
}

/**
 * @summary
 * Renders the portfolio performance datatable.
 *
 * @remarks
 * Composes the shared entity datatable with selection and
 * bulk delete flows enabled.
 *
 * @param props - The shared table instance.
 * @param props.table - The shared table instance.
 * @param props.onBulkDelete - Optional bulk delete handler.
 *
 * @returns The portfolio performance datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function PortfolioPerformanceDatatableTable({
  table,
  onBulkDelete,
}: PortfolioPerformanceDatatableTableProps) {
  return (
    <EntityDatatable table={table} onBulkDelete={onBulkDelete} />
  )
}

export { PortfolioPerformanceDatatableTable }
