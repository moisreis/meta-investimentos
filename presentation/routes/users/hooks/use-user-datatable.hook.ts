"use client"

import { useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

import { CreateUserTableColumns } from "../datatable/table-columns"
import { useUserAddDialog } from "./use-user-add-dialog.hook"
import { useUserBulkDelete } from "./use-user-bulk-delete.hook"
import { useUserEditDialog } from "./use-user-edit-dialog.hook"
import { useUserRowActions } from "./use-user-row-actions.hook"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  UserResponseDTO
>()

/**
 * @summary
 * Coordinates the user datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the toolbar,
 * the datatable and the pagination, wiring the row actions,
 * the add/edit dialogs and the bulk delete flow into the
 * column definitions.
 * The pagination starts at ten rows per page; it is seeded
 * through `initialState` so the slice stays mutable — the
 * `state` option would treat it as controlled and ignore
 * every page and page-size change.
 *
 * @param users - The rows rendered by the datatable.
 *
 * @returns The shared table and the dialog flows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useUserDatatable(users: UserResponseDTO[]) {
  const addDialog = useUserAddDialog()
  const editDialog = useUserEditDialog()
  const rowActions = useUserRowActions()
  const bulkDelete = useUserBulkDelete()

  const COLUMNS = useMemo(
    () =>
      CreateUserTableColumns(COLUMN_HELPER, {
        onEdit: editDialog.handleOpen,
        onDelete: rowActions.handleDelete,
      }),
    [editDialog.handleOpen, rowActions.handleDelete]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: users,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return {
    table: TABLE,
    rowActions,
    bulkDelete,
    addDialog,
    editDialog,
  }
}

export { useUserDatatable }
