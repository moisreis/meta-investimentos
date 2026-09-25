"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { CategoryResponseDTO } from "@/services/category/dto/category-response.dto"

interface CategoryDatatableTableProps {
  table: EntityTable<CategoryResponseDTO>
  onBulkDelete: (
    items: CategoryResponseDTO[]
  ) => void | Promise<void>
}

/**
 * @summary
 * Renders the category datatable.
 *
 * @remarks
 * Composes the shared entity datatable with the bulk
 * delete flow. The row dialogs render at the list page
 * level above this component.
 *
 * @param props - The table and its bulk delete callback.
 * @param props.table - The shared table instance.
 * @param props.onBulkDelete - Runs the bulk delete flow.
 *
 * @returns The category datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function CategoryDatatableTable({
  table,
  onBulkDelete,
}: CategoryDatatableTableProps) {
  return (
    <EntityDatatable table={table} onBulkDelete={onBulkDelete} />
  )
}

export { CategoryDatatableTable }
