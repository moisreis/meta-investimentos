"use client"

import { useMemo, useState } from "react"

import type { NormRow } from "@/presentation/types/norm-row.types"

interface UseNormDatatableFiltersOutput {
  query: string
  onQueryChange: (query: string) => void
  filteredNorms: NormRow[]
}

/**
 * @summary
 * Coordinates the norm datatable filters.
 *
 * @remarks
 * Owns the search query and narrows the rows by the
 * norm name before the table receives them.
 *
 * @param norms - The rows rendered by the datatable.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useNormDatatableFilters(
  norms: NormRow[]
): UseNormDatatableFiltersOutput {
  const [QUERY, setQuery] = useState("")

  const FILTERED_NORMS = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return norms

    return norms.filter((norm) =>
      norm.name.toLowerCase().includes(NORMALIZED)
    )
  }, [norms, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredNorms: FILTERED_NORMS,
  }
}

export { useNormDatatableFilters }
