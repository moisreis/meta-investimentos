"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import {
  FormatDate,
  FormatDateTime,
} from "@/presentation/presenters/date.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import {
  PORTFOLIO_DATATABLE,
  FormatPortfolioRowActionsLabel,
} from "@/presentation/routes/portfolio/settings/labels.settings"
import type { PortfolioResponseDTO } from "@/services/portfolio/dto/portfolio-response.dto"

export interface PortfolioTableColumnOptions {
  onEdit: (portfolio: PortfolioResponseDTO) => void
  onDelete: (portfolio: PortfolioResponseDTO) => void
}

/**
 * @summary
 * Builds the column definitions of the portfolio datatable.
 *
 * @remarks
 * Pins the selection and acronym columns to the start and
 * the actions column to the end. Rate columns are rendered
 * by the percentage presenter and aligned to the end; date
 * columns use the date presenters.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks.
 *
 * @returns The portfolio column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
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
      size: 96,
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
      meta: { align: "end" },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("minAllocation", {
      header: PORTFOLIO_DATATABLE.COLUMN_MIN_ALLOCATION,
      size: 120,
      meta: { align: "end" },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("targetAllocation", {
      header: PORTFOLIO_DATATABLE.COLUMN_TARGET_ALLOCATION,
      size: 120,
      meta: { align: "end" },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("maxAllocation", {
      header: PORTFOLIO_DATATABLE.COLUMN_MAX_ALLOCATION,
      size: 120,
      meta: { align: "end" },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("createdAt", {
      header: PORTFOLIO_DATATABLE.COLUMN_CREATED_AT,
      size: 150,
      cell: (info) => FormatDate(info.getValue()),
    }),

    columnHelper.accessor("updatedAt", {
      header: PORTFOLIO_DATATABLE.COLUMN_UPDATED_AT,
      size: 150,
      cell: (info) => FormatDateTime(info.getValue()),
    }),

    columnHelper.display({
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      size: 88,
      meta: { pinned: "end", align: "center" },
      cell: ({ row }) => (
        <EntityTableRowMenuDropdown
          label={FormatPortfolioRowActionsLabel(
            row.original.acronym
          )}
          actions={[
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
