"use client"

import type { Cell, ReactTable, RowData } from "@tanstack/react-table"

import type { SharedDataTableFeatures } from "@/presentation/shared/settings/shared-datatable-features.settings"

export interface EntityDataTableRow<TData extends RowData> {
  key: string
  dataState: string | undefined
  cells: Array<Cell<SharedDataTableFeatures, TData, unknown>>
}

export interface EntityDataTableRowModel<TData extends RowData> {
  empty: boolean
  rows: EntityDataTableRow<TData>[]
}

export function useEntityRows<TData extends RowData>(
  table: ReactTable<SharedDataTableFeatures, TData>
): EntityDataTableRowModel<TData> {
  const rows = table.getRowModel().rows

  return {
    empty: rows.length === 0,
    rows: rows.map((row) => ({
      key: row.id,
      dataState: row.getIsSelected() ? "selected" : undefined,
      cells: row.getVisibleCells(),
    })),
  }
}
