"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"

interface PortfolioPerformanceDatatableTableProps {
  table: EntityTable<PortfolioPerformanceResponseDTO>
}

/**
 * @summary
 * Renders the performance datatable.
 *
 * @remarks
 * Composes the shared entity datatable without selection
 * or bulk delete flows, since performances are produced
 * by the calculation flow only.
 *
 * @param props - The shared table instance.
 * @param props.table - The shared table instance.
 *
 * @returns The performance datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioPerformanceDatatableTable({
  table,
}: PortfolioPerformanceDatatableTableProps) {
  return <EntityDatatable table={table} />
}

export { PortfolioPerformanceDatatableTable }
