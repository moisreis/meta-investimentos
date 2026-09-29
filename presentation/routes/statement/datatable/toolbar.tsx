"use client"

import type { RowData } from "@tanstack/react-table"

import { EntityDatatableEditColumnsButton } from "@/presentation/parts/components/entity-datatable-edit-columns-button"
import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"
import { EntityDatatableToolbarSeparator } from "@/presentation/parts/components/entity-datatable-toolbar-separator"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { StatementGenerateReportButton } from "@/presentation/routes/statement/components/statement-generate-report-button"
import { STATEMENT_DATATABLE_COLUMN_LABELS } from "@/presentation/routes/statement/settings/labels.settings"

interface StatementDatatableToolbarProps<TData extends RowData> {
  table: EntityTable<TData>
  onGenerateReport: () => void
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the statement datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar with the edit-columns
 * button, a separator and the generate-report button. The
 * generate-report button opens the generate dialog and the
 * edit-columns button toggles the visibility of the hideable
 * columns, resolving each column label through the statement
 * settings. The optional `filters` slot renders on the left
 * side.
 *
 * @param props - The shared table instance.
 * @param props.table - The shared table instance.
 * @param props.onGenerateReport - Opens the generate dialog.
 * @param props.filters - The left-side filter group.
 *
 * @returns The statement datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function StatementDatatableToolbar<TData extends RowData>({
  table,
  onGenerateReport,
  filters,
}: StatementDatatableToolbarProps<TData>) {
  return (
    <EntityDatatableToolbar
      filters={filters}
      actions={
        <>
          <EntityDatatableEditColumnsButton
            table={table}
            getColumnLabel={(column) =>
              STATEMENT_DATATABLE_COLUMN_LABELS[column.id] ??
              column.id
            }
          />
          <EntityDatatableToolbarSeparator />
          <StatementGenerateReportButton
            onClick={onGenerateReport}
          />
        </>
      }
    />
  )
}

export { StatementDatatableToolbar }
