"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { FormatPercentage } from "@/presentation/presenters/percentage.presenter"
import { FormatText } from "@/presentation/presenters/text.presenter"
import { FUND_DATATABLE } from "@/presentation/routes/fund/settings/labels.settings"
import type { FundResponseDTO } from "@/services/fund/dto/fund-response.dto"

import type { FundRowSummary } from "../types/fund-list.types"

export interface FundTableColumnOptions {
  onEdit: (fund: FundResponseDTO) => void
  onDelete: (fund: FundResponseDTO) => void
  summaryFor: (fundId: string) => FundRowSummary | null
  bankNameFor: (bankId: string) => string | null
  benchmarkNameFor: (benchmarkId: string) => string | null
  categoryNameFor: (categoryId: string) => string | null
}

/**
 * @summary
 * Builds the column definitions of the fund datatable.
 *
 * @remarks
 * Pins the selection and **CNPJ** columns to the start
 * and the actions column to the end. The pinned
 * columns keep a fixed width through the size clamp
 * while the fluid ones grow or shrink to fit the
 * available width and their overflow is truncated
 * instead of spilling into the neighbor columns. Count
 * and percentage columns render through their
 * presenters and are aligned to the end. The position
 * count column resolves its derived data per row
 * through `summaryFor` and the registry columns resolve
 * their names through the name lookups.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks.
 *
 * @returns The fund column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreateFundTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    FundResponseDTO
  >,
  options: FundTableColumnOptions
): ColumnDef<EntityTableFeatures, FundResponseDTO, any>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor("cnpj", {
      header: FUND_DATATABLE.COLUMN_CNPJ,
      enableHiding: false,
      size: 170,
      minSize: 170,
      maxSize: 170,
      meta: { pinned: "start" },
    }),

    columnHelper.accessor("name", {
      header: FUND_DATATABLE.COLUMN_NAME,
      size: 220,
      meta: { fluid: true },
    }),

    columnHelper.accessor(
      (row) => options.summaryFor(row.id)?.positionCount ?? 0,
      {
        id: "positionCount",
        header: FUND_DATATABLE.COLUMN_POSITION_COUNT,
        size: 110,
        meta: { align: "end", fluid: true },
        cell: (info) => FormatCount(info.getValue()),
      }
    ),

    columnHelper.accessor(
      (row) => options.bankNameFor(row.bankId),
      {
        id: "bankId",
        header: FUND_DATATABLE.COLUMN_BANK,
        size: 150,
        meta: { fluid: true },
        cell: (info) => FormatText(info.getValue()),
      }
    ),

    columnHelper.accessor(
      (row) =>
        row.benchmarkId
          ? options.benchmarkNameFor(row.benchmarkId)
          : null,
      {
        id: "benchmarkId",
        header: FUND_DATATABLE.COLUMN_BENCHMARK,
        size: 130,
        meta: { fluid: true },
        cell: (info) => FormatText(info.getValue()),
      }
    ),

    columnHelper.accessor(
      (row) =>
        row.categoryId
          ? options.categoryNameFor(row.categoryId)
          : null,
      {
        id: "categoryId",
        header: FUND_DATATABLE.COLUMN_CATEGORY,
        size: 130,
        meta: { fluid: true },
        cell: (info) => FormatText(info.getValue()),
      }
    ),

    columnHelper.accessor("administrationFee", {
      header: FUND_DATATABLE.COLUMN_ADMINISTRATION_FEE,
      size: 110,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.accessor("performanceFee", {
      header: FUND_DATATABLE.COLUMN_PERFORMANCE_FEE,
      size: 110,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatPercentage(info.getValue()),
    }),

    columnHelper.display({
      id: "actions",
      enableSorting: false,
      enableHiding: false,
      size: 50,
      minSize: 50,
      maxSize: 50,
      meta: { pinned: "end", align: "center" },
      cell: ({ row }) => (
        <EntityTableRowMenuDropdown
          label={FUND_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "edit",
              label: FUND_DATATABLE.ROW_EDIT_LABEL,
              onSelect: () => options.onEdit(row.original),
            },
            {
              key: "delete",
              label: FUND_DATATABLE.ROW_DELETE_LABEL,
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
