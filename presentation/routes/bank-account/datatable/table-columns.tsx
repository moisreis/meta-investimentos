"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import { BANK_ACCOUNT_DATATABLE } from "@/presentation/routes/bank-account/settings/labels.settings"
import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

import type {
  BankAccountNameLookup,
  BankAccountRowSummary,
} from "../types/bank-account-list.types"

export interface BankAccountTableColumnOptions {
  onEdit: (bankAccount: BankAccountResponseDTO) => void
  onDelete: (bankAccount: BankAccountResponseDTO) => void
  nameFor: (
    bankAccountId: string
  ) => BankAccountNameLookup | null
  summaryFor: (
    bankAccountId: string
  ) => BankAccountRowSummary | null
}

/**
 * @summary
 * Builds the column definitions of the bank account
 * datatable.
 *
 * @remarks
 * Pins the selection column to the start and the
 * actions column to the end. The pinned columns keep a
 * fixed width through the size clamp while the fluid
 * ones grow or shrink to fit the available width and
 * their overflow is truncated instead of spilling into
 * the neighbor columns. The portfolio and bank columns
 * resolve their derived data per row through
 * `nameFor`; the checking count column resolves through
 * `summaryFor` and renders with the count presenter.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks.
 *
 * @returns The bank account column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreateBankAccountTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    BankAccountResponseDTO
  >,
  options: BankAccountTableColumnOptions
): ColumnDef<
  EntityTableFeatures,
  BankAccountResponseDTO,
  any
>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor((row) => options.nameFor(row.id), {
      id: "portfolioId",
      header: BANK_ACCOUNT_DATATABLE.COLUMN_PORTFOLIO,
      size: 180,
      meta: { fluid: true },
      cell: (info) => {
        const LOOKUP = info.getValue()

        if (!LOOKUP) {
          return <span className="text-muted-foreground">—</span>
        }

        return (
          <span className="truncate">
            {LOOKUP.portfolioName}
          </span>
        )
      },
    }),

    columnHelper.accessor((row) => options.nameFor(row.id), {
      id: "bankId",
      header: BANK_ACCOUNT_DATATABLE.COLUMN_BANK,
      size: 220,
      meta: { fluid: true },
      cell: (info) => {
        const LOOKUP = info.getValue()

        if (!LOOKUP) {
          return <span className="text-muted-foreground">—</span>
        }

        return (
          <span className="truncate font-medium">
            {LOOKUP.bankName}
          </span>
        )
      },
    }),

    columnHelper.accessor("agency", {
      header: BANK_ACCOUNT_DATATABLE.COLUMN_AGENCY,
      size: 120,
      meta: { fluid: true },
    }),

    columnHelper.accessor("accountNumber", {
      header: BANK_ACCOUNT_DATATABLE.COLUMN_ACCOUNT_NUMBER,
      size: 160,
      meta: { fluid: true },
    }),

    columnHelper.accessor(
      (row) => options.summaryFor(row.id)?.checkingCount ?? 0,
      {
        id: "checkingCount",
        header: BANK_ACCOUNT_DATATABLE.COLUMN_CHECKING_COUNT,
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
          label={BANK_ACCOUNT_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "edit",
              label: BANK_ACCOUNT_DATATABLE.ROW_EDIT_LABEL,
              onSelect: () => options.onEdit(row.original),
            },
            {
              key: "delete",
              label: BANK_ACCOUNT_DATATABLE.ROW_DELETE_LABEL,
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
