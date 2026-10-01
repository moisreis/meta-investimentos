"use client"

import { useMemo, useState } from "react"

import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"

interface UseBenchmarkHistoryDatatableFiltersOutput {
  query: string
  onQueryChange: (query: string) => void
  filteredHistory: BenchmarkHistoryRow[]
}

/**
 * @summary
 * Coordinates the benchmark history datatable filters.
 *
 * @remarks
 * Owns the search query and narrows the rows by the
 * benchmark name, acronym or rate before the table receives
 * them.
 *
 * @param history - The rows rendered by the datatable.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useBenchmarkHistoryDatatableFilters(
  history: BenchmarkHistoryRow[]
): UseBenchmarkHistoryDatatableFiltersOutput {
  const [QUERY, setQuery] = useState("")

  const FILTERED_HISTORY = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return history

    return history.filter((entry) => {
      const NAME = entry.benchmarkName
      const ACRONYM = entry.benchmarkAcronym
      const BENCHMARK = `${NAME} ${ACRONYM}`

      return [BENCHMARK, entry.rate]
        .join(" ")
        .toLowerCase()
        .includes(NORMALIZED)
    })
  }, [history, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredHistory: FILTERED_HISTORY,
  }
}

export { useBenchmarkHistoryDatatableFilters }
