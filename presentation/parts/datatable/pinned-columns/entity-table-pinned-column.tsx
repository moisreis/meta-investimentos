"use client"

import type { CSSProperties } from "react"
import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import { EntityTableCell } from "../rows/entity-table-cell"
import type {
  EntityCell,
  EntityTable,
} from "../settings/entity-table-features.settings"

/**
 * Props for the pinned entity table column.
 */
export interface EntityTablePinnedColumnProps<
  TData extends RowData,
> {
  table: EntityTable<TData>
  cell: EntityCell<TData>
  side: "start" | "end"
  style: CSSProperties
  align: "start" | "end"
  className?: string
}

/**
 * @summary
 * Renders a frozen (pinned) data column.
 *
 * @remarks
 * Delegates to the shared cell and layers dedicated pin
 * styling on top: a solid background so scrolling content
 * does not bleed through, raised stacking and a leading-edge
 * border and shadow.
 *
 * @param props - The table, the cell and its pin region.
 *
 * @returns The pinned data column element.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTablePinnedColumn<TData extends RowData>({
  table,
  cell,
  side,
  style,
  align,
  className,
}: EntityTablePinnedColumnProps<TData>) {
  return (
    <EntityTableCell
      table={table}
      cell={cell}
      style={style}
      align={align}
      className={cn(
        "z-30 bg-background",
        side === "start"
          ? "border-r"
          : "flex items-center justify-center border-l",
        className
      )}
    />
  )
}

export { EntityTablePinnedColumn }
