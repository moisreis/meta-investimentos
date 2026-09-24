"use client"

import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import type { RowData } from "@tanstack/react-table"

import { useEntityBulkDelete } from "@/presentation/parts/hooks/use-entity-bulk-delete.hook"
import { useEntityDatatablePagination } from "@/presentation/parts/hooks/use-entity-datatable-pagination.hook"
import { Button } from "@/presentation/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/presentation/ui/dropdown-menu"

import { EntityBulkDeleteDialog } from "../dialogs/entity-bulk-delete-dialog"
import type { EntityTable } from "../settings/entity-table-features.settings"
import {
  ENTITY_TABLE_NEXT_PAGE_LABEL,
  ENTITY_TABLE_PAGE_PREFIX_LABEL,
  ENTITY_TABLE_PREVIOUS_PAGE_LABEL,
  FormatBulkDeleteButtonLabel,
  FormatPageSizeDropdownLabel,
  FormatPageSizeLabel,
  FormatSelectedRowsLabel,
} from "../settings/entity-table-labels.settings"

/**
 * Props for the entity table pagination footer.
 */
export interface EntityTablePaginationProps<
  TData extends RowData,
> {
  table: EntityTable<TData>
  onBulkDelete?: (items: TData[]) => void | Promise<void>
}

/**
 * @summary
 * Renders the entity table pagination footer.
 *
 * @remarks
 * Shows the selected rows summary, an optional bulk delete
 * action, the page-size dropdown, the page indicator and the
 * previous and next page buttons.
 *
 * @param props - The table and the optional bulk delete flow.
 *
 * @returns The pagination footer.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTablePagination<TData extends RowData>({
  table,
  onBulkDelete,
}: EntityTablePaginationProps<TData>) {
  const pagination = useEntityDatatablePagination(table)
  const bulkDelete = useEntityBulkDelete(table, onBulkDelete)

  return (
    <div className="flex h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border px-3">
      <div className="flex flex-1 items-center gap-3 text-sm text-muted-foreground">
        <span>
          {FormatSelectedRowsLabel(
            pagination.selectedRowsCount,
            pagination.rowCount
          )}
        </span>

        {onBulkDelete && pagination.selectedRowsCount > 0 ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => bulkDelete.setOpen(true)}
          >
            {FormatBulkDeleteButtonLabel(
              pagination.selectedRowsCount
            )}
          </Button>
        ) : null}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              data-icon="inline-end"
            >
              {FormatPageSizeLabel(pagination.pageSize)}
            </Button>
          }
        >
          <IconChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuRadioGroup
            value={String(pagination.pageSize)}
            onValueChange={(value) =>
              table.setPageSize(Number(value))
            }
          >
            {pagination.pageSizes.map((size) => (
              <DropdownMenuRadioItem
                key={size}
                value={String(size)}
              >
                {FormatPageSizeDropdownLabel(size)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="text-sm text-muted-foreground">
        {ENTITY_TABLE_PAGE_PREFIX_LABEL}{" "}
        {pagination.pageIndex + 1} de {pagination.pageCount}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!pagination.canPreviousPage}
        >
          <IconChevronLeft />
          {ENTITY_TABLE_PREVIOUS_PAGE_LABEL}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!pagination.canNextPage}
        >
          {ENTITY_TABLE_NEXT_PAGE_LABEL}
          <IconChevronRight />
        </Button>
      </div>

      {onBulkDelete ? (
        <EntityBulkDeleteDialog
          open={bulkDelete.open}
          onOpenChange={bulkDelete.setOpen}
          count={bulkDelete.count}
          onConfirm={bulkDelete.handleConfirm}
        />
      ) : null}
    </div>
  )
}

export { EntityTablePagination }
