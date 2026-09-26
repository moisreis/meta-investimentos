"use client"

import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"

interface WithdrawalDatatableToolbarProps {
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the withdrawal datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar with the filter
 * group on the left slot. The actions slot stays empty,
 * since withdrawals are recorded inside the portfolio
 * screens instead of through this registry.
 *
 * @param props - The toolbar slots.
 * @param props.filters - The left-side filter group.
 *
 * @returns The withdrawal datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function WithdrawalDatatableToolbar({
  filters,
}: WithdrawalDatatableToolbarProps) {
  return <EntityDatatableToolbar filters={filters} />
}

export { WithdrawalDatatableToolbar }
