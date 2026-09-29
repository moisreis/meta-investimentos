import type { DateRange } from "react-day-picker"

import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"

/**
 * @summary
 * Display data resolved for a performance row.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
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
  // Units dropped because no fund published a quote that
  // day, such as a weekend or a holiday.
  skipped: number
  error: string | null
  // Set when the job reaches a terminal status.
  completedAt: number | null
}
