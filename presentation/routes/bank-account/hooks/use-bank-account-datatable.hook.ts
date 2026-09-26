"use client"

import { useCallback, useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { useEntityEditDialog } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

import { CreateBankAccountTableColumns } from "../datatable/table-columns"
import { EMPTY_BANK_ACCOUNT_NAME_LOOKUPS } from "../helpers/build-bank-account-name-lookups.helper"
import type {
  BankAccountNameLookups,
  BankAccountRowSummary,
} from "../types/bank-account-list.types"
import { useBankAccountBulkDelete } from "./use-bank-account-bulk-delete.hook"
import { useBankAccountRowActions } from "./use-bank-account-row-actions.hook"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  BankAccountResponseDTO
>()

/**
 * @summary
 * Coordinates the bank account datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the toolbar,
 * the datatable and the pagination, wiring the row
 * actions, the add/edit dialogs and the bulk delete
 * flow into the column definitions.
 * The pagination starts at ten rows per page; it is
 * seeded through `initialState` so the slice stays
 * mutable — the `state` option would treat it as
 * controlled and ignore every page and page-size
 * change.
 *
 * @param bankAccounts - The rows rendered by the
 *                       datatable.
 * @param names - The bank account name lookups.
 * @param summaries - The derived per-row entry counts.
 *
 * @returns The shared table and the dialog flows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useBankAccountDatatable(
  bankAccounts: BankAccountResponseDTO[],
  names: BankAccountNameLookups = EMPTY_BANK_ACCOUNT_NAME_LOOKUPS,
  summaries: Record<string, BankAccountRowSummary> | null = null
) {
  const addDialog = useEntityAddDialog()
  const editDialog =
    useEntityEditDialog<BankAccountResponseDTO>()
  const rowActions = useBankAccountRowActions()
  const bulkDelete = useBankAccountBulkDelete()

  const nameFor = useCallback(
    (bankAccountId: string) =>
      names.bankAccounts[bankAccountId] ?? null,
    [names]
  )

  const summaryFor = useCallback(
    (bankAccountId: string) =>
      summaries?.[bankAccountId] ?? null,
    [summaries]
  )

  const COLUMNS = useMemo(
    () =>
      CreateBankAccountTableColumns(COLUMN_HELPER, {
        onEdit: editDialog.handleOpen,
        onDelete: rowActions.handleDelete,
        nameFor,
        summaryFor,
      }),
    [
      editDialog.handleOpen,
      rowActions.handleDelete,
      nameFor,
      summaryFor,
    ]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: bankAccounts,
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

export { useBankAccountDatatable }
