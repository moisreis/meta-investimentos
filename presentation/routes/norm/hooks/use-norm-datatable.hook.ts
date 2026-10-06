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
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { useEntityEditDialog } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { NormRow } from "@/presentation/types/norm-row.types"

import { CreateNormTableColumns } from "../datatable/table-columns"
import type { NormNameLookups } from "../types/norm-list.types"

// Column helper bound to the entity table features.
const COLUMN_HELPER: ColumnHelper<EntityTableFeatures, NormRow> =
  createColumnHelper<EntityTableFeatures, NormRow>()

/**
 * @summary
 * Coordinates the norm datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the toolbar,
 * the datatable and the pagination, wiring the add/edit
 * dialogs and the category name lookup into the column
 * definitions.
 * The pagination starts at twenty rows per page; it is seeded
 * through `initialState` so the slice stays mutable — the
 * `state` option would treat it as controlled and ignore
 * every page and page-size change.
 *
 * @param norms - The rows rendered by the datatable.
 * @param names - The category name lookups.
 *
 * @returns The shared table and the dialog flows.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useNormDatatable(
  norms: NormRow[],
  names: NormNameLookups | null = null
) {
  const addDialog = useEntityAddDialog()
  const editDialog = useEntityEditDialog<NormRow>()

  const categoryNameFor = useCallback(
    (categoryId: string) =>
      names?.categories[categoryId] ?? null,
    [names]
  )

  const COLUMNS = useMemo(
    () =>
      CreateNormTableColumns(COLUMN_HELPER, {
        onEdit: editDialog.handleOpen,
        categoryNameFor,
      }),
    [editDialog.handleOpen, categoryNameFor]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: norms,
    getRowId: (row) => row.id,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: ENTITY_TABLE_DEFAULT_PAGE_SIZE,
      },
    },
  })

  return {
    table: TABLE,
    addDialog,
    editDialog,
  }
}

export { useNormDatatable }
