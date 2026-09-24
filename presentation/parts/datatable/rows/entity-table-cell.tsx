"use client"

import type { CSSProperties } from "react"
import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import type {
  EntityCell,
  EntityTable,
} from "../settings/entity-table-features.settings"

/**
 * Props for the plain entity table data cell.
 */
export interface EntityTableCellProps<TData extends RowData> {
  table: EntityTable<TData>
  cell: EntityCell<TData>
  style: CSSProperties
  align: "start" | "end"
  className?: string
}

/**
 * @summary
 * Renders a single, unpinned data cell.
 *
 * @remarks
 * Applies the resolved column width, the declared alignment
 * and the selection highlight. Pinned cells are handled by
 * the pinned column wrapper.
 *
 * @param props - The table, the cell and its layout.
 *
 * @returns The data cell element.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTableCell<TData extends RowData>({
  table,
  cell,
  style,
  align,
  className,
}: EntityTableCellProps<TData>) {
  return (
    <div
      style={style}
      className={cn(
        "flex h-11 items-center border-r border-b border-border px-3 text-sm font-normal group-data-[state=selected]:bg-muted",
        align === "end" ? "justify-end" : "justify-start",
        className
      )}
    >
      <table.FlexRender cell={cell} />
    </div>
  )
}

export { EntityTableCell }
