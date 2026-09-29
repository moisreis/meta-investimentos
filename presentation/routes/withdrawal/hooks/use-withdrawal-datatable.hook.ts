"use client"

import { useCallback, useMemo } from "react"
import {
  ColumnHelper,
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { WithdrawalRow } from "@/presentation/types/withdrawal-row.types"

import { CreateWithdrawalTableColumns } from "../datatable/table-columns"
import { EMPTY_WITHDRAWAL_LOOKUPS } from "../helpers/build-withdrawal-lookups.helper"
import type { WithdrawalLookups } from "../types/withdrawal-list.types"
import { useWithdrawalRowActions } from "./use-withdrawal-row-actions.hook"
import { useEntityAddDialog } from "@/presentation/parts/hooks/use-entity-add-dialog.hook"
import { useEntityEditDialog } from "@/presentation/parts/hooks/use-entity-edit-dialog.hook"

// Column helper bound to the entity table features.
const COLUMN_HELPER: ColumnHelper<
  EntityTableFeatures,
  WithdrawalRow
> = createColumnHelper<EntityTableFeatures, WithdrawalRow>()

/**
 * @summary
 * Coordinates the withdrawal datatable instance.
 *
 * @remarks
 * Creates the shared table instance used by the
 * datatable and the pagination, wiring the portfolio and
 * fund name resolution into the column definitions. The
 * pagination starts at ten rows per page; it is seeded
 * through `initialState` so the slice stays mutable.
 *
 * @param withdrawals - The rows rendered by the table.
 * @param lookups - The withdrawal lookups.
 *
 * @returns The shared table instance and row actions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
function useWithdrawalDatatable(
  withdrawals: WithdrawalRow[],
  lookups: WithdrawalLookups = EMPTY_WITHDRAWAL_LOOKUPS
) {
  const rowActions = useWithdrawalRowActions()
  const editDialog = useEntityEditDialog<WithdrawalRow>()
  const addDialog = useEntityAddDialog()

  const rowFor = useCallback(
    (withdrawalId: string) => lookups.rows[withdrawalId] ?? null,
    [lookups]
  )

  const COLUMNS = useMemo(
    () =>
      CreateWithdrawalTableColumns(COLUMN_HELPER, {
        rowFor,
        onEdit: editDialog.handleOpen,
        onReverse: rowActions.handleReverse,
        onDelete: rowActions.handleDelete,
      }),
    [
      rowFor,
      editDialog.handleOpen,
      rowActions.handleReverse,
      rowActions.handleDelete,
    ]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: withdrawals,
    getRowId: (row) => row.id,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  return { table: TABLE, rowActions, editDialog, addDialog }
}

export { useWithdrawalDatatable }