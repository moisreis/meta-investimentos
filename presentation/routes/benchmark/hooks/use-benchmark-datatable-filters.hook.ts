"use client"

import { useMemo, useState } from "react"

import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

interface UseBenchmarkDatatableFiltersOutput {
  query: string
  onQueryChange: (query: string) => void
  filteredBenchmarks: BenchmarkRow[]
}

/**
 * @summary
 * Coordinates the benchmark datatable filters.
 *
 * @remarks
 * Owns the search query and narrows the rows by the
 * benchmark name before the table receives them.
 *
 * @param benchmarks - The rows rendered by the datatable.
 *
 * @returns The filter state and the filtered rows.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useBenchmarkDatatableFilters(
  benchmarks: BenchmarkRow[]
): UseBenchmarkDatatableFiltersOutput {
  const [QUERY, setQuery] = useState("")

  const FILTERED_BENCHMARKS = useMemo(() => {
    const NORMALIZED = QUERY.trim().toLowerCase()

    if (!NORMALIZED) return benchmarks

    return benchmarks.filter((benchmark) =>
      benchmark.name.toLowerCase().includes(NORMALIZED)
    )
  }, [benchmarks, QUERY])

  return {
    query: QUERY,
    onQueryChange: setQuery,
    filteredBenchmarks: FILTERED_BENCHMARKS,
  }
}

export { useBenchmarkDatatableFilters }
