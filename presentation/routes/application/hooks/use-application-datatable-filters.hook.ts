"use client"

import { useMemo, useState } from "react"
import { endOfDay, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"

import type { ApplicationResponseDTO } from "@/services/application/dto/application-response.dto"

import { EMPTY_APPLICATION_LOOKUPS } from "../helpers/build-application-lookups.helper"
import type { ApplicationLookups } from "../types/application-list.types"

interface UseApplicationDatatableFiltersOutput {
  portfolioId: string | undefined
  fundId: string | undefined
  dateRange: DateRange | undefined
  onPortfolioChange: (value: string | undefined) => void
  onFundChange: (value: string | undefined) => void
  onDateRangeChange: (range: DateRange | undefined) => void
  filteredApplications: ApplicationResponseDTO[]
}

/**
 * @summary
 * Coordinates the application datatable filters.
 *
 * @remarks
 * Owns the portfolio, fund and period filters and narrows
 * the rows by the position portfolio, the position fund
 * and the application date before the table receives
 * them. The period is inclusive of both edges.
 *
 * @param applications - The rows rendered by the table.
 * @param lookups - The application lookups.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useApplicationDatatableFilters(
  applications: ApplicationResponseDTO[],
  lookups: ApplicationLookups = EMPTY_APPLICATION_LOOKUPS
): UseApplicationDatatableFiltersOutput {
  const [PORTFOLIO_ID, setPortfolioId] = useState<
    string | undefined
  >(undefined)
  const [FUND_ID, setFundId] = useState<string | undefined>(
    undefined
  )
  const [DATE_RANGE, setDateRange] = useState<
    DateRange | undefined
  >(undefined)

  const FILTERED_APPLICATIONS = useMemo(() => {
    const FROM = DATE_RANGE?.from
      ? startOfDay(DATE_RANGE.from).getTime()
      : null
    const TO = DATE_RANGE?.to
      ? endOfDay(DATE_RANGE.to).getTime()
      : null

    return applications.filter((application) => {
      const LOOKUP = lookups.rows[application.id]

      if (!LOOKUP) return false

      if (PORTFOLIO_ID && LOOKUP.portfolioId !== PORTFOLIO_ID) {
        return false
      }

      if (FUND_ID && LOOKUP.fundId !== FUND_ID) {
        return false
      }

      if (FROM !== null || TO !== null) {
        const TIME = new Date(application.date).getTime()

        if (FROM !== null && TIME < FROM) return false
        if (TO !== null && TIME > TO) return false
      }

      return true
    })
  }, [applications, lookups, PORTFOLIO_ID, FUND_ID, DATE_RANGE])

  return {
    portfolioId: PORTFOLIO_ID,
    fundId: FUND_ID,
    dateRange: DATE_RANGE,
    onPortfolioChange: setPortfolioId,
    onFundChange: setFundId,
    onDateRangeChange: setDateRange,
    filteredApplications: FILTERED_APPLICATIONS,
  }
}

export { useApplicationDatatableFilters }
