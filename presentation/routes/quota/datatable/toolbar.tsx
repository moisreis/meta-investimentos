"use client"

import { EntityDatatableToolbar } from "@/presentation/parts/components/entity-datatable-toolbar"

import { QuotaImportButton } from "../components/quota-import-button"

interface QuotaDatatableToolbarProps {
  onImport: () => void
  filters?: React.ReactNode
}

/**
 * @summary
 * Renders the quota datatable toolbar.
 *
 * @remarks
 * Composes the shared datatable toolbar with the import
 * button on the actions slot, replacing the add-item
 * button since quotas are imported instead of created.
 *
 * @param props - The toolbar callbacks and slots.
 * @param props.onImport - Opens the confirm dialog.
 * @param props.filters - The left-side filter group.
 *
 * @returns The quota datatable toolbar.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function QuotaDatatableToolbar({
  onImport,
  filters,
}: QuotaDatatableToolbarProps) {
  return (
    <EntityDatatableToolbar
      filters={filters}
      actions={<QuotaImportButton onClick={onImport} />}
    />
  )
}

export { QuotaDatatableToolbar }
