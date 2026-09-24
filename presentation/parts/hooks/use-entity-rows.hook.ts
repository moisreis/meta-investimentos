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
 * the row component stays presentational.
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

  const ROW_MODELS = useMemo(() => ROWS.map(ToRowModel), [ROWS])

  return {
    empty: ROWS.length === 0,
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
