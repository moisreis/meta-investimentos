"use client"

import { useMemo, useState } from "react"

import { FormatDate } from "@/presentation/presenters/date.presenter"
import type { QuotaResponseDTO } from "@/services/quota/dto/quota-response.dto"

import type { QuotaFundLookups } from "../types/quota-list.types"

interface UseQuotaDatatableFiltersOutput {
  query: string
  onQueryChange: (query: string) => void
  filteredQuotas: QuotaResponseDTO[]
}

/**
 * @summary
 * Coordinates the quota datatable filters.
 *
 * @remarks
 * Owns the search query and narrows the rows by the fund
 * name, cnpj or formatted date before the table receives
 * them.
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
  quotas: QuotaResponseDTO[],
  lookups: QuotaFundLookups
): UseQuotaDatatableFiltersOutput {
  const [QUERY, setQuery] = useState("")

  const FILTERED_QUOTAS = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return quotas

    return quotas.filter((quota) => {
      const LOOKUP = lookups.quotas[quota.id]
      const HAYSTACK = [
        LOOKUP?.name,
        LOOKUP?.cnpj,
        FormatDate(quota.date),
      ]
        .join(" ")
        .toLowerCase()

      return HAYSTACK.includes(NORMALIZED)
    })
  }, [quotas, lookups, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredQuotas: FILTERED_QUOTAS,
  }
}

export { useQuotaDatatableFilters }
