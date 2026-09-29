"use client"

import { useMemo, useState } from "react"

import type { FundRow } from "@/presentation/types/fund-row.types"

interface UseFundDatatableFiltersOutput {
  query: string
  onQueryChange: (query: string) => void
  filteredFunds: FundRow[]
}

/**
 * @summary
 * Coordinates the fund datatable filters.
 *
 * @remarks
 * Owns the search query and narrows the rows by the
 * fund name or **CNPJ** before the table receives
 * them.
 *
 * @param funds - The rows rendered by the datatable.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useFundDatatableFilters(
  funds: FundRow[]
): UseFundDatatableFiltersOutput {
  const [QUERY, setQuery] = useState("")

  const FILTERED_FUNDS = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return funds

    return funds.filter((fund) => {
      const HAYSTACK = `${fund.name} ${fund.cnpj}`.toLowerCase()
      return HAYSTACK.includes(NORMALIZED)
    })
  }, [funds, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredFunds: FILTERED_FUNDS,
  }
}

export { useFundDatatableFilters }
