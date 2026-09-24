"use client"

import type { RowData } from "@tanstack/react-table"
import { cn } from "cn"

import { EntityTableColumn } from "../columns/entity-table-column"
import type { EntityTable } from "../settings/entity-table-features.settings"
import { ENTITY_TABLE_HEADER_BG } from "../settings/entity-table-labels.settings"

/**
 * Props for the sticky entity table header.
 */
export interface EntityTableHeaderProps<TData extends RowData> {
  table: EntityTable<TData>
  className?: string
}

/**
 * @summary
 * Renders the sticky header rows of the entity table.
 *
 * @remarks
 * The header sticks to the top of the scroll container on
 * vertical scroll. Each header is routed through the column
 * renderer, keeping pinned columns frozen horizontally.
 *
 * @param props - The table and an optional wrapper class.
 *
 * @returns The sticky header element.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function EntityTableHeader<TData extends RowData>({
  table,
  className,
}: EntityTableHeaderProps<TData>) {
  return (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <div
          key={headerGroup.id}
          className={cn(
            "sticky top-0 z-40 flex h-fit w-full min-w-max flex-row items-center border-r border-b border-border",
            ENTITY_TABLE_HEADER_BG,
            className
          )}
        >
          {headerGroup.headers.map((header, index) => {
            const nextIsPinnedEnd =
              headerGroup.headers[
                index + 1
              ]?.column.getIsPinned() === "end"
            const className = nextIsPinnedEnd
              ? "border-r-0"
              : undefined

            return (
              <EntityTableColumn
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

export { EntityTableHeader }
