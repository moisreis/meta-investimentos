"use client"

import type { ReactTable, RowData } from "@tanstack/react-table"
import { cn } from "cn"

import { useEntityRows } from "@/presentation/shared/hooks/use-entity-rows.hook"
import type { SharedDataTableFeatures } from "@/presentation/shared/settings/shared-datatable-features.settings"

import { SharedTableHeader } from "./header/shared-table-header"
import { SharedDataTablePagination } from "./pagination/shared-datatable-pagination"
import { SharedDataTableRows } from "./rows/shared-row"

export interface SharedDataTableProps<TData extends RowData> {
  table: ReactTable<SharedDataTableFeatures, TData>
  className?: string
}

export function SharedDataTable<TData extends RowData>({
  table,
  className,
}: SharedDataTableProps<TData>) {
  const body = useEntityRows(table)

  return (
    <div className={cn("flex min-h-0 w-full flex-1 flex-col", className)}>
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="relative flex min-h-full w-full min-w-max flex-col">
          <SharedTableHeader table={table} />

          <SharedDataTableRows table={table} body={body} />
        </div>
      </div>

      <SharedDataTablePagination table={table} />
    </div>
  )
}
