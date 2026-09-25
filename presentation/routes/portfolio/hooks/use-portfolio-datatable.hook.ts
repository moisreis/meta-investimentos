"use client"

import { useCallback, useMemo } from "react"
import {
  createColumnHelper,
  useTable,
} from "@tanstack/react-table"

import { ENTITY_TABLE_FEATURES } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import { CreatePortfolioTableColumns } from "../datatable/table-columns"
import { usePortfolioAddDialog } from "./use-portfolio-add-dialog.hook"
import { usePortfolioBulkDelete } from "./use-portfolio-bulk-delete.hook"
import { usePortfolioEditDialog } from "./use-portfolio-edit-dialog.hook"
import { usePortfolioRowActions } from "./use-portfolio-row-actions.hook"
import type {
  PortfolioHoldingsCount,
  PortfolioOwner,
} from "../types/portfolio-list.types"

// Column helper bound to the entity table features.
const COLUMN_HELPER = createColumnHelper<
  EntityTableFeatures,
  PortfolioResponseDTO
>()

/**
 * @summary
 * Coordinates the portfolio datatable instance.
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
 * @param portfolios - The rows rendered by the datatable.
 * @param performanceFor - Resolves the range snapshot.
 * @param holdingsCounts - Tallies of funds and bank
 * accounts keyed by portfolio id.
 * @param owner - The display data of the owning user.
 *
 * @returns The table instance plus the action flows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function usePortfolioDatatable(
  portfolios: PortfolioResponseDTO[],
  performanceFor: (
    portfolioId: string
  ) => PortfolioPerformanceResponseDTO | null,
  holdingsCounts: Record<
    string,
    PortfolioHoldingsCount
  > | null = null,
  owner: PortfolioOwner | null = null
) {
  const addDialog = usePortfolioAddDialog()
  const editDialog = usePortfolioEditDialog()
  const rowActions = usePortfolioRowActions()
  const bulkDelete = usePortfolioBulkDelete()

  const fundCountOf = useCallback(
    (portfolioId: string) =>
      holdingsCounts?.[portfolioId]?.fundCount ?? 0,
    [holdingsCounts]
  )

  const bankAccountCountOf = useCallback(
    (portfolioId: string) =>
      holdingsCounts?.[portfolioId]?.bankAccountCount ?? 0,
    [holdingsCounts]
  )

  const COLUMNS = useMemo(
    () =>
      CreatePortfolioTableColumns(COLUMN_HELPER, {
        onView: rowActions.handleView,
        onEdit: editDialog.handleOpen,
        onDelete: rowActions.handleDelete,
        performanceFor,
        fundCountOf,
        bankAccountCountOf,
        owner,
      }),
    [
      bankAccountCountOf,
      editDialog.handleOpen,
      fundCountOf,
      owner,
      performanceFor,
      rowActions.handleDelete,
      rowActions.handleView,
    ]
  )

  const TABLE = useTable({
    features: ENTITY_TABLE_FEATURES,
    columns: COLUMNS,
    data: portfolios,
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

export { usePortfolioDatatable }
