"use client"

import { useCallback, useMemo, useState } from "react"

import type { BankResponseDTO } from "@/services/bank/dto/bank-response.dto"

interface UseBankDatatableFiltersOutput {
  query: string
  onQueryChange: (query: string) => void
  filteredBanks: BankResponseDTO[]
}

/**
 * @summary
 * Coordinates the bank datatable filters.
 *
 * @remarks
 * Owns the search query and narrows the rows by the bank
 * name before the table receives them.
 *
 * @param banks - The rows rendered by the datatable.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useBankDatatableFilters(
  banks: BankResponseDTO[]
): UseBankDatatableFiltersOutput {
  const [QUERY, setQuery] = useState("")

  const FILTERED_BANKS = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return banks

    return banks.filter((bank) =>
      bank.name.toLowerCase().includes(NORMALIZED)
    )
  }, [banks, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredBanks: FILTERED_BANKS,
  }
}

export { useBankDatatableFilters }
