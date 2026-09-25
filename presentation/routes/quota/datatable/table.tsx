"use client"

import { EntityDatatable } from "@/presentation/parts/datatable/layout/entity-datatable"
import type { EntityTable } from "@/presentation/parts/datatable/settings/entity-table-features.settings"
import type { QuotaResponseDTO } from "@/services/quota/dto/quota-response.dto"

interface QuotaDatatableTableProps {
  table: EntityTable<QuotaResponseDTO>
}

/**
 * @summary
 * Renders the quota datatable.
 *
 * @remarks
 * Composes the shared entity datatable without a bulk
 * delete flow, since quotas are managed through the CVM
 * import only.
 *
 * @param props - The shared table instance.
 * @param props.table - The shared table instance.
 *
 * @returns The quota datatable.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function QuotaDatatableTable({
  table,
}: QuotaDatatableTableProps) {
  return <EntityDatatable table={table} />
}

export { QuotaDatatableTable }
