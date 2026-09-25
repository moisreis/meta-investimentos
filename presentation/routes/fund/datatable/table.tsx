"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

interface FundDatatableTableProps {
  table: EntityTable<FundResponseDTO>
  onBulkDelete: (
    items: FundResponseDTO[]
  ) => void | Promise<void>
}

/**
 * @summary
 * Renders the fund datatable.
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
 * @returns The fund datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function FundDatatableTable({
  table,
  onBulkDelete,
}: FundDatatableTableProps) {
  return (
    <EntityDatatable table={table} onBulkDelete={onBulkDelete} />
  )
}

export { FundDatatableTable }
