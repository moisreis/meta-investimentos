import type { CvmImportWindow } from "@/services/quota/use-cases/import-fund-valuations.use-case"

// Fund data resolved for a quota row.
export interface QuotaFundLookup {
  // Fund name displayed as the row title.
  name: string
  // Fund cnpj displayed as the row subtitle.
  cnpj: string
}

// Fund lookups used by the quota datatable.
export interface QuotaFundLookups {
  quotas: Record<string, QuotaFundLookup>
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
