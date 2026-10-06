import type { DateRange } from "react-day-picker"

import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"

/**
 * @summary
 * Display data resolved for an application row.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
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
  // Quota value used to create the application.
  quotaValue: string
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

// Options consumed by the application forms.
export interface FundSelectOptions {
  funds: { id: string; name: string; cnpj: string }[]
}
