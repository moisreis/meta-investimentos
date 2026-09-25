"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { BANK_DATATABLE } from "@/presentation/routes/bank/settings/labels.settings"
import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"

import type { BankRowSummary } from "../types/bank-list.types"

export interface BankTableColumnOptions {
  onEdit: (bank: BankResponseDTO) => void
  onDelete: (bank: BankResponseDTO) => void
  summaryFor: (bankId: string) => BankRowSummary | null
}

/**
 * @summary
 * Builds the column definitions of the bank datatable.
 *
 * @remarks
 * Pins the selection and code columns to the start and
 * the actions column to the end. The pinned columns keep
 * a fixed width through the size clamp while the fluid
 * ones grow or shrink to fit the available width and
 * their overflow is truncated instead of spilling into
 * the neighbor columns. Count columns render through the
 * count presenter and dates through the date presenter,
 * both aligned to the end. The account count column
 * resolves its derived data per row through `summaryFor`.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks.
 *
 * @returns The bank column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreateBankTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    BankResponseDTO
  >,
  options: BankTableColumnOptions
): ColumnDef<EntityTableFeatures, BankResponseDTO, any>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor("code", {
      header: BANK_DATATABLE.COLUMN_CODE,
      enableHiding: false,
      size: 130,
      minSize: 130,
      maxSize: 130,
      meta: { pinned: "start" },
    }),

    columnHelper.accessor("name", {
      header: BANK_DATATABLE.COLUMN_NAME,
      size: 220,
      meta: { fluid: true },
    }),

    columnHelper.accessor(
      (row) => options.summaryFor(row.id)?.accountCount ?? 0,
      {
        id: "accountCount",
        header: BANK_DATATABLE.COLUMN_ACCOUNT_COUNT,
        size: 110,
        meta: { align: "end", fluid: true },
        cell: (info) => FormatCount(info.getValue()),
      }
    ),

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
          label={BANK_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "edit",
              label: BANK_DATATABLE.ROW_EDIT_LABEL,
              onSelect: () => options.onEdit(row.original),
            },
            {
              key: "delete",
              label: BANK_DATATABLE.ROW_DELETE_LABEL,
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
