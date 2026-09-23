"use client"

import type { ReactTable, RowData } from "@tanstack/react-table"

import type { EntityDataTableRowModel } from "@/presentation/shared/hooks/use-entity-rows.hook"
import { SHARED_EMPTY_STATE_LABEL } from "@/presentation/shared/settings/shared-datatable-columns.settings"
import type { SharedDataTableFeatures } from "@/presentation/shared/settings/shared-datatable-features.settings"

import { SharedPinnedTableCell } from "../pinned/shared-pinned-table-cell"
import { SharedTableCell } from "../cells/shared-table-cell"

export interface SharedDataTableRowsProps<TData extends RowData> {
  table: ReactTable<SharedDataTableFeatures, TData>
  body: EntityDataTableRowModel<TData>
}

export function SharedDataTableRows<TData extends RowData>({
  table,
  body,
}: SharedDataTableRowsProps<TData>) {
  return (
    <div className="w-full">
      {body.empty ? (
        <div className="flex w-full min-w-max flex-row items-center">
          <div className="flex h-24 w-full min-w-max items-center justify-center border-r border-b border-border bg-neutral-50 px-3 text-sm text-muted-foreground">
            {SHARED_EMPTY_STATE_LABEL}
          </div>
        </div>
      ) : (
        body.rows.map((row) => (
          <div
            key={row.key}
            data-state={row.dataState}
            className="group flex h-11 w-full min-w-max flex-row items-center bg-sidebar"
          >
            {row.cells.map((cell, index) => {
              const pinned = cell.column.getIsPinned()
              const nextIsPinnedEnd =
                row.cells[index + 1]?.column.getIsPinned() === "end"
              const className = nextIsPinnedEnd ? "border-r-0" : undefined

              return pinned === "start" || pinned === "end" ? (
                <SharedPinnedTableCell
                  key={cell.id}
                  table={table}
                  cell={cell}
                  side={pinned}
                  className={className}
                />
              ) : (
                <SharedTableCell
                  key={cell.id}
                  table={table}
                  cell={cell}
                  className={className}
                />
              )
            })}
          </div>
        ))
      )}
    </div>
  )
}
