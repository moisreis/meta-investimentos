"use client"

import { EntityDatatableAddItemButton } from "@/presentation/parts/components/entity-datatable-add-item-button"
import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"

interface WithdrawalDatatableToolbarProps {
  onAddItem: () => void
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the withdrawal datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar with the filter
 * group on the left slot and the add-item button on the
 * right slot. The add-item button opens the withdrawal
 * add dialog.
 *
 * @param props - The toolbar slots.
 * @param props.onAddItem - Opens the add dialog.
 * @param props.filters - The left-side filter group.
 *
 * @returns The withdrawal datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function WithdrawalDatatableToolbar({
  onAddItem,
  filters,
}: WithdrawalDatatableToolbarProps) {
  return (
    <EntityDatatableToolbar
      filters={filters}
      actions={<EntityDatatableAddItemButton onClick={onAddItem} />}
    />
  )
}

export { WithdrawalDatatableToolbar }
