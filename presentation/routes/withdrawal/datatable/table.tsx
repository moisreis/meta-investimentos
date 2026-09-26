"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"

interface WithdrawalDatatableTableProps {
  table: EntityTable<WithdrawalResponseDTO>
}

/**
 * @summary
 * Renders the withdrawal datatable.
 *
 * @remarks
 * Composes the shared entity datatable without selection
 * or bulk delete flows, since withdrawals are managed
 * from the portfolio screens only.
 *
 * @param props - The shared table instance.
 * @param props.table - The shared table instance.
 *
 * @returns The withdrawal datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function WithdrawalDatatableTable({
  table,
}: WithdrawalDatatableTableProps) {
  return <EntityDatatable table={table} />
}

export { WithdrawalDatatableTable }
