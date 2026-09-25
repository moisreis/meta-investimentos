"use client"

import { useMemo, useState } from "react"

import { FormatCurrency } from "@/presentation/presenters/currency.presenter"
import { FormatDate } from "@/presentation/presenters/date.presenter"
import { ResolveBankAccountLabel } from "@/presentation/routes/checking-account/helpers/build-checking-account-name-lookups.helper"
import type { CheckingAccountResponseDTO } from "@/services/checking-account/dto/checking-account-response.dto"

import type { CheckingAccountNameLookups } from "../types/checking-account-list.types"

interface UseCheckingAccountDatatableFiltersOutput {
  query: string
  onQueryChange: (query: string) => void
  filteredEntries: CheckingAccountResponseDTO[]
}

/**
 * @summary
 * Coordinates the checking account datatable filters.
 *
 * @remarks
 * Owns the search query and narrows the rows by the
 * bank account label, the balance date or the value
 * before the table receives them.
 *
 * @param entries - The rows rendered by the datatable.
 * @param names - The bank account name lookups.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useCheckingAccountDatatableFilters(
  entries: CheckingAccountResponseDTO[],
  names: CheckingAccountNameLookups
): UseCheckingAccountDatatableFiltersOutput {
  const [QUERY, setQuery] = useState("")

  const FILTERED_ENTRIES = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return entries

    return entries.filter((entry) => {
      const ACCOUNT_LABEL = ResolveBankAccountLabel(
        names,
        entry.bankAccountId
      )
      const HAYSTACK = [
        ACCOUNT_LABEL,
        FormatDate(entry.date),
        FormatCurrency(entry.value),
      ]
        .join(" ")
        .toLowerCase()
      return HAYSTACK.includes(NORMALIZED)
    })
  }, [entries, names, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredEntries: FILTERED_ENTRIES,
  }
}

export { useCheckingAccountDatatableFilters }
