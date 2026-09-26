"use client"

import { useMemo, useState } from "react"

import type { BankAccountResponseDTO } from "@/services/bank-account/dto/bank-account-response.dto"

import type { BankAccountNameLookups } from "../types/bank-account-list.types"

interface UseBankAccountDatatableFiltersOutput {
  query: string
  onQueryChange: (query: string) => void
  filteredAccounts: BankAccountResponseDTO[]
}

/**
 * @summary
 * Coordinates the bank account datatable filters.
 *
 * @remarks
 * Owns the search query and narrows the rows by the
 * portfolio name, bank name, agency or account number
 * before the table receives them.
 *
 * @param bankAccounts - The rows rendered by the
 *                       datatable.
 * @param names - The bank account name lookups.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-09-25
 */
function useBankAccountDatatableFilters(
  bankAccounts: BankAccountResponseDTO[],
  names: BankAccountNameLookups
): UseBankAccountDatatableFiltersOutput {
  const [QUERY, setQuery] = useState("")

  const FILTERED_ACCOUNTS = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return bankAccounts

    return bankAccounts.filter((account) => {
      const LOOKUP = names.bankAccounts[account.id]
      const HAYSTACK = [
        LOOKUP?.portfolioName,
        LOOKUP?.bankName,
        account.agency,
        account.accountNumber,
      ]
        .join(" ")
        .toLowerCase()
      return HAYSTACK.includes(NORMALIZED)
    })
  }, [bankAccounts, names, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredAccounts: FILTERED_ACCOUNTS,
  }
}

export { useBankAccountDatatableFilters }
