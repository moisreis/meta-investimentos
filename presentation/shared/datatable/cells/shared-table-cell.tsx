"use client"

import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import { useSharedTableColumn } from "@/presentation/shared/hooks/use-shared-table-column.hook"

import type { SharedCell, SharedTable } from "../shared.types"

export interface SharedTableCellProps<TData extends RowData> {
  table: SharedTable<TData>
  cell: SharedCell<TData>
  className?: string
}

/**
 * Renders a single data cell for the shared data-table, applying
 * sizing styles and selection state styling.
 */
export function SharedTableCell<TData extends RowData>({
  table,
  cell,
  className,
}: SharedTableCellProps<TData>) {
  const column = cell.column
  const { style, align } = useSharedTableColumn(table, column)

  return (
    <div
      style={style}
      className={cn(
        "flex h-11 items-center border-r border-b border-border px-3 text-sm font-normal group-data-[state=selected]:bg-muted",
        align === "end" && "justify-end",
        className
      )}
    >
      <table.FlexRender cell={cell} />
    </div>
  )
}