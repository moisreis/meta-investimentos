"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import { PORTFOLIO_DATATABLE } from "@/presentation/routes/portfolio/settings/labels.settings"
import type { PortfolioPerformanceResponseDTO } from "@/services/portfolio-performance/dto/portfolio-performance-response.dto"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

export interface PortfolioTableColumnOptions {
  onEdit: (portfolio: PortfolioResponseDTO) => void
  onDelete: (portfolio: PortfolioResponseDTO) => void
  onView: (portfolio: PortfolioResponseDTO) => void
  performanceFor: (
    portfolioId: string
  ) => PortfolioPerformanceResponseDTO | null
}

/**
 * @summary
 * Builds the column definitions of the portfolio datatable.
 *
 * @remarks
 * Pins the selection and acronym columns to the start and
 * the actions column to the end. Data columns are fluid:
 * they share the available width when columns are hidden
 * and stop at a readable minimum when space runs out, so
 * the table scrolls horizontally instead of collapsing.
 * Rate columns render through the percentage presenter
 * and money columns through the currency presenter, both
 * aligned to the end. Performance columns resolve the
 * snapshot of the selected range through `performanceFor`.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks.
 *
 * @returns The portfolio column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreatePortfolioTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    PortfolioResponseDTO
  >,
  options: PortfolioTableColumnOptions
): ColumnDef<EntityTableFeatures, PortfolioResponseDTO, any>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor("acronym", {
      header: PORTFOLIO_DATATABLE.COLUMN_ACRONYM,
      enableHiding: false,
      size: 130,
      meta: { pinned: "start" },
    }),

    columnHelper.accessor("name", {
      header: PORTFOLIO_DATATABLE.COLUMN_NAME,
      size: 220,
      meta: { fluid: true },
    }),

    columnHelper.accessor("annualInterestRate", {
      header: PORTFOLIO_DATATABLE.COLUMN_ANNUAL_INTEREST_RATE,
      size: 120,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("minAllocation", {
      header: PORTFOLIO_DATATABLE.COLUMN_MIN_ALLOCATION,
      size: 120,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("targetAllocation", {
      header: PORTFOLIO_DATATABLE.COLUMN_TARGET_ALLOCATION,
      size: 120,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("maxAllocation", {
      header: PORTFOLIO_DATATABLE.COLUMN_MAX_ALLOCATION,
      size: 120,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor(
      (row) => options.performanceFor(row.id)?.patrimony ?? null,
      {
        id: "patrimony",
        header: PORTFOLIO_DATATABLE.COLUMN_PATRIMONY,
        size: 120,
        meta: { align: "end", fluid: true },
        cell: (info) => FormatCurrency(info.getValue()),
      }
    ),

    columnHelper.accessor(
      (row) => options.performanceFor(row.id)?.earnings ?? null,
      {
        id: "earnings",
        header: PORTFOLIO_DATATABLE.COLUMN_EARNINGS,
        size: 120,
        meta: { align: "end", fluid: true },
        cell: (info) => FormatCurrency(info.getValue()),
      }
    ),

    columnHelper.accessor(
      (row) =>
        options.performanceFor(row.id)?.returnDaily ?? null,
      {
        id: "returnDaily",
        header: PORTFOLIO_DATATABLE.COLUMN_RETURN_DAILY,
        size: 110,
        meta: { align: "end", fluid: true },
        cell: (info) => FormatPercentage(info.getValue()),
      }
    ),

    columnHelper.accessor(
      (row) =>
        options.performanceFor(row.id)?.returnMonthly ?? null,
      {
        id: "returnMonthly",
        header: PORTFOLIO_DATATABLE.COLUMN_RETURN_MONTHLY,
        size: 110,
        meta: { align: "end", fluid: true },
        cell: (info) => FormatPercentage(info.getValue()),
      }
    ),

    columnHelper.display({
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      size: 50,
      meta: { pinned: "end", align: "center" },
      cell: ({ row }) => (
        <EntityTableRowMenuDropdown
          label={PORTFOLIO_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "view",
              label: PORTFOLIO_DATATABLE.ROW_VIEW_LABEL,
              onSelect: () => options.onView(row.original),
            },
            {
              key: "edit",
              label: PORTFOLIO_DATATABLE.ROW_EDIT_LABEL,
              onSelect: () => options.onEdit(row.original),
            },
            {
              key: "delete",
              label: PORTFOLIO_DATATABLE.ROW_DELETE_LABEL,
              variant: "destructive",
              separatorBefore: true,
              onSelect: () => options.onDelete(row.original),
            },
          ]}
        />
      ),
    }),
  ]
}
