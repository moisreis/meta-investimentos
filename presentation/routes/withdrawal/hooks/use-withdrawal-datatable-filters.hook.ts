"use client"

import { useMemo, useState } from "react"
import { endOfDay, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"

import type { WithdrawalResponseDTO } from "@/services/withdrawal/dto/withdrawal-response.dto"

import { EMPTY_WITHDRAWAL_LOOKUPS } from "../helpers/build-withdrawal-lookups.helper"
import type { WithdrawalLookups } from "../types/withdrawal-list.types"

interface UseWithdrawalDatatableFiltersOutput {
  portfolioId: string | undefined
  fundId: string | undefined
  dateRange: DateRange | undefined
  onPortfolioChange: (value: string | undefined) => void
  onFundChange: (value: string | undefined) => void
  onDateRangeChange: (range: DateRange | undefined) => void
  filteredWithdrawals: WithdrawalResponseDTO[]
}

/**
 * @summary
 * Coordinates the withdrawal datatable filters.
 *
 * @remarks
 * Owns the portfolio, fund and period filters and narrows
 * the rows by the position portfolio, the position fund
 * and the withdrawal date before the table receives
 * them. The period is inclusive of both edges.
 *
 * @param withdrawals - The rows rendered by the table.
 * @param lookups - The withdrawal lookups.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useWithdrawalDatatableFilters(
  withdrawals: WithdrawalResponseDTO[],
  lookups: WithdrawalLookups = EMPTY_WITHDRAWAL_LOOKUPS
): UseWithdrawalDatatableFiltersOutput {
  const [PORTFOLIO_ID, setPortfolioId] = useState<
    string | undefined
  >(undefined)
  const [FUND_ID, setFundId] = useState<string | undefined>(
    undefined
  )
  const [DATE_RANGE, setDateRange] = useState<
    DateRange | undefined
  >(undefined)

  const FILTERED_WITHDRAWALS = useMemo(() => {
    const FROM = DATE_RANGE?.from
      ? startOfDay(DATE_RANGE.from).getTime()
      : null
    const TO = DATE_RANGE?.to
      ? endOfDay(DATE_RANGE.to).getTime()
      : null

    return withdrawals.filter((withdrawal) => {
      const LOOKUP = lookups.rows[withdrawal.id]

      if (!LOOKUP) return false

      if (PORTFOLIO_ID && LOOKUP.portfolioId !== PORTFOLIO_ID) {
        return false
      }

      if (FUND_ID && LOOKUP.fundId !== FUND_ID) {
        return false
      }

      if (FROM !== null || TO !== null) {
        const TIME = new Date(withdrawal.date).getTime()

        if (FROM !== null && TIME < FROM) return false
        if (TO !== null && TIME > TO) return false
      }

      return true
    })
  }, [withdrawals, lookups, PORTFOLIO_ID, FUND_ID, DATE_RANGE])

  return {
    portfolioId: PORTFOLIO_ID,
    fundId: FUND_ID,
    dateRange: DATE_RANGE,
    onPortfolioChange: setPortfolioId,
    onFundChange: setFundId,
    onDateRangeChange: setDateRange,
    filteredWithdrawals: FILTERED_WITHDRAWALS,
  }
}

export { useWithdrawalDatatableFilters }
