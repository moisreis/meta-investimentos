"use client"

import { EntityDatatableAddItemButton } from "@/presentation/parts/components/entity-datatable-add-item-button"
import { EntityDatatableEditColumnsButton } from "@/presentation/parts/components/entity-datatable-edit-columns-button"
import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"
import { EntityDatatableToolbarSeparator } from "@/presentation/parts/components/entity-datatable-toolbar-separator"

import { usePortfolioDatatableToolbar } from "@/presentation/routes/portfolio/hooks/use-portfolio-datatable-toolbar.hook"

/**
 * @summary
 * Renders the portfolio datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar with the
 * add-item button, a separator and the edit-columns
 * button. The edit-columns button renders standalone
 * until the datatable provides its column instance.
 *
 * @explanation
 * Use above the portfolio datatable on the list screen.
 * The add-item button navigates to the create portfolio
 * screen.
 *
 * @returns The portfolio datatable toolbar.
 *
 * @example
 * <PortfolioDatatableToolbar />
 *
 * @author Moisés Reis
 *
 * @date 2026-09-24
 */
function PortfolioDatatableToolbar() {
  const { handleAddItem } = usePortfolioDatatableToolbar()

  return (
    <EntityDatatableToolbar
      actions={
        <>
          <EntityDatatableAddItemButton
            onClick={handleAddItem}
          />
          <EntityDatatableToolbarSeparator />
          <EntityDatatableEditColumnsButton />
        </>
      }
    />
  )
}

export { PortfolioDatatableToolbar }
