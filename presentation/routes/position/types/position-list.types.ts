import type { DateRange } from "react-day-picker"

import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"

/**
 * @summary
 * Display data resolved for a position row.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-26
 */
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

/**
 * @summary
 * Derived data rendered on a position row.
 *
 * @remarks
 * A position row carries no derived data yet, so the summary
 * is an empty object. The prop stays on the confirm-delete
 * dialog because every other list module passes summaries the
 * same way, and a future derived field only has to be added
 * here.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-27
 */
export type PositionRowSummary = Record<string, never>
