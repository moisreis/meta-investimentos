"use client"

import { useCallback, useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PositionResponseDTO } from "@/services/position/dto/position-response.dto"

import { CreatePositionTableColumns } from "../datatable/table-columns"
import { EMPTY_POSITION_LOOKUPS } from "../helpers/build-position-lookups.helper"
import type { PositionLookups } from "../types/position-list.types"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  PositionResponseDTO
>()

/**
 * @summary
 * Coordinates the position datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the
 * datatable and the pagination, wiring the portfolio and
 * fund name resolution into the column definitions. The
 * pagination starts at ten rows per page; it is seeded
 * through `initialState` so the slice stays mutable.
 *
 * @param positions - The rows rendered by the table.
 * @param lookups - The position lookups.
 *
 * @returns The shared table instance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePositionDatatable(
  positions: PositionResponseDTO[],
  lookups: PositionLookups = EMPTY_POSITION_LOOKUPS
) {
  const rowFor = useCallback(
    (positionId: string) => lookups.rows[positionId] ?? null,
    [lookups]
  )

  const COLUMNS = useMemo(
    () =>
      CreatePositionTableColumns(COLUMN_HELPER, {
        rowFor,
      }),
    [rowFor]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: positions,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return { table: TABLE }
}

export { usePositionDatatable }
