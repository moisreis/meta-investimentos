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
export interface PositionPerformanceRowLookup {
  // Fund name shown as the row title.
  fundName: string
  // Portfolio name shown as the row subtitle.
  portfolioName: string
  // Portfolio acronym shown as the row subtitle.
  portfolioAcronym: string
}

/**
 * @summary
 * Position offered by the position performance calculate
 * confirm dialog.
 *
 * @remarks
 * The portfolio acronym leads the option because the same
 * fund can be held by more than one portfolio: the acronym
 * tells two otherwise identical options apart at a glance,
 * and the fund name below it says which fund is meant.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-28
 */
export interface PositionPerformanceCalculationOption {
  // Id of the position, submitted to the form.
  value: string
  // Portfolio acronym rendered above the fund name.
  label: string
  // Fund name rendered under the acronym.
  description: string
}

// Lookups consumed by the position performance screen.
export interface PositionPerformanceLookups {
  rows: Record<string, PositionPerformanceRowLookup>
  positionOptions: EntitySelectFilterOption[]
  // Options offered by the confirm dialog, covering
  // every position of the user.
  calculationOptions: PositionPerformanceCalculationOption[]
}

// Filters owned by the position performance list.
export interface PositionPerformanceFilters {
  positionId: string | undefined
  dateRange: DateRange | undefined
}

// Snapshot of an ongoing position performance
// calculation job.
export interface PositionPerformanceCalculationProgress {
  id: string
  status: "running" | "success" | "error"
  positionCount: number
  daysTotal: number
  calculated: number
  // Units dropped because the fund published no quote that
  // day, such as a weekend or a holiday.
  skipped: number
  error: string | null
  // Set when the job reaches a terminal status.
  completedAt: number | null
}
