"use client"

import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import type { SharedTable } from "../shared.types"
import { SharedPinnedTableHeaderCell } from "../pinned/shared-pinned-table-header-cell"
import {
  SHARED_HEADER_BG,
  SharedTableHeaderCell,
} from "./shared-table-header-cell"

export interface SharedTableHeaderProps<TData extends RowData> {
  table: SharedTable<TData>
  className?: string
}

/**
 * Renders the sticky header rows for the shared data-table. Pinned columns
 * are routed through {@link SharedPinnedTableHeaderCell} so frozen headers
 * can be styled independently.
 */
export function SharedTableHeader<TData extends RowData>({
  table,
  className,
}: SharedTableHeaderProps<TData>) {
  return (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <div
          key={headerGroup.id}
          className={cn(
            "sticky top-0 z-40 flex h-fit w-full min-w-max flex-row items-center border-r border-b border-border",
            SHARED_HEADER_BG,
            className
          )}
        >
          {headerGroup.headers.map((header, index) => {
            const pinned = header.column.getIsPinned()
            const nextIsPinnedEnd =
              headerGroup.headers[index + 1]?.column.getIsPinned() === "end"
            const className = nextIsPinnedEnd ? "border-r-0" : undefined

            return pinned === "start" || pinned === "end" ? (
              <SharedPinnedTableHeaderCell
                key={header.id}
                table={table}
                header={header}
                side={pinned}
                className={className}
              />
            ) : (
              <SharedTableHeaderCell
                key={header.id}
                table={table}
                header={header}
                className={className}
              />
            )
          })}
        </div>
      ))}
    </>
  )
}