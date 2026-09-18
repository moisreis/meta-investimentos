"use client"

import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table"

import type { SharedDataTableFeatures } from "@/presentation/shared/settings/shared-datatable-features.settings"
import { features } from "@/presentation/shared/settings/shared-datatable-features.settings"

export interface UseEntityDataTableOptions<TData extends RowData> {
  data: TData[]
  columns: Array<ColumnDef<SharedDataTableFeatures, TData, any>>
  getRowId: (row: TData) => string
  pinnedStart?: string[]
  pinnedEnd?: string[]
}

export function useEntityDataTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  pinnedStart,
  pinnedEnd,
}: UseEntityDataTableOptions<TData>) {
  return useTable({
    features,
    data,
    columns,
    getRowId,
    initialState: {
      columnPinning: {
        start: pinnedStart ?? [],
        end: pinnedEnd ?? [],
      },
    },
  })
}
