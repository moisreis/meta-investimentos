"use client"

import { useMemo, useState } from "react"
import { type DateRange } from "react-day-picker"
import type { QuotaRow } from "@/presentation/types/quota-row.types"

import type { QuotaFundLookups } from "../types/quota-list.types"

interface UseQuotaDatatableFiltersOutput {
  fundId: string | undefined
  onFundChange: (fundId: string | undefined) => void
  dateRange: DateRange | undefined
  onDateRangeChange: (dateRange: DateRange | undefined) => void
  filteredQuotas: QuotaRow[]
}

/**
 * @summary
 * Coordinates the quota datatable filters.
 *
 * @remarks
 * Owns the fund filter and date range filter and narrows the
 * rows before the table receives them.
 *
 * @param quotas - The rows rendered by the datatable.
 * @param lookups - The quota fund lookups.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useQuotaDatatableFilters(
  quotas: QuotaRow[],
  lookups: QuotaFundLookups
): UseQuotaDatatableFiltersOutput {
  const [FUND_ID, setFundId] = useState<string | undefined>(
    undefined
  )
  const [DATE_RANGE, setDateRange] = useState<
    DateRange | undefined
  >(undefined)

  const FILTERED_QUOTAS = useMemo(() => {
    return quotas.filter((quota) => {
      const LOOKUP = lookups.quotas[quota.id]

      // Filter by fund
      if (FUND_ID && LOOKUP?.fundId !== FUND_ID) {
        return false
      }

      // Filter by date range
      if (DATE_RANGE?.from) {
        const QUOTA_DATE = new Date(quota.date)
        if (QUOTA_DATE < DATE_RANGE.from) {
          return false
        }
      }
      if (DATE_RANGE?.to) {
        const QUOTA_DATE = new Date(quota.date)
        if (QUOTA_DATE > DATE_RANGE.to) {
          return false
        }
      }

      return true
    })
  }, [quotas, lookups, FUND_ID, DATE_RANGE])

  return {
    fundId: FUND_ID,
    onFundChange: setFundId,
    dateRange: DATE_RANGE,
    onDateRangeChange: setDateRange,
    filteredQuotas: FILTERED_QUOTAS,
  }
}

export { useQuotaDatatableFilters }
