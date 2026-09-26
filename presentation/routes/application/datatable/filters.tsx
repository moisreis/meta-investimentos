"use client"

import type { DateRange } from "react-day-picker"

import { EntityDateRangeFilter } from "@/presentation/parts/filters/date-range"
import type { EntitySelectFilterOption } from "@/presentation/parts/filters/entity-select-filter"
import { EntitySelectFilter } from "@/presentation/parts/filters/entity-select-filter"

import { APPLICATION_DATATABLE } from "../settings/labels.settings"

interface ApplicationDatatableFiltersProps {
  portfolioId: string | undefined
  fundId: string | undefined
  dateRange: DateRange | undefined
  portfolioOptions: EntitySelectFilterOption[]
  fundOptions: EntitySelectFilterOption[]
  onPortfolioChange: (value: string | undefined) => void
  onFundChange: (value: string | undefined) => void
  onDateRangeChange: (range: DateRange | undefined) => void
}

/**
 * @summary
 * Composes the application datatable filters.
 *
 * @remarks
 * Renders the shared select and date range filters on
 * the toolbar, narrowing the table by the portfolio, the
 * fund and the application period.
 *
 * @param props - The filter state and handlers.
 * @param props.portfolioId - The selected portfolio.
 * @param props.fundId - The selected fund.
 * @param props.dateRange - The selected period.
 * @param props.portfolioOptions - The portfolio options.
 * @param props.fundOptions - The fund options.
 * @param props.onPortfolioChange - Reports the portfolio.
 * @param props.onFundChange - Reports the fund.
 * @param props.onDateRangeChange - Reports the period.
 *
 * @returns The composed application filters.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function ApplicationDatatableFilters({
  portfolioId,
  fundId,
  dateRange,
  portfolioOptions,
  fundOptions,
  onPortfolioChange,
  onFundChange,
  onDateRangeChange,
}: ApplicationDatatableFiltersProps) {
  return (
    <>
      <EntitySelectFilter
        value={portfolioId}
        onChange={onPortfolioChange}
        options={portfolioOptions}
        placeholder={
          APPLICATION_DATATABLE.FILTER_PORTFOLIO_PLACEHOLDER
        }
        label={APPLICATION_DATATABLE.FILTER_PORTFOLIO_LABEL}
      />
      <EntitySelectFilter
        value={fundId}
        onChange={onFundChange}
        options={fundOptions}
        placeholder={
          APPLICATION_DATATABLE.FILTER_FUND_PLACEHOLDER
        }
        label={APPLICATION_DATATABLE.FILTER_FUND_LABEL}
      />
      <EntityDateRangeFilter
        value={dateRange}
        onChange={onDateRangeChange}
        placeholder={
          APPLICATION_DATATABLE.FILTER_DATE_PLACEHOLDER
        }
      />
    </>
  )
}

export { ApplicationDatatableFilters }
