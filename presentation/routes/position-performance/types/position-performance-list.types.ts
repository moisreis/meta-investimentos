import type { DateRange } from "react-day-picker"

import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"

// Display data resolved for a performance row.
export interface PositionPerformanceRowLookup {
  // Fund name shown as the row title.
  fundName: string
  // Portfolio name shown as the row subtitle.
  portfolioName: string
  // Portfolio acronym shown as the row subtitle.
  portfolioAcronym: string
}

// Lookups consumed by the position performance screen.
export interface PositionPerformanceLookups {
  rows: Record<string, PositionPerformanceRowLookup>
  positionOptions: EntitySelectFilterOption[]
  // Options offered by the confirm dialog, covering
  // every position of the user.
  calculationOptions: { value: string; label: string }[]
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
  error: string | null
  // Set when the job reaches a terminal status.
  completedAt: number | null
}
