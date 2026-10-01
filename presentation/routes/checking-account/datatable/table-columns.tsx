"use client"

import type { ColumnHelper } from "@tanstack/react-table"

import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { FormatBankAccountLookup } from "@/presentation/presenters/lookup.presenter"
import { CHECKING_ACCOUNT_DATATABLE } from "@/presentation/routes/checking-account/settings/labels.settings"
import type { CheckingAccountRow } from "@/presentation/types/checking-account-row.types"

import type { CheckingAccountNameLookup } from "../types/checking-account-list.types"

export interface CheckingAccountTableColumnOptions {
  onEdit: (entry: CheckingAccountRow) => void
  onDelete: (entry: CheckingAccountRow) => void
  accountFor: (
    bankAccountId: string
  ) => CheckingAccountNameLookup | null
}

/**
 * @summary
 * Builds the column definitions of the checking account
 * datatable.
 *
 * @remarks
 * Pins the selection column to the start and the
 * actions column to the end. The pinned columns keep a
 * fixed width through the size clamp while the fluid
 * ones grow or shrink to fit the available width and
 * their overflow is truncated instead of spilling into
 * the neighbor columns. The value column renders
 * through the currency presenter and the date column
 * through the date presenter. The bank account column
 * resolves its derived data per row through
 * `accountFor`.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks.
 *
 * @returns The checking account column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreateCheckingAccountTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    CheckingAccountRow
  >,
  options: CheckingAccountTableColumnOptions
): EntityColumnDef<CheckingAccountRow>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor(
      (row) => options.accountFor(row.bankAccountId),
      {
        id: "bankAccountId",
        header: CHECKING_ACCOUNT_DATATABLE.COLUMN_BANK_ACCOUNT,
        size: 230,
        meta: { fluid: true },
        cell: (info) => FormatBankAccountLookup(info.getValue()),
      }
    ),

    columnHelper.accessor("date", {
      header: CHECKING_ACCOUNT_DATATABLE.COLUMN_DATE,
      size: 130,
      meta: { fluid: true },
      cell: (info) => FormatDate(info.getValue()),
    }),

    columnHelper.accessor("value", {
      header: CHECKING_ACCOUNT_DATATABLE.COLUMN_VALUE,
      size: 150,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatCurrency(info.getValue()),
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
          label={CHECKING_ACCOUNT_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "edit",
              label: CHECKING_ACCOUNT_DATATABLE.ROW_EDIT_LABEL,
              onSelect: () => options.onEdit(row.original),
            },
            {
              key: "delete",
              label: CHECKING_ACCOUNT_DATATABLE.ROW_DELETE_LABEL,
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
