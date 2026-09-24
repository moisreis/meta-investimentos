"use client"

import type { CSSProperties } from "react"
import type { RowData } from "@tanstack/react-table"

import type {
  EntityColumn,
  EntityTable,
  EntityTableAlign,
} from "@/presentation/parts/datatable/settings/entity-table-features.settings"

/**
 * Layout contract resolved for a single entity table column.
 */
export interface EntityTableColumnLayout {
  style: CSSProperties
  align: EntityTableAlign
  pinned: false | "start" | "end"
}

/**
 * @summary
 * Resolves the rendering layout for an entity table column.
 *
 * @remarks
 * Returns the pixel width, the sticky offsets for pinned
 * columns, the declared text alignment and the pin region.
 * Fluid columns (declared with `meta.fluid`) omit the width,
 * so the fixed table layout lets them absorb the horizontal
 * surplus while every other column keeps its exact size.
 * A fluid column must not be pinned: its rendered width
 * differs from its declared size, which would misalign the
 * sticky offsets of the neighboring pinned columns.
 *
 * @param table - The table instance.
 * @param column - The column being rendered.
 *
 * @returns The column layout for cells and headers.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function useEntityTableColumn<TData extends RowData>(
  table: EntityTable<TData>,
  column: EntityColumn<TData>
): EntityTableColumnLayout {
  const pinned = column.getIsPinned()

  const STYLE: CSSProperties = {
    position: pinned ? "sticky" : undefined,
    ...(column.columnDef.meta?.fluid !== true && {
      width: column.getSize(),
    }),
    ...(pinned === "start" && {
      left: column.getStart(),
    }),
    ...(pinned === "end" && {
      right: column.getAfter(),
    }),
  }

  const ALIGN = column.columnDef.meta?.align ?? "start"

  return {
    style: STYLE,
    align: ALIGN,
    pinned,
  }
}

export { useEntityTableColumn }
