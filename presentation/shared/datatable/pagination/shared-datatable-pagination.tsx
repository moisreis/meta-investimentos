"use client"

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import type { ReactTable, RowData } from "@tanstack/react-table"
import { useState } from "react"

import { useEntityDataTablePagination } from "@/presentation/shared/hooks/use-entity-datatable-pagination.hook"
import { SharedBulkDeleteDialog } from "@/presentation/shared/dialogs/shared-bulk-delete-dialog"
import { Button } from "@/presentation/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/presentation/ui/dropdown-menu"

import type { SharedDataTableFeatures } from "@/presentation/shared/settings/shared-datatable-features.settings"

export interface SharedDataTablePaginationProps<TData extends RowData> {
  table: ReactTable<SharedDataTableFeatures, TData>
  /** Enables the bulk delete confirm flow for the selected rows. */
  onBulkDelete?: (items: TData[]) => void | Promise<void>
}

export function SharedDataTablePagination<TData extends RowData>({
  table,
  onBulkDelete,
}: SharedDataTablePaginationProps<TData>) {
  const pagination = useEntityDataTablePagination(table)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  const selectedItems = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)

  return (
    <div className="flex h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border px-3">
      <div className="flex flex-1 items-center gap-3 text-sm text-muted-foreground">
        <span>
          {pagination.selectedRowsCount} de {pagination.rowCount} linha(s)
          selecionada(s).
        </span>

        {onBulkDelete && pagination.selectedRowsCount > 0 ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsBulkDeleteOpen(true)}
          >
            Excluir todos(as) os {pagination.selectedRowsCount} itens
          </Button>
        ) : null}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" data-icon="inline-end">
              {pagination.pageSize} linhas
            </Button>
          }
        >
          <IconChevronDown className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuRadioGroup
            value={String(pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            {pagination.pageSizes.map((size) => (
              <DropdownMenuRadioItem key={size} value={String(size)}>
                {size} por página
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

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

      {onBulkDelete ? (
        <SharedBulkDeleteDialog
          open={isBulkDeleteOpen}
          onOpenChange={setIsBulkDeleteOpen}
          items={selectedItems}
          onDelete={onBulkDelete}
          onDeleted={() => table.resetRowSelection()}
        />
      ) : null}
    </div>
  )
}