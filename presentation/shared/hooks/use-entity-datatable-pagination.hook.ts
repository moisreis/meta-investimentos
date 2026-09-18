"use client"

import type { ReactTable, RowData } from "@tanstack/react-table"

import type { SharedDataTableFeatures } from "@/presentation/shared/settings/shared-datatable-features.settings"

export const SHARED_PAGE_SIZES = [10, 20, 30, 50]

export interface EntityDataTablePaginationModel {
  pageSizes: number[]
  selectedRowsCount: number
  rowCount: number
  pageSize: number
  pageIndex: number
  pageCount: number
  canPreviousPage: boolean
  canNextPage: boolean
}

export function useEntityDataTablePagination<TData extends RowData>(
  table: ReactTable<SharedDataTableFeatures, TData>
): EntityDataTablePaginationModel {
  return {
    pageSizes: SHARED_PAGE_SIZES,
    selectedRowsCount: table.getSelectedRowModel().rows.length,
    rowCount: table.getRowCount(),
    pageSize: table.state.pagination.pageSize,
    pageIndex: table.state.pagination.pageIndex,
    pageCount: Math.max(table.getPageCount(), 1),
    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
  }
}
