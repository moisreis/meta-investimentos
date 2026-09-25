"use client"

import { useRef } from "react"
import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import { useEntityDatatableFluidWidths } from "@/presentation/parts/hooks/use-entity-datatable-fluid-widths.hook"
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
 * pinning declared through the column metadata and keeps the
 * fluid column widths fitting the screen through the shared
 * sizing pass. The `<table>` element is rendered directly
 * instead of reusing the `Table` UI primitive, because that
 * primitive owns its own horizontal scrollport: nesting it
 * here would make it the vertical scroll container too,
 * detaching the sticky header from this screen's scroll area.
 * The table is sized `w-full table-fixed`: it always fits the
 * container, and the fluid columns grow or shrink with the
 * available width. The structural table primitives (header,
 * body, rows and cells) are all reused from
 * `presentation/ui/table`.
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

  const SCROLL_REF = useRef<HTMLDivElement>(null)

  useEntityDatatableFluidWidths(table, SCROLL_REF)

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col",
        className
      )}
    >
      <div
        ref={SCROLL_REF}
        className="min-h-0 flex-1 overflow-auto"
      >
        <table
          data-slot="table"
          className="w-full table-fixed border-separate border-spacing-0 text-sm"
        >
          <EntityTableHeader table={table} />

          <EntityTableRows table={table} />
        </table>
      </div>

      <EntityTablePagination
        table={table}
        onBulkDelete={onBulkDelete}
      />
    </div>
  )
}

export { EntityDatatable }
