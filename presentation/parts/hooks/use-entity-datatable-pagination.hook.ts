"use client"

import type { RowData } from "@tanstack/react-table"

import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { ENTITY_TABLE_PAGE_SIZES } from "@/presentation/parts/datatable/settings/entity-table-labels.settings"

/**
 * Values consumed by the entity table pagination footer.
 */
export interface EntityTablePaginationModel {
  rowCount: number
  selectedRowsCount: number
  pageSize: number
  pageSizes: number[]
  pageIndex: number
  pageCount: number
  canPreviousPage: boolean
  canNextPage: boolean
}

/**
 * @summary
 * Reads the pagination and selection state of the table.
 *
 * @remarks
 * Keeps the pagination footer presentational by exposing only
 * the values it needs to render.
 *
 * @param table - The table instance.
 *
 * @returns The pagination view model.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function useEntityDatatablePagination<TData extends RowData>(
  table: EntityTable<TData>
): EntityTablePaginationModel {
  const PAGINATION = table.state.pagination

  return {
    rowCount: table.getFilteredRowModel().rows.length,
    selectedRowsCount:
      table.getFilteredSelectedRowModel().rows.length,
    pageSize: PAGINATION.pageSize,
    pageSizes: [...ENTITY_TABLE_PAGE_SIZES],
    pageIndex: PAGINATION.pageIndex,
    pageCount: table.getPageCount(),
    canPreviousPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
  }
}

export { useEntityDatatablePagination }
