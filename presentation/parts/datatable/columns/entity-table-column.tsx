"use client"

import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import { useEntityTableColumn } from "@/presentation/parts/hooks/use-entity-table-column.hook"
import { TableHead } from "@/presentation/ui/table"

import { EntityTableFluidContent } from "./entity-table-fluid-content"
import { EntityTablePinnedColumn } from "../pinned-columns/entity-table-pinned-column"
import { EntityTableCell } from "../rows/entity-table-cell"
import type {
  EntityCell,
  EntityHeader,
  EntityTable,
} from "../settings/entity-table-features.settings"
import {
  ENTITY_TABLE_HEADER_BG,
  FormatEntityTableAlignClass,
} from "../settings/entity-table-labels.settings"

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
 * the pinned column wrapper, fluid columns through their
 * truncating content wrapper; headers keep the sticky header
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
  const IS_FLUID = column.columnDef.meta?.fluid === true

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
    <TableHead
      style={style}
      className={cn(
        "h-11 border-r border-b border-border text-xs font-medium text-muted-foreground uppercase",
        FormatEntityTableAlignClass(align),
        ENTITY_TABLE_HEADER_BG,
        pinned === "start" && "z-30",
        pinned === "end" && "z-30 border-r-0 border-l",
        className
      )}
    >
      {header!.isPlaceholder ? null : IS_FLUID ? (
        <EntityTableFluidContent size={column.getSize()}>
          <table.FlexRender header={header!} />
        </EntityTableFluidContent>
      ) : (
        <table.FlexRender header={header!} />
      )}
    </TableHead>
  )
}

export { EntityTableColumn }
