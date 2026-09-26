import type { DateRange } from "react-day-picker"

import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"

// Display data resolved for a withdrawal row.
export interface WithdrawalRowLookup {
  // Position portfolio id used by the filters.
  portfolioId: string
  // Portfolio name shown as the row title.
  portfolioName: string
  // Portfolio acronym shown as the row subtitle.
  portfolioAcronym: string
  // Position fund id used by the filters.
  fundId: string
  // Fund name shown as the row title.
  fundName: string
  // Fund cnpj shown as the row subtitle.
  fundCnpj: string
}

// Lookups consumed by the withdrawal datatable.
export interface WithdrawalLookups {
  rows: Record<string, WithdrawalRowLookup>
  portfolioOptions: EntitySelectFilterOption[]
  fundOptions: EntitySelectFilterOption[]
}

// Filters owned by the withdrawal list.
export interface WithdrawalFilters {
  portfolioId: string | undefined
  fundId: string | undefined
  dateRange: DateRange | undefined
}
