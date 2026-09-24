"use client"

import { useState } from "react"
import type { RowData } from "@tanstack/react-table"

import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"

/**
 * View model for the bulk delete confirm flow.
 */
export interface EntityBulkDeleteModel<TData extends RowData> {
  open: boolean
  setOpen: (open: boolean) => void
  count: number
  handleConfirm: () => void
}

/**
 * @summary
 * Manages the bulk delete confirm dialog state.
 *
 * @remarks
 * Collects the selected rows, opens the confirmation dialog
 * and clears the selection once the deletion resolves.
 *
 * @param table - The table instance.
 * @param onBulkDelete - Optional callback invoked with the
 * selected items on confirm.
 *
 * @returns The dialog state and confirm handler.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function useEntityBulkDelete<TData extends RowData>(
  table: EntityTable<TData>,
  onBulkDelete?: (items: TData[]) => void | Promise<void>
): EntityBulkDeleteModel<TData> {
  const [open, setOpen] = useState(false)

  const items = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)

  async function HandleConfirm() {
    if (!onBulkDelete) return

    await onBulkDelete(items)
    table.resetRowSelection()
    setOpen(false)
  }

  return {
    open,
    setOpen,
    count: items.length,
    handleConfirm: HandleConfirm,
  }
}

export { useEntityBulkDelete }
