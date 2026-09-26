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
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

import { CreateFundTableColumns } from "../datatable/table-columns"
import type {
  FundNameLookups,
  FundRowSummary,
} from "../types/fund-list.types"
import { useFundBulkDelete } from "./use-fund-bulk-delete.hook"
import { useFundRowActions } from "./use-fund-row-actions.hook"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  FundResponseDTO
>()

/**
 * @summary
 * Coordinates the fund datatable instance.
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
 * @param funds - The rows rendered by the datatable.
 * @param summaries - The per-row position counts.
 * @param names - The registry name lookups.
 *
 * @returns The shared table and the dialog flows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useFundDatatable(
  funds: FundResponseDTO[],
  summaries: Record<string, FundRowSummary> | null = null,
  names: FundNameLookups = {
    banks: {},
    benchmarks: {},
    categories: {},
  }
) {
  const addDialog = useEntityAddDialog()
  const editDialog = useEntityEditDialog<FundResponseDTO>()
  const rowActions = useFundRowActions()
  const bulkDelete = useFundBulkDelete()

  const summaryFor = useCallback(
    (fundId: string) => summaries?.[fundId] ?? null,
    [summaries]
  )

  const bankNameFor = useCallback(
    (bankId: string) => names.banks[bankId] ?? null,
    [names]
  )

  const benchmarkNameFor = useCallback(
    (benchmarkId: string) =>
      names.benchmarks[benchmarkId] ?? null,
    [names]
  )

  const categoryNameFor = useCallback(
    (categoryId: string) => names.categories[categoryId] ?? null,
    [names]
  )

  const COLUMNS = useMemo(
    () =>
      CreateFundTableColumns(COLUMN_HELPER, {
        onEdit: editDialog.handleOpen,
        onDelete: rowActions.handleDelete,
        summaryFor,
        bankNameFor,
        benchmarkNameFor,
        categoryNameFor,
      }),
    [
      editDialog.handleOpen,
      rowActions.handleDelete,
      summaryFor,
      bankNameFor,
      benchmarkNameFor,
      categoryNameFor,
    ]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: funds,
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

export { useFundDatatable }
