"use client"

import type { RowData } from "@tanstack/react-table"

import { EntityDatatableAddItemButton } from "@/presentation/parts/components/entity-datatable-add-item-button"
import { EntityDatatableEditColumnsButton } from "@/presentation/parts/components/entity-datatable-edit-columns-button"
import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"
import { EntityDatatableToolbarSeparator } from "@/presentation/parts/components/entity-datatable-toolbar-separator"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { CATEGORY_DATATABLE_COLUMN_LABELS } from "@/presentation/routes/category/settings/labels.settings"

interface CategoryDatatableToolbarProps<TData extends RowData> {
  table: EntityTable<TData>
  onAddItem: () => void
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the category datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar with the
 * add-item button, a separator and the edit-columns
 * button. The add-item button opens the category add
 * dialog and the edit-columns button toggles the
 * visibility of the hideable columns, resolving each
 * column label through the category settings. The
 * optional `filters` slot renders on the left side.
 *
 * @param props - The toolbar props.
 * @param props.table - The shared table instance.
 * @param props.onAddItem - Opens the add dialog.
 * @param props.filters - The left-side filter group.
 *
 * @returns The category datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CategoryDatatableToolbar<TData extends RowData>({
  table,
  onAddItem,
  filters,
}: CategoryDatatableToolbarProps<TData>) {
  return (
    <EntityDatatableToolbar
      filters={filters}
      actions={
        <>
          <EntityDatatableEditColumnsButton
            table={table}
            getColumnLabel={(column) =>
              CATEGORY_DATATABLE_COLUMN_LABELS[column.id] ??
              column.id
            }
          />
          <EntityDatatableToolbarSeparator />
          <EntityDatatableAddItemButton onClick={onAddItem} />
        </>
      }
    />
  )
}

export { CategoryDatatableToolbar }
