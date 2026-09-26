"use client"

import type { DateRange } from "react-day-picker"

import { EntityDateRangeFilter } from "@/presentation/parts/filters/date-range"
import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"
import { EntitySelectFilter } from "@/presentation/parts/filters/entity-select-filter"

import { PORTFOLIO_PERFORMANCE_DATATABLE } from "../settings/labels.settings"

interface PortfolioPerformanceDatatableFiltersProps {
  portfolioId: string | undefined
  dateRange: DateRange | undefined
  portfolioOptions: EntitySelectFilterOption[]
  onPortfolioChange: (value: string | undefined) => void
  onDateRangeChange: (range: DateRange | undefined) => void
}

/**
 * @summary
 * Composes the performance datatable filters.
 *
 * @remarks
 * Renders the shared select and date range filters on
 * the toolbar, narrowing the table by the portfolio and
 * the calculation period.
 *
 * @param props - The filter state and handlers.
 * @param props.portfolioId - The selected portfolio.
 * @param props.dateRange - The selected period.
 * @param props.portfolioOptions - The portfolio options.
 * @param props.onPortfolioChange - Reports the portfolio.
 * @param props.onDateRangeChange - Reports the period.
 *
 * @returns The composed performance filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function PortfolioPerformanceDatatableFilters({
  portfolioId,
  dateRange,
  portfolioOptions,
  onPortfolioChange,
  onDateRangeChange,
}: PortfolioPerformanceDatatableFiltersProps) {
  return (
    <>
      <EntitySelectFilter
        value={portfolioId}
        onChange={onPortfolioChange}
        options={portfolioOptions}
        placeholder={
          PORTFOLIO_PERFORMANCE_DATATABLE.FILTER_PORTFOLIO_PLACEHOLDER
        }
        label={
          PORTFOLIO_PERFORMANCE_DATATABLE.FILTER_PORTFOLIO_LABEL
        }
      />
      <EntityDateRangeFilter
        value={dateRange}
        onChange={onDateRangeChange}
        placeholder={
          PORTFOLIO_PERFORMANCE_DATATABLE.FILTER_DATE_PLACEHOLDER
        }
      />
    </>
  )
}

export { PortfolioPerformanceDatatableFilters }
