"use client"

import { useCallback, useMemo } from "react"
import {
  ColumnHelper,
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { ENTITY_TABLE_DEFAULT_PAGE_SIZE } from "@/presentation/parts/datatable/settings/entity-table-labels.settings"
import type { ApplicationRow } from "@/presentation/types/application-row.types"

import { CreateApplicationTableColumns } from "../datatable/table-columns"
import { EMPTY_APPLICATION_LOOKUPS } from "../helpers/build-application-lookups.helper"
import type { ApplicationLookups } from "../types/application-list.types"
import { useApplicationRowActions } from "./use-application-row-actions.hook"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { useSharedCommandOpen } from "@/presentation/parts/hooks/use-shared-command-open.hook"

// Column helper bound to the entity table features.
const COLUMN_HELPER: ColumnHelper<
  EntityTableFeatures,
  ApplicationRow
> = createColumnHelper<EntityTableFeatures, ApplicationRow>()

/**
 * @summary
 * Coordinates the application datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the
 * datatable and the pagination, wiring the portfolio and
 * fund name resolution into the column definitions. The
 * pagination starts at twenty rows per page; it is seeded
 * through `initialState` so the slice stays mutable.
 *
 * @param applications - The rows rendered by the table.
 * @param lookups - The application lookups.
 *
 * @returns The shared table instance and row actions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function useApplicationDatatable(
  applications: ApplicationRow[],
  lookups: ApplicationLookups = EMPTY_APPLICATION_LOOKUPS
) {
  const rowActions = useApplicationRowActions()
  const addDialog = useEntityAddDialog()

  // The shell reaches this dialog without naming it: Ctrl+A and
  // the palette row both land on `?command=add-application`, and
  // this screen opens itself when it sees its own id.
  useSharedCommandOpen("add-application", addDialog.handleOpen)

  const rowFor = useCallback(
    (applicationId: string) =>
      lookups.rows[applicationId] ?? null,
    [lookups]
  )

  const COLUMNS = useMemo(
    () =>
      CreateApplicationTableColumns(COLUMN_HELPER, {
        rowFor,
        onReverse: rowActions.handleReverse,
      }),
    [rowFor, rowActions.handleReverse]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: applications,
    getRowId: (row) => row.id,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: ENTITY_TABLE_DEFAULT_PAGE_SIZE,
      },
    },
  })

  return { table: TABLE, rowActions, addDialog }
}

export { useApplicationDatatable }
