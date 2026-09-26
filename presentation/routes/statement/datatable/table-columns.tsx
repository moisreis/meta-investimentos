"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import { CreateEntitySelectColumn } from "@/presentation/parts/datatable/pinned-columns/entity-table-selectable-column"
import { EntityTableRowMenuDropdown } from "@/presentation/parts/datatable/row-menus/entity-table-row-menu-dropdown"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatDateTime } from "@/presentation/presenters/date.presenter"
import { UserAvatar } from "@/presentation/presenters/user-avatar.presenter"
import { STATEMENT_DATATABLE } from "@/presentation/routes/statement/settings/labels.settings"
import type { StatementResponseDTO } from "@/services/statement/dto/statement-response.dto"

import { FormatStatementPeriod } from "../helpers/format-statement-period.helper"
import type { StatementRowSummary } from "../types/statement-list.types"

export interface StatementTableColumnOptions {
  onView: (statement: StatementResponseDTO) => void
  onDelete: (statement: StatementResponseDTO) => void
  summaryFor: (statementId: string) => StatementRowSummary | null
}

/**
 * @summary
 * Builds the column definitions of the statement datatable.
 *
 * @remarks
 * Pins the selection and the period columns to the start and
 * the actions column to the end. The period column sorts by
 * the raw ISO value so rows order chronologically. Portfolio
 * and generating-user columns resolve their derived data per
 * row through `summaryFor`.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The row action callbacks.
 *
 * @returns The statement column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreateStatementTableColumns(
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    StatementResponseDTO
  >,
  options: StatementTableColumnOptions
): ColumnDef<EntityTableFeatures, StatementResponseDTO, any>[] {
  return [
    CreateEntitySelectColumn(columnHelper),

    columnHelper.accessor("periodStart", {
      id: "period",
      header: STATEMENT_DATATABLE.COLUMN_PERIOD,
      enableHiding: false,
      size: 130,
      minSize: 130,
      maxSize: 130,
      meta: { pinned: "start" },
      cell: (info) => FormatStatementPeriod(info.getValue()),
    }),

    columnHelper.accessor(
      (row) => options.summaryFor(row.id) ?? null,
      {
        id: "portfolio",
        header: STATEMENT_DATATABLE.COLUMN_PORTFOLIO,
        size: 220,
        enableSorting: false,
        meta: { fluid: true },
        cell: (info) => {
          const SUMMARY = info.getValue()

          if (!SUMMARY) {
            return (
              <span className="text-muted-foreground">-</span>
            )
          }

          return (
            <div className="flex flex-col">
              <span>{SUMMARY.portfolioAcronym}</span>
              <span className="text-muted-foreground">
                {SUMMARY.portfolioName}
              </span>
            </div>
          )
        },
      }
    ),

    columnHelper.accessor("fileUrl", {
      id: "file",
      header: STATEMENT_DATATABLE.COLUMN_FILE,
      size: 90,
      enableSorting: false,
      meta: { fluid: true },
      cell: (info) => (
        <a
          href={info.getValue()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {STATEMENT_DATATABLE.COLUMN_FILE_OPEN_LABEL}
        </a>
      ),
    }),

    columnHelper.accessor("generatedByUserId", {
      id: "generatedBy",
      header: STATEMENT_DATATABLE.COLUMN_GENERATED_BY,
      size: 200,
      enableSorting: false,
      meta: { fluid: true },
      cell: ({ row }) => {
        const GENERATED_BY =
          options.summaryFor(row.id)?.generatedBy ?? null

        if (!GENERATED_BY) {
          return <span className="text-muted-foreground">-</span>
        }

        return (
          <UserAvatar
            firstName={GENERATED_BY.firstName}
            lastName={GENERATED_BY.lastName}
            image={GENERATED_BY.image}
          />
        )
      },
    }),

    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: STATEMENT_DATATABLE.COLUMN_CREATED_AT,
      size: 150,
      meta: { align: "end", fluid: true },
      cell: (info) => FormatDateTime(info.getValue()),
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
          label={STATEMENT_DATATABLE.ROW_ACTIONS_LABEL}
          actions={[
            {
              key: "open",
              label: STATEMENT_DATATABLE.ROW_OPEN_LABEL,
              onSelect: () => options.onView(row.original),
            },
            {
              key: "delete",
              label: STATEMENT_DATATABLE.ROW_DELETE_LABEL,
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
