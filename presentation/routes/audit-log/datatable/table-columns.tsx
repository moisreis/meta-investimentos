"use client"

import type { ColumnHelper } from "@tanstack/react-table"

import { FormatAuditAction } from "@/presentation/parts/audit/shared-format-audit-action.helper"
import { FormatAuditEntity } from "@/presentation/parts/audit/shared-format-audit-entity.helper"
import { EntityUserCell } from "@/presentation/parts/datatable/columns/entity-user-cell"
import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatDateTime } from "@/presentation/presenters/date.presenter"
import { FormatEntityLookup } from "@/presentation/presenters/lookup.presenter"
import type { AuditLogRow } from "@/presentation/types/audit-log-row.types"

import { AUDIT_LOG_DATATABLE } from "../settings/labels.settings"
import type { AuditLogRowSummary } from "../types/audit-log-list.types"

export interface AuditLogTableColumnOptions {
  summaryFor: (auditLogId: string) => AuditLogRowSummary | null
}

/**
 * @summary
 * Builds the column definitions of the audit log datatable.
 *
 * @remarks
 * Pins the creation date column to the start and defaults to
 * its raw ISO value when sorting so rows order
 * chronologically. The acting-user column resolves its
 * derived data per row through `summaryFor` and renders
 * through the shared user cell, so the agent reads as an
 * avatar and a full name, as in the portfolio owner column.
 *
 * The changes payload is left out of the columns: it is a
 * diff, and rendering it as a single JSON string in a table
 * cell is unreadable at any useful width. It still feeds the
 * search, unchanged.
 *
 * The action and entity cells resolve through the shared
 * audit vocabulary rather than a local copy of it, so this
 * table and the header notification say the same words for
 * the same row.
 *
 * @param columnHelper - The entity column helper.
 * @param options - The per-row summary resolver.
 *
 * @returns The audit log column definitions.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
export function CreateAuditLogTableColumns(
  columnHelper: ColumnHelper<EntityTableFeatures, AuditLogRow>,
  options: AuditLogTableColumnOptions
): EntityColumnDef<AuditLogRow>[] {
  return [
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: AUDIT_LOG_DATATABLE.COLUMN_CREATED_AT,
      enableHiding: false,
      size: 170,
      minSize: 170,
      maxSize: 170,
      meta: { pinned: "start" },
      cell: (info) => FormatDateTime(info.getValue()),
    }),

    columnHelper.accessor("entity", {
      id: "entity",
      header: AUDIT_LOG_DATATABLE.COLUMN_ENTITY,
      size: 150,
      enableSorting: false,
      meta: { fluid: true },
      cell: (info) => FormatAuditEntity(info.getValue()),
    }),

    columnHelper.accessor("entityId", {
      id: "entityId",
      header: AUDIT_LOG_DATATABLE.COLUMN_ENTITY_ID,
      size: 240,
      enableSorting: false,
      meta: { fluid: true },
      cell: (info) => FormatEntityLookup(info.getValue()),
    }),

    columnHelper.accessor("action", {
      id: "action",
      header: AUDIT_LOG_DATATABLE.COLUMN_ACTION,
      size: 120,
      enableSorting: false,
      meta: { fluid: true },
      cell: (info) => {
        const DISPLAY = FormatAuditAction(info.getValue())

        return DISPLAY.label
      },
    }),

    columnHelper.accessor("userId", {
      id: "actor",
      header: AUDIT_LOG_DATATABLE.COLUMN_ACTOR,
      size: 200,
      enableSorting: false,
      meta: { fluid: true },
      cell: ({ row }) => (
        <EntityUserCell
          user={options.summaryFor(row.id)?.actor}
        />
      ),
    }),
  ]
}
