"use client"

import type { ColumnHelper } from "@tanstack/react-table"

import type { EntityColumnDef } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatDateTime } from "@/presentation/presenters/date.presenter"
import { PRESENTER_FALLBACK } from "@/presentation/presenters/lookup.presenter"
import { FormatEntityLookup } from "@/presentation/presenters/lookup.presenter"
import type { AuditLogRow } from "@/presentation/types/audit-log-row.types"

import { FormatAuditLogAction } from "../helpers/format-audit-log-action.helper"
import { FormatAuditLogEntity } from "../helpers/format-audit-log-entity.helper"
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
 * derived data per row through `summaryFor`.
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
      cell: (info) => FormatAuditLogEntity(info.getValue()),
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
        const DISPLAY = FormatAuditLogAction(info.getValue())

        return DISPLAY.label
      },
    }),

    columnHelper.accessor("changes", {
      id: "changes",
      header: AUDIT_LOG_DATATABLE.COLUMN_CHANGES,
      size: 240,
      enableSorting: false,
      meta: { fluid: true },
      cell: (info) => {
        const CHANGES = info.getValue()

        if (!CHANGES) {
          return PRESENTER_FALLBACK
        }

        return JSON.stringify(CHANGES)
      },
    }),

    columnHelper.accessor("userId", {
      id: "actor",
      header: AUDIT_LOG_DATATABLE.COLUMN_ACTOR,
      size: 200,
      enableSorting: false,
      meta: { fluid: true },
      cell: ({ row }) => {
        const ACTOR = options.summaryFor(row.id)?.actor ?? null

        if (!ACTOR) {
          return PRESENTER_FALLBACK
        }

        return FormatEntityLookup(
          `${ACTOR.firstName} ${ACTOR.lastName}`,
          ACTOR.image
        )
      },
    }),
  ]
}
