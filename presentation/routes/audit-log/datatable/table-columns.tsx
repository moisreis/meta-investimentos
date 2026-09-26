"use client"

import type {
  ColumnDef,
  ColumnHelper,
} from "@tanstack/react-table"

import type { EntityTableFeatures } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { FormatDateTime } from "@/presentation/presenters/date.presenter"
import { UserAvatar } from "@/presentation/presenters/user-avatar.presenter"
import { Badge } from "@/presentation/ui/badge"
import type { AuditLogResponseDTO } from "@/services/audit-log/dto/audit-log-response.dto"

import { FormatAuditAction } from "../helpers/format-audit-action.helper"
import { FormatAuditEntity } from "../helpers/format-audit-entity.helper"
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
  columnHelper: ColumnHelper<
    EntityTableFeatures,
    AuditLogResponseDTO
  >,
  options: AuditLogTableColumnOptions
): ColumnDef<EntityTableFeatures, AuditLogResponseDTO, any>[] {
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
      cell: (info) => (
        <span
          title={info.getValue()}
          className="block max-w-full truncate font-mono text-xs text-muted-foreground"
        >
          {info.getValue()}
        </span>
      ),
    }),

    columnHelper.accessor("action", {
      id: "action",
      header: AUDIT_LOG_DATATABLE.COLUMN_ACTION,
      size: 120,
      enableSorting: false,
      meta: { fluid: true },
      cell: (info) => {
        const DISPLAY = FormatAuditAction(info.getValue())

        return (
          <Badge variant={DISPLAY.variant}>
            {DISPLAY.label}
          </Badge>
        )
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
          return <span className="text-muted-foreground">-</span>
        }

        const SERIALIZED = JSON.stringify(CHANGES)

        return (
          <span
            title={SERIALIZED}
            className="block max-w-full truncate font-mono text-xs text-muted-foreground"
          >
            {SERIALIZED}
          </span>
        )
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
          return <span className="text-muted-foreground">-</span>
        }

        return (
          <UserAvatar
            firstName={ACTOR.firstName}
            lastName={ACTOR.lastName}
            image={ACTOR.image}
          />
        )
      },
    }),
  ]
}
