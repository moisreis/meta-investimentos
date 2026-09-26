import type { DateRange } from "react-day-picker"

import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"

// Display data resolved for a position row.
export interface PositionRowLookup {
  // Portfolio name shown as the row title.
  portfolioName: string
  // Portfolio acronym shown as the row subtitle.
  portfolioAcronym: string
  // Fund name shown as the row title.
  fundName: string
  // Fund cnpj shown as the row subtitle.
  fundCnpj: string
}

// Lookups consumed by the position datatable.
export interface PositionLookups {
  rows: Record<string, PositionRowLookup>
  portfolioOptions: EntitySelectFilterOption[]
  fundOptions: EntitySelectFilterOption[]
}

// Filters owned by the position list.
export interface PositionFilters {
  portfolioId: string | undefined
  fundId: string | undefined
  dateRange: DateRange | undefined
}
