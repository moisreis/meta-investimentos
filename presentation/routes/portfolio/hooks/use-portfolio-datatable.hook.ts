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
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

import { CreatePortfolioTableColumns } from "../datatable/table-columns"
import { usePortfolioBulkDelete } from "./use-portfolio-bulk-delete.hook"
import { usePortfolioRowActions } from "./use-portfolio-row-actions.hook"
import type { PortfolioRowSummary } from "../types/portfolio-list.types"

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
 * @param summaries - Derived per-row data (fund and bank
 * account counts plus the owner) keyed by portfolio id.
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
  summaries: Record<string, PortfolioRowSummary> | null = null
) {
  const addDialog = useEntityAddDialog()
  const editDialog = useEntityEditDialog<PortfolioResponseDTO>()
  const rowActions = usePortfolioRowActions()
  const bulkDelete = usePortfolioBulkDelete()

  const summaryFor = useCallback(
    (portfolioId: string) => summaries?.[portfolioId] ?? null,
    [summaries]
  )

  const COLUMNS = useMemo(
    () =>
      CreatePortfolioTableColumns(COLUMN_HELPER, {
        onView: rowActions.handleView,
        onEdit: editDialog.handleOpen,
        onDelete: rowActions.handleDelete,
        performanceFor,
        summaryFor,
      }),
    [
      editDialog.handleOpen,
      performanceFor,
      rowActions.handleDelete,
      rowActions.handleView,
      summaryFor,
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
