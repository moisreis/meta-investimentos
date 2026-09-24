"use client"

import { useEffect } from "react"
import type {
  ColumnPinningState,
  RowData,
} from "@tanstack/react-table"

import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"

/**
 * @summary
 * Applies the column pinning declared through the column meta.
 *
 * @remarks
 * Reads the `meta.pinned` flag from every leaf column and
 * syncs the table pinning state. Only runs when the computed
 * pinning differs from the current one.
 *
 * @param table - The table instance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function useEntityDatatablePinning<TData extends RowData>(
  table: EntityTable<TData>
) {
  useEffect(() => {
    const start: string[] = []
    const end: string[] = []

    for (const column of table.getAllLeafColumns()) {
      const pinned = column.columnDef.meta?.pinned

      if (pinned === "start") start.push(column.id)
      else if (pinned === "end") end.push(column.id)
    }

    const NEXT: ColumnPinningState = { start, end }
    const CURRENT = table.state.columnPinning

    if (!EqualPinning(CURRENT, NEXT)) {
      table.setColumnPinning(NEXT)
    }
  }, [table])
}

/**
 * Compares two pinning states by region and order.
 */
function EqualPinning(
  current: ColumnPinningState,
  next: ColumnPinningState
): boolean {
  return (
    SameOrder(current.start, next.start) &&
    SameOrder(current.end, next.end)
  )
}

/**
 * Compares two id arrays preserving order.
 */
function SameOrder(current: string[], next: string[]): boolean {
  return (
    current.length === next.length &&
    current.every((id, index) => id === next[index])
  )
}

export { useEntityDatatablePinning }
