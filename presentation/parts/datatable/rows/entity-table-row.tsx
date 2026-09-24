"use client"

import type { RowData } from "@tanstack/react-table"

import { useEntityRows } from "@/presentation/parts/hooks/use-entity-rows.hook"
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/presentation/ui/table"

import { EntityTableColumn } from "../columns/entity-table-column"
import type { EntityTable } from "../settings/entity-table-features.settings"
import { ENTITY_TABLE_EMPTY_STATE_LABEL } from "../settings/entity-table-labels.settings"

/**
 * Props for the entity table row group.
 */
export interface EntityTableRowsProps<TData extends RowData> {
  table: EntityTable<TData>
}

/**
 * @summary
 * Renders the body rows of the entity table.
 *
 * @remarks
 * Maps every row through the column renderer, adding the
 * selection state and freezing the pinned columns. Shows the
 * empty state label when the row model has no rows.
 *
 * @param props - The table instance.
 *
 * @returns The row group or the empty state.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTableRows<TData extends RowData>({
  table,
}: EntityTableRowsProps<TData>) {
  const body = useEntityRows(table)

  return (
    <TableBody>
      {body.empty ? (
        <TableRow>
          <TableCell
            colSpan={body.columnCount}
            className="h-24 border-r border-b border-border bg-neutral-50 px-3 text-center text-sm text-muted-foreground"
          >
            {ENTITY_TABLE_EMPTY_STATE_LABEL}
          </TableCell>
        </TableRow>
      ) : (
        body.rows.map((row) => (
          <TableRow
            key={row.key}
            data-state={row.dataState}
            className="bg-sidebar"
          >
            {row.cells.map((cell, index) => {
              const nextIsPinnedEnd =
                row.cells[index + 1]?.column.getIsPinned() ===
                "end"
              const className = nextIsPinnedEnd
                ? "border-r-0"
                : undefined

              return (
                <EntityTableColumn
                  key={cell.id}
                  table={table}
                  cell={cell}
                  className={className}
                />
              )
            })}
          </TableRow>
        ))
      )}
    </TableBody>
  )
}

export { EntityTableRows }
