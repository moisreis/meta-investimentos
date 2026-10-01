"use client"

import { useMemo } from "react"
import type { Row, RowData } from "@tanstack/react-table"

import type {
  EntityCell,
  EntityTable,
  EntityTableFeatures,
} from "@/presentation/parts/datatable/settings/entity-table-features.settings"

/**
 * View model for a single entity table row.
 */
export interface EntityTableRowModel<TData extends RowData> {
  key: string
  dataState: string | undefined
  cells: EntityCell<TData>[]
}

/**
 * View model for the entity table row group.
 */
export interface EntityTableRowsModel<TData extends RowData> {
  empty: boolean
  /** Empty because the filter hid rows that do exist. */
  noMatch: boolean
  rows: EntityTableRowModel<TData>[]
  /** Number of visible leaf columns for the empty row. */
  columnCount: number
}

/**
 * @summary
 * Maps the current table row model into the render view model.
 *
 * @remarks
 * Exposes the selection state and the visible cells per row so
 * the row component stays presentational. The model re-computes
 * whenever the visible column ids change, so hiding and showing
 * columns keeps the body rows aligned with the header.
 *
 * @param table - The table instance.
 *
 * @returns The row view model with an empty flag.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function useEntityRows<TData extends RowData>(
  table: EntityTable<TData>
): EntityTableRowsModel<TData> {
  const ROWS = table.getRowModel().rows

  // Hiding and showing a column has to re-align the cells of
  // every row with the header. That rebuild keys off a string
  // rather than the id array itself: `getVisibleLeafColumns`
  // returns a fresh array on every render, so an array dep
  // would change identity each render and the memo below would
  // never hit, re-mapping every row on every keystroke. A
  // joined key has value equality, so the rebuild happens when
  // the visible set genuinely changes and not otherwise.
  const VISIBLE_COLUMN_KEY = table
    .getVisibleLeafColumns()
    .map((column) => column.id)
    .join("|")

  const ROW_MODELS = useMemo(
    () => ROWS.map(ToRowModel),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ROWS, VISIBLE_COLUMN_KEY]
  )

  return {
    empty: ROWS.length === 0,
    // The row model is the filtered one, so an empty model
    // over a non-empty core model means the search hid the
    // rows rather than the table having none. Those two read
    // very differently to the person who just typed a query.
    noMatch:
      ROWS.length === 0 &&
      table.getCoreRowModel().rows.length > 0,
    rows: ROW_MODELS,
    columnCount: table.getAllLeafColumns().length,
  }
}

/**
 * Converts a table row into its render view model.
 */
function ToRowModel<TData extends RowData>(
  row: Row<EntityTableFeatures, TData>
): EntityTableRowModel<TData> {
  return {
    key: row.id,
    dataState: row.getIsSelected() ? "selected" : undefined,
    cells: row.getVisibleCells(),
  }
}

export { useEntityRows }
