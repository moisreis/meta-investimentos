"use client"

import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import { useEntityDatatablePinning } from "@/presentation/parts/hooks/use-entity-datatable-pinning.hook"

import { EntityTablePagination } from "../pagination/entity-table-pagination"
import { EntityTableRows } from "../rows/entity-table-row"
import type { EntityTable } from "../settings/entity-table-features.settings"
import { EntityTableHeader } from "../table-header/entity-table-header"

/**
 * Props for the entity data-table.
 */
export interface EntityDatatableProps<TData extends RowData> {
  table: EntityTable<TData>
  className?: string
  /** Enables the bulk delete confirm flow for the selected rows. */
  onBulkDelete?: (items: TData[]) => void | Promise<void>
}

/**
 * @summary
 * Renders the entity data-table composition root.
 *
 * @remarks
 * Composes the sticky header, the body rows and the pagination
 * footer inside a vertical scroll container. Applies the column
 * pinning declared through the column metadata.
 *
 * @param props - The table and the optional bulk delete flow.
 *
 * @returns The entity data-table.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityDatatable<TData extends RowData>({
  table,
  className,
  onBulkDelete,
}: EntityDatatableProps<TData>) {
  useEntityDatatablePinning(table)

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col",
        className
      )}
    >
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="relative flex min-h-full w-full min-w-max flex-col">
          <EntityTableHeader table={table} />

          <EntityTableRows table={table} />
        </div>
      </div>

      <EntityTablePagination
        table={table}
        onBulkDelete={onBulkDelete}
      />
    </div>
  )
}

export { EntityDatatable }
