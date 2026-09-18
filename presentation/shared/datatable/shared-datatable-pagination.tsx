"use client"

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import type { ReactTable, RowData } from "@tanstack/react-table"

import { useEntityDataTablePagination } from "@/presentation/shared/hooks/use-entity-datatable-pagination.hook"
import { Button } from "@/presentation/ui/button"

import type { SharedDataTableFeatures } from "@/presentation/shared/settings/shared-datatable-features.settings"

export interface SharedDataTablePaginationProps<TData extends RowData> {
  table: ReactTable<SharedDataTableFeatures, TData>
}

export function SharedDataTablePagination<TData extends RowData>({
  table,
}: SharedDataTablePaginationProps<TData>) {
  const pagination = useEntityDataTablePagination(table)

  return (
    <div className="flex h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border px-3">
      <div className="flex-1 text-sm text-muted-foreground">
        {pagination.selectedRowsCount} de {pagination.rowCount} linha(s)
        selecionada(s).
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor="rows-per-page"
          className="text-sm text-muted-foreground"
        >
          Linhas por página
        </label>
        <select
          id="rows-per-page"
          value={pagination.pageSize}
          onChange={(event) => table.setPageSize(Number(event.target.value))}
          className="h-8 rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {pagination.pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-muted-foreground">
        Página {pagination.pageIndex + 1} de {pagination.pageCount}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!pagination.canPreviousPage}
        >
          <IconChevronLeft />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!pagination.canNextPage}
        >
          Próxima
          <IconChevronRight />
        </Button>
      </div>
    </div>
  )
}
