"use client"

import type { EntityComboboxItem } from "@/presentation/parts/components/entity-combobox"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

interface UseBenchmarkHistoryIndexOptionsParams {
  // The indices a rate can be recorded for.
  benchmarks: BenchmarkRow[]
  // The index currently chosen.
  benchmarkId: string
  // Reports the next index to the form hook.
  updateBenchmarkId: (benchmarkId: string) => void
}

/**
 * @summary
 * Owns the index picker of the record rate form.
 *
 * @remarks
 * The form receives `BenchmarkRow` records, which carry more
 * than a picker needs, and renders a generic picker, which
 * speaks plain strings. The field is required, so clearing it
 * falls back to the empty string and lets the schema reject
 * it, rather than substituting a sentinel the schema would not
 * recognise.
 *
 * The acronym leads as the description under the name because
 * an index is recognised by its acronym: a user coming back to
 * enter the next month is looking for "CDI", and a full index
 * name is long enough to be hard to scan.
 *
 * @explanation
 * Use in `BenchmarkHistoryFormFields`, which is the single
 * owner of the picker for both the record and the edit form.
 * Call it once with the form's `benchmarks`, `benchmarkId` and
 * `updateBenchmarkId`, and give the picker the `items` it
 * returns.
 *
 * @param params - The index list, the selection and the form
 *   update callback.
 * @param params.benchmarks - The indices on offer.
 * @param params.benchmarkId - The index currently chosen.
 * @param params.updateBenchmarkId - Reports the next index.
 *
 * @returns The picker options and the change handler.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-05
 */
function useBenchmarkHistoryIndexOptions({
  benchmarks,
  benchmarkId,
  updateBenchmarkId,
}: UseBenchmarkHistoryIndexOptionsParams) {
  const items: EntityComboboxItem[] = benchmarks.map(
    (benchmark) => ({
      id: benchmark.id,
      name: benchmark.name,
      description: benchmark.acronym,
    })
  )

  const handleBenchmarkIdChange = (value: string) =>
    updateBenchmarkId(value || "")

  return { benchmarkId, items, handleBenchmarkIdChange }
}

export { useBenchmarkHistoryIndexOptions }
