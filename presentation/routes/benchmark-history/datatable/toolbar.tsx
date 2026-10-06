"use client"

import type { RowData } from "@tanstack/react-table"

import { EntityDatatableAddItemButton } from "@/presentation/parts/components/entity-datatable-add-item-button"
import { EntityDatatableEditColumnsButton } from "@/presentation/parts/components/entity-datatable-edit-columns-button"
import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"
import { EntityDatatableToolbarSeparator } from "@/presentation/parts/components/entity-datatable-toolbar-separator"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { BENCHMARK_HISTORY_DATATABLE_COLUMN_LABELS } from "@/presentation/routes/benchmark-history/settings/labels.settings"

import { BENCHMARK_HISTORY_FORM } from "../settings/labels.settings"

interface BenchmarkHistoryDatatableToolbarProps<
  TData extends RowData,
> {
  table: EntityTable<TData>
  onAddItem: () => void
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the benchmark history datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar with the add-item
 * button, the edit-columns button and the separator between
 * them. An entry is recorded by hand, so the toolbar carries
 * the create action the other lists do. The `filters` slot
 * renders on the left side.
 *
 * @param props - The shared table instance.
 * @param props.table - The shared table instance.
 * @param props.onAddItem - Opens the record dialog.
 * @param props.filters - The left-side filter group.
 *
 * @returns The benchmark history datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BenchmarkHistoryDatatableToolbar<
  TData extends RowData,
>({
  table,
  onAddItem,
  filters,
}: BenchmarkHistoryDatatableToolbarProps<TData>) {
  return (
    <EntityDatatableToolbar
      filters={filters}
      actions={
        <>
          <EntityDatatableEditColumnsButton
            table={table}
            getColumnLabel={(column) =>
              BENCHMARK_HISTORY_DATATABLE_COLUMN_LABELS[
                column.id
              ] ?? column.id
            }
          />
          <EntityDatatableToolbarSeparator />
          <EntityDatatableAddItemButton
            onClick={onAddItem}
            label={BENCHMARK_HISTORY_FORM.ADD_BUTTON}
          />
        </>
      }
    />
  )
}

export { BenchmarkHistoryDatatableToolbar }
