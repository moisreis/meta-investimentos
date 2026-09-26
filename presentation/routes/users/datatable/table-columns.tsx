"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import {
  USER_DATATABLE,
  USER_EMAIL_VERIFIED_LABELS,
  USER_ROLE_LABELS,
} from "@/presentation/routes/users/settings/labels.settings"
import type { UserRole } from "@/services/user/dto/create-user.dto"
import type { UserResponseDTO } from "@/services/user/dto/user-response.dto"

export interface UserTableColumnOptions {
  onEdit: (user: UserResponseDTO) => void
  onDelete: (user: UserResponseDTO) => void
}

/**
 * @summary
 * Builds the column definitions of the user datatable.
 *
 * @remarks
 * Pins the selection and actions columns to the start and
 * the end. The user column renders the name with the email
 * as a subtitle while the CPF, role and verification
 * columns render their display labels. Dates render
 * through the date presenter aligned to the end.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks.
 *
 * @returns The user column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreateUserTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    UserResponseDTO
  >,
  options: UserTableColumnOptions
): ColumnDef<EntityTableFeatures, UserResponseDTO, any>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor("name", {
      header: USER_DATATABLE.COLUMN_NAME,
      size: 240,
      meta: { fluid: true },
      cell: (info) => {
        const USER = info.row.original

        return (
          <div className="min-w-0">
            <p className="truncate font-medium">{USER.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {USER.email}
            </p>
          </div>
        )
      },
    }),

    columnHelper.accessor("maskedCpf", {
      id: "maskedCpf",
      header: USER_DATATABLE.COLUMN_CPF,
      size: 160,
      meta: { fluid: true },
      cell: (info) => String(info.getValue()),
    }),

    columnHelper.accessor("role", {
      id: "role",
      header: USER_DATATABLE.COLUMN_ROLE,
      size: 120,
      meta: { fluid: true },
      cell: (info) =>
        USER_ROLE_LABELS[info.getValue() as UserRole],
    }),

    columnHelper.accessor("emailVerified", {
      id: "emailVerified",
      header: USER_DATATABLE.COLUMN_EMAIL_VERIFIED,
      size: 150,
      meta: { fluid: true },
      cell: (info) => (
        <span
          className={
            info.getValue()
              ? "text-emerald-600"
              : "text-muted-foreground"
          }
        >
          {info.getValue()
            ? USER_EMAIL_VERIFIED_LABELS.YES
            : USER_EMAIL_VERIFIED_LABELS.NO}
        </span>
      ),
    }),

    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: USER_DATATABLE.COLUMN_CREATED_AT,
      size: 130,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatDate(info.getValue()),
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
          label={USER_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "edit",
              label: USER_DATATABLE.ROW_EDIT_LABEL,
              onSelect: () => options.onEdit(row.original),
            },
            {
              key: "delete",
              label: USER_DATATABLE.ROW_DELETE_LABEL,
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
