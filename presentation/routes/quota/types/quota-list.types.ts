import type { CvmImportWindow } from "@/lib/quota/cvm-import-window"
import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"

/**
 * @summary
 * Fund data resolved for a quota row.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
export interface QuotaFundLookup {
  // Fund id for filtering.
  fundId: string
  // Fund name displayed as the row title.
  name: string
  // Fund cnpj displayed as the row subtitle.
  cnpj: string
}

// Fund lookups used by the quota datatable.
export interface QuotaFundLookups {
  quotas: Record<string, QuotaFundLookup>
  // Distinct funds offered by the toolbar fund filter.
  fundOptions: EntitySelectFilterOption[]
}

// Snapshot of an ongoing quota import job.
export interface QuotaImportProgress {
  id: string
  window: CvmImportWindow
  status: "running" | "success" | "error"
  monthsTotal: number
  monthsDone: number
  rowsImported: number
  skipped: number
  error: string | null
  // Set when the job reaches a terminal status.
  completedAt: number | null
}
