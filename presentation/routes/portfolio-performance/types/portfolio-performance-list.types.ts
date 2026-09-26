import type { DateRange } from "react-day-picker"

import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"

// Display data resolved for a performance row.
export interface PortfolioPerformanceRowLookup {
  // Portfolio name shown as the row title.
  portfolioName: string
  // Portfolio acronym shown as the row subtitle.
  portfolioAcronym: string
}

// Lookups consumed by the performance datatable.
export interface PortfolioPerformanceLookups {
  rows: Record<string, PortfolioPerformanceRowLookup>
  portfolioOptions: EntitySelectFilterOption[]
}

// Filters owned by the performance list.
export interface PortfolioPerformanceFilters {
  portfolioId: string | undefined
  dateRange: DateRange | undefined
}

// Snapshot of an ongoing performance calculation job.
export interface PortfolioPerformanceCalculationProgress {
  id: string
  status: "running" | "success" | "error"
  portfolioCount: number
  daysTotal: number
  calculated: number
  error: string | null
  // Set when the job reaches a terminal status.
  completedAt: number | null
}
