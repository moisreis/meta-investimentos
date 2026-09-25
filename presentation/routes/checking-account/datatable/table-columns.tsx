"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { CHECKING_ACCOUNT_DATATABLE } from "@/presentation/routes/checking-account/settings/labels.settings"
import { FormatBankAccountLabel } from "@/presentation/routes/checking-account/helpers/build-checking-account-name-lookups.helper"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

import type { CheckingAccountNameLookup } from "../types/checking-account-list.types"

export interface CheckingAccountTableColumnOptions {
  onEdit: (entry: CheckingAccountResponseDTO) => void
  onDelete: (entry: CheckingAccountResponseDTO) => void
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
    CheckingAccountResponseDTO
  >,
  options: CheckingAccountTableColumnOptions
): ColumnDef<
  EntityTableFeatures,
  CheckingAccountResponseDTO,
  any
>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor(
      (row) => options.accountFor(row.bankAccountId),
      {
        id: "bankAccountId",
        header: CHECKING_ACCOUNT_DATATABLE.COLUMN_BANK_ACCOUNT,
        size: 230,
        meta: { fluid: true },
        cell: (info) => {
          const LOOKUP = info.getValue()

          if (!LOOKUP) {
            return (
              <span className="text-muted-foreground">—</span>
            )
          }

          return (
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate font-medium">
                {LOOKUP.bankName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {FormatBankAccountLabel(
                  LOOKUP.agency,
                  LOOKUP.accountNumber
                )}
              </span>
            </div>
          )
        },
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
