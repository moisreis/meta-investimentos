import type { DateRange } from "react-day-picker"

import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"

// Display data resolved for an application row.
export interface ApplicationRowLookup {
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

// Lookups consumed by the application datatable.
export interface ApplicationLookups {
  rows: Record<string, ApplicationRowLookup>
  portfolioOptions: EntitySelectFilterOption[]
  fundOptions: EntitySelectFilterOption[]
}

// Filters owned by the application list.
export interface ApplicationFilters {
  portfolioId: string | undefined
  fundId: string | undefined
  dateRange: DateRange | undefined
}
