"use client"

import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import { useSharedTableColumn } from "@/presentation/shared/hooks/use-shared-table-column.hook"

import type {
  SharedHeader,
  SharedTable,
} from "../shared.types"

export const SHARED_HEADER_BG = "bg-[#FFFFFF] dark:bg-neutral-900"

export interface SharedTableHeaderCellProps<TData extends RowData> {
  table: SharedTable<TData>
  header: SharedHeader<TData>
  className?: string
}

/**
 * Renders a single header cell for the shared data-table, applying
 * sizing styles and the shared header background.
 */
export function SharedTableHeaderCell<TData extends RowData>({
  table,
  header,
  className,
}: SharedTableHeaderCellProps<TData>) {
  const column = header.column
  const { style, align } = useSharedTableColumn(table, column)

  return (
    <div
      style={style}
      className={cn(
        "flex h-11 items-center border-r border-border px-3 text-xs font-medium text-muted-foreground uppercase",
        align === "end" && "justify-end",
        SHARED_HEADER_BG,
        className
      )}
    >
      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
    </div>
  )
}