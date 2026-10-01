"use client"

import type { RowData } from "@tanstack/react-table"

import { Skeleton } from "@/presentation/ui/skeleton"
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/presentation/ui/table"

import type { EntityTable } from "../settings/entity-table-features.settings"
import {
  ENTITY_TABLE_PENDING_LABEL,
  ENTITY_TABLE_PENDING_ROW_COUNT,
  ENTITY_TABLE_PENDING_WIDTHS,
} from "../settings/entity-table-labels.settings"

/**
 * Props for the pending body of the entity table.
 */
export interface EntityTablePendingRowsProps<
  TData extends RowData,
> {
  table: EntityTable<TData>
}

/**
 * @summary
 * Renders the placeholder body of an entity table that has
 * not resolved its rows yet.
 *
 * @remarks
 * A pending table and an empty table used to look the same,
 * because both drew a single message row: a reader could not
 * tell "nothing here" from "not here yet", and neither could
 * a screen reader. Drawing placeholder rows instead keeps
 * the distinction visible, and `aria-busy` announces it
 * without the reader having to see it.
 *
 * The rows mirror the real body: one cell per visible leaf
 * column, the same height, the same rules. The cell widths
 * cycle through a short set so the placeholder reads as a
 * table rather than a wall of identical bars.
 *
 * @explanation
 * Use as the body of `EntityDatatable` while `pending` is
 * set. The header stays real, so the columns a reader sees
 * while waiting are the columns they will read.
 *
 * @param props - Props of the pending body.
 * @param props.table - The table instance, read for its
 *   visible column count.
 *
 * @returns The pending body rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function EntityTablePendingRows<TData extends RowData>({
  table,
}: EntityTablePendingRowsProps<TData>) {
  const COLUMN_COUNT = table.getAllLeafColumns().length
  const CELLS = Array.from({ length: COLUMN_COUNT })
  const ROWS = Array.from({
    length: ENTITY_TABLE_PENDING_ROW_COUNT,
  })

  return (
    <TableBody aria-busy aria-label={ENTITY_TABLE_PENDING_LABEL}>
      {ROWS.map((_, ROW_INDEX) => (
        <TableRow key={ROW_INDEX} className="bg-sidebar">
          {CELLS.map((__, CELL_INDEX) => (
            <TableCell
              key={CELL_INDEX}
              className="h-11 border-r border-b border-border bg-sidebar px-3"
            >
              <Skeleton
                className={
                  ENTITY_TABLE_PENDING_WIDTHS[
                    CELL_INDEX %
                      ENTITY_TABLE_PENDING_WIDTHS.length
                  ] ?? "w-20"
                }
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

export { EntityTablePendingRows }
