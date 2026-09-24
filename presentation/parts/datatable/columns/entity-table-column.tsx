"use client"

import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import { useEntityTableColumn } from "@/presentation/parts/hooks/use-entity-table-column.hook"

import { EntityTablePinnedColumn } from "../pinned-columns/entity-table-pinned-column"
import { EntityTableCell } from "../rows/entity-table-cell"
import type {
  EntityCell,
  EntityHeader,
  EntityTable,
} from "../settings/entity-table-features.settings"
import { ENTITY_TABLE_HEADER_BG } from "../settings/entity-table-labels.settings"

/**
 * Props for the generic entity table column renderer.
 */
export interface EntityTableColumnProps<TData extends RowData> {
  table: EntityTable<TData>
  header?: EntityHeader<TData>
  cell?: EntityCell<TData>
  className?: string
}

/**
 * @summary
 * Renders a single column of the entity table.
 *
 * @remarks
 * Accepts either a header or a cell and resolves its sizing,
 * alignment and pin region. Pinned columns are routed through
 * the pinned column wrapper; headers keep the sticky header
 * styling.
 *
 * @param props - The table plus a header or a cell.
 *
 * @returns The rendered header or data column.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTableColumn<TData extends RowData>({
  table,
  header,
  cell,
  className,
}: EntityTableColumnProps<TData>) {
  const column = (header ?? cell)!.column
  const { style, align, pinned } = useEntityTableColumn(
    table,
    column
  )

  if (cell) {
    return pinned ? (
      <EntityTablePinnedColumn
        table={table}
        cell={cell}
        side={pinned}
        style={style}
        align={align}
        className={className}
      />
    ) : (
      <EntityTableCell
        table={table}
        cell={cell}
        style={style}
        align={align}
        className={className}
      />
    )
  }

  return (
    <div
      style={style}
      className={cn(
        "flex h-11 items-center border-r border-b border-border px-3 text-xs font-medium text-muted-foreground uppercase",
        align === "end" ? "justify-end" : "justify-start",
        ENTITY_TABLE_HEADER_BG,
        pinned === "start" && "z-30",
        pinned === "end" && "z-30 border-l",
        className
      )}
    >
      {header!.isPlaceholder ? null : (
        <table.FlexRender header={header!} />
      )}
    </div>
  )
}

export { EntityTableColumn }
