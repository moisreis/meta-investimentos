"use client"

import type { CSSProperties } from "react"
import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import { TableCell } from "@/presentation/ui/table"

import type {
  EntityCell,
  EntityTable,
  EntityTableAlign,
} from "../settings/entity-table-features.settings"
import { FormatEntityTableAlignClass } from "../settings/entity-table-labels.settings"

/**
 * Props for the plain entity table data cell.
 */
export interface EntityTableCellProps<TData extends RowData> {
  table: EntityTable<TData>
  cell: EntityCell<TData>
  style: CSSProperties
  align: EntityTableAlign
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
    <TableCell
      style={style}
      className={cn(
        "h-11 truncate border-r border-b border-border text-sm font-normal",
        FormatEntityTableAlignClass(align),
        className
      )}
    >
      <table.FlexRender cell={cell} />
    </TableCell>
  )
}

export { EntityTableCell }
