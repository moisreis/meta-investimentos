"use client"

import { useCallback, useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"

import { CreateApplicationTableColumns } from "../datatable/table-columns"
import { EMPTY_APPLICATION_LOOKUPS } from "../helpers/build-application-lookups.helper"
import type { ApplicationLookups } from "../types/application-list.types"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  ApplicationResponseDTO
>()

/**
 * @summary
 * Coordinates the application datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the
 * datatable and the pagination, wiring the portfolio and
 * fund name resolution into the column definitions. The
 * pagination starts at ten rows per page; it is seeded
 * through `initialState` so the slice stays mutable.
 *
 * @param applications - The rows rendered by the table.
 * @param lookups - The application lookups.
 *
 * @returns The shared table instance.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useApplicationDatatable(
  applications: ApplicationResponseDTO[],
  lookups: ApplicationLookups = EMPTY_APPLICATION_LOOKUPS
) {
  const rowFor = useCallback(
    (applicationId: string) =>
      lookups.rows[applicationId] ?? null,
    [lookups]
  )

  const COLUMNS = useMemo(
    () =>
      CreateApplicationTableColumns(COLUMN_HELPER, {
        rowFor,
      }),
    [rowFor]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: applications,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return { table: TABLE }
}

export { useApplicationDatatable }
