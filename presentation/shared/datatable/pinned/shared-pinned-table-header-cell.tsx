"use client"

import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import type { SharedHeader, SharedTable } from "../shared.types"
import { SharedTableHeaderCell } from "../header/shared-table-header-cell"

export interface SharedPinnedTableHeaderCellProps<TData extends RowData> {
  table: SharedTable<TData>
  header: SharedHeader<TData>
  side: "start" | "end"
  className?: string
}

/**
 * Renders a **frozen** (pinned) header cell. Delegates to the shared header
 * cell and layers dedicated pin styling (raised stacking and a leading-edge
 * shadow) so frozen columns stay visually separated while scrolling.
 */
export function SharedPinnedTableHeaderCell<TData extends RowData>({
  table,
  header,
  side,
  className,
}: SharedPinnedTableHeaderCellProps<TData>) {
  return (
    <SharedTableHeaderCell
      table={table}
      header={header}
      className={cn(
        "z-30",
        side === "start" ? "border-r" : "border-l",
        className
      )}
    />
  )
}