"use client"

import { useLayoutEffect, useRef } from "react"
import type { RefObject } from "react"
import type { RowData } from "@tanstack/react-table"

import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"

// Narrowest width a fluid column keeps before the table
// grows horizontally again instead of squeezing further.
const FLUID_MIN_WIDTH = 96

/**
 * @summary
 * Distributes the horizontal surplus among the fluid columns.
 *
 * @remarks
 * Resolves the width of every fluid column so the columns
 * declared as `fluid` and not pinned grow or shrink with the
 * available space. The scroll container is measured through a
 * resize observer and the computed widths are written to the
 * `columnSizing` state, keeping the declared proportions
 * while always fitting the screen. The selection is
 * declarative (visible, `fluid` and unpinned columns), so the
 * pinned and fixed columns keep their exact widths regardless
 * of when the pinning state is applied. The pass runs again
 * when the visible columns change, keeping the layout
 * balanced after columns are hidden.
 *
 * @param table - The table instance.
 * @param containerRef - The scroll container element.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useEntityDatatableFluidWidths<TData extends RowData>(
  table: EntityTable<TData>,
  containerRef: RefObject<HTMLElement | null>
) {
  const TABLE_REF = useRef<EntityTable<TData>>(table)

  const SIGNATURE = table
    .getVisibleLeafColumns()
    .map((COLUMN) => COLUMN.id)
    .join("|")

  useLayoutEffect(() => {
    TABLE_REF.current = table
  })

  useLayoutEffect(() => {
    const CONTAINER = containerRef.current
    if (!CONTAINER) return

    const MEASURE = () => {
      const NODE = containerRef.current
      if (!NODE) return

      const TABLE = TABLE_REF.current
      const FLUID = TABLE.getVisibleLeafColumns().filter(
        (COLUMN) =>
          COLUMN.columnDef.meta?.fluid === true &&
          COLUMN.columnDef.meta?.pinned === undefined
      )

      if (FLUID.length === 0) return

      const FIXED_WIDTH = TABLE.getVisibleLeafColumns()
        .filter(
          (COLUMN) => COLUMN.columnDef.meta?.fluid !== true
        )
        .reduce((TOTAL, COLUMN) => TOTAL + COLUMN.getSize(), 0)

      const AVAILABLE = NODE.clientWidth - FIXED_WIDTH
      if (AVAILABLE <= 0) return

      const WEIGHT_SUM = FLUID.reduce(
        (TOTAL, COLUMN) => TOTAL + (COLUMN.columnDef.size ?? 0),
        0
      )
      if (WEIGHT_SUM <= 0) return

      const NEXT: Record<string, number> = {}

      for (const COLUMN of FLUID) {
        const SIZE = COLUMN.columnDef.size ?? 0
        const SHARE = (AVAILABLE * SIZE) / WEIGHT_SUM
        NEXT[COLUMN.id] = Math.max(
          Math.round(SHARE),
          FLUID_MIN_WIDTH
        )
      }

      const CHANGED = FLUID.some(
        (COLUMN) =>
          Math.abs(COLUMN.getSize() - NEXT[COLUMN.id]) > 0.5
      )
      if (!CHANGED) return

      TABLE.setColumnSizing((CURRENT) => ({
        ...CURRENT,
        ...NEXT,
      }))
    }

    MEASURE()

    const OBSERVER = new ResizeObserver(MEASURE)
    OBSERVER.observe(CONTAINER)

    return () => OBSERVER.disconnect()
  }, [containerRef, SIGNATURE])
}

export { useEntityDatatableFluidWidths }
