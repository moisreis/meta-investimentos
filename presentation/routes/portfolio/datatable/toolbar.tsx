"use client"

import type { RowData } from "@tanstack/react-table"

import { EntityDatatableAddItemButton } from "@/presentation/parts/components/entity-datatable-add-item-button"
import { EntityDatatableEditColumnsButton } from "@/presentation/parts/components/entity-datatable-edit-columns-button"
import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"
import { EntityDatatableToolbarSeparator } from "@/presentation/parts/components/entity-datatable-toolbar-separator"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import { usePortfolioDatatableToolbar } from "@/presentation/routes/portfolio/hooks/use-portfolio-datatable-toolbar.hook"
import { PORTFOLIO_DATATABLE_COLUMN_LABELS } from "@/presentation/routes/portfolio/settings/labels.settings"

interface PortfolioDatatableToolbarProps<TData extends RowData> {
  table: EntityTable<TData>
}

/**
 * @summary
 * Renders the portfolio datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar with the
 * add-item button, a separator and the edit-columns
 * button. The edit-columns button toggles the visibility
 * of the hideable columns, resolving each column label
 * through the portfolio settings.
 *
 * @param props - The shared table instance.
 *
 * @returns The portfolio datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function PortfolioDatatableToolbar<TData extends RowData>({
  table,
}: PortfolioDatatableToolbarProps<TData>) {
  const { handleAddItem } = usePortfolioDatatableToolbar()

  return (
    <EntityDatatableToolbar
      actions={
        <>
          <EntityDatatableEditColumnsButton
            table={table}
            getColumnLabel={(column) =>
              PORTFOLIO_DATATABLE_COLUMN_LABELS[column.id] ??
              column.id
            }
          />
          <EntityDatatableToolbarSeparator />
          <EntityDatatableAddItemButton
            onClick={handleAddItem}
          />
        </>
      }
    />
  )
}

export { PortfolioDatatableToolbar }
