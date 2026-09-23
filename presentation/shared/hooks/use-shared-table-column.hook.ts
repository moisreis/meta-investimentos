"use client"

import { useMemo } from "react"
import type { CSSProperties } from "react"
import type { RowData } from "@tanstack/react-table"

import type {
  SharedColumn,
  SharedTable,
} from "@/presentation/shared/datatable/shared.types"

/**
 * Layout attributes needed to render a shared data-table column.
 */
export interface SharedTableColumnLayout {
  /** Absolute pixel width of the column. */
  width: number
  /** Horizontal alignment of the column content. */
  align: "start" | "end"
  /** Whether the column is pinned and to which edge. */
  pinned: "start" | "end" | false
  /** CSS style combining sticky pin positioning and flexible sizing. */
  style: CSSProperties
}

function getColumnWidthPx<TData extends RowData>(
  column: SharedColumn<TData>
): number {
  return column.columnDef.meta?.width ?? 0
}

function getColumnAlign<TData extends RowData>(
  column: SharedColumn<TData>
): "start" | "end" {
  return column.columnDef.meta?.align ?? "start"
}

function getPinnedStyle<TData extends RowData>(
  table: SharedTable<TData>,
  column: SharedColumn<TData>
): CSSProperties | undefined {
  const pin = column.getIsPinned()

  if (pin === "start") {
    let left = 0
    for (const c of table.getStartLeafColumns()) {
      if (c.id === column.id) break
      left += getColumnWidthPx(c)
    }
    return { position: "sticky", left }
  }

  if (pin === "end") {
    let right = 0
    for (const c of table.getEndLeafColumns()) {
      if (c.id === column.id) break
      right += getColumnWidthPx(c)
    }
    return { position: "sticky", right }
  }

  return undefined
}

function getColumnCellStyle<TData extends RowData>(
  column: SharedColumn<TData>
): CSSProperties {
  const width = getColumnWidthPx(column)
  const pin = column.getIsPinned()

  if (pin !== false) {
    return {
      flex: `0 0 ${width}px`,
      minWidth: width,
      maxWidth: width,
    }
  }

  return {
    flex: `1 1 ${width}px`,
    minWidth: width,
  }
}

/**
 * Resolves the layout (pinning, sizing and alignment) for a given column,
 * used by both header and data cell renderers.
 *
 * @param table - The shared data-table instance.
 * @param column - The column whose layout should be resolved.
 *
 * @returns The resolved column layout attributes.
 */
export function useSharedTableColumn<TData extends RowData>(
  table: SharedTable<TData>,
  column: SharedColumn<TData>
): SharedTableColumnLayout {
  return useMemo(() => {
    const width = getColumnWidthPx(column)
    const align = getColumnAlign(column)
    const pinned = column.getIsPinned()

    return {
      width,
      align,
      pinned,
      style: {
        ...getPinnedStyle(table, column),
        ...getColumnCellStyle(column),
      },
    }
  }, [table, column])
}