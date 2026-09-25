"use client"

import { useCallback, useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

import { CreateCheckingAccountTableColumns } from "../datatable/table-columns"
import { EMPTY_CHECKING_ACCOUNT_NAME_LOOKUPS } from "../helpers/build-checking-account-name-lookups.helper"
import type { CheckingAccountNameLookups } from "../types/checking-account-list.types"
import { useAddCheckingAccountDialog } from "./use-add-checking-account-dialog.hook"
import { useCheckingAccountBulkDelete } from "./use-checking-account-bulk-delete.hook"
import { useCheckingAccountRowActions } from "./use-checking-account-row-actions.hook"
import { useEditCheckingAccountDialog } from "./use-edit-checking-account-dialog.hook"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  CheckingAccountResponseDTO
>()

/**
 * @summary
 * Coordinates the checking account datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the
 * toolbar, the datatable and the pagination, wiring
 * the row actions, the add/edit dialogs and the bulk
 * delete flow into the column definitions.
 * The pagination starts at ten rows per page; it is
 * seeded through `initialState` so the slice stays
 * mutable — the `state` option would treat it as
 * controlled and ignore every page and page-size
 * change.
 *
 * @param entries - The rows rendered by the datatable.
 * @param names - The bank account name lookups.
 *
 * @returns The shared table and the dialog flows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useCheckingAccountDatatable(
  entries: CheckingAccountResponseDTO[],
  names: CheckingAccountNameLookups = EMPTY_CHECKING_ACCOUNT_NAME_LOOKUPS
) {
  const addDialog = useAddCheckingAccountDialog()
  const editDialog = useEditCheckingAccountDialog()
  const rowActions = useCheckingAccountRowActions()
  const bulkDelete = useCheckingAccountBulkDelete()

  const accountFor = useCallback(
    (bankAccountId: string) =>
      names.bankAccounts[bankAccountId] ?? null,
    [names]
  )

  const COLUMNS = useMemo(
    () =>
      CreateCheckingAccountTableColumns(COLUMN_HELPER, {
        onEdit: editDialog.handleOpen,
        onDelete: rowActions.handleDelete,
        accountFor,
      }),
    [editDialog.handleOpen, rowActions.handleDelete, accountFor]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: entries,
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

export { useCheckingAccountDatatable }
