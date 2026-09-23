"use client"

import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import type { SharedCell, SharedTable } from "../shared.types"
import { SharedTableCell } from "../cells/shared-table-cell"

export interface SharedPinnedTableCellProps<TData extends RowData> {
  table: SharedTable<TData>
  cell: SharedCell<TData>
  side: "start" | "end"
  className?: string
}

/**
 * Renders a **frozen** (pinned) data cell. Delegates to the shared cell and
 * layers dedicated pin styling: a solid background so scrolling content does
 * not bleed through, raised stacking, and a leading-edge shadow.
 */
export function SharedPinnedTableCell<TData extends RowData>({
  table,
  cell,
  side,
  className,
}: SharedPinnedTableCellProps<TData>) {
  return (
    <SharedTableCell
      table={table}
      cell={cell}
      className={cn(
        "bg-background z-30",
        side === "start"
          ? "border-r"
          : "border-l flex items-center justify-center",
        className
      )}
    />
  )
}