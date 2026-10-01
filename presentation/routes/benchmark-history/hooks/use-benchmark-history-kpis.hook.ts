"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"

import { BENCHMARK_HISTORY_KPI } from "../settings/labels.settings"

/**
 * @summary
 * Builds the data-driven KPI cards of the benchmark history
 * list.
 *
 * @remarks
 * Tallies the total entries, the distinct benchmarks
 * covered and the date range (min/max).
 *
 * @param history - The rows of the benchmark history list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BuildBenchmarkHistoryKpis(
  history: readonly BenchmarkHistoryRow[]
): EntityKpi[] {
  const BENCHMARKS = new Set(
    history.map((entry) => entry.benchmarkId)
  )

  const DATES = history
    .map((entry) => new Date(entry.date).getTime())
    .filter((time) => Number.isFinite(time))
    .sort((a, b) => a - b)

  const RANGE_TEXT =
    DATES.length >= 2
      ? `${new Date(DATES[0]).toLocaleDateString("pt-BR")} – ${new Date(DATES[DATES.length - 1]).toLocaleDateString("pt-BR")}`
      : DATES.length === 1
        ? new Date(DATES[0]).toLocaleDateString("pt-BR")
        : "—"

  return [
    {
      key: "total",
      title: BENCHMARK_HISTORY_KPI.TOTAL_TITLE,
      value: FormatCount(history.length),
      comparison: BENCHMARK_HISTORY_KPI.TOTAL_COMPARISON,
    },
    {
      key: "benchmarks",
      title: BENCHMARK_HISTORY_KPI.BENCHMARKS_TITLE,
      value: FormatCount(BENCHMARKS.size),
      comparison: BENCHMARK_HISTORY_KPI.BENCHMARKS_COMPARISON,
    },
    {
      key: "range",
      title: BENCHMARK_HISTORY_KPI.RANGE_TITLE,
      value: RANGE_TEXT,
      comparison: BENCHMARK_HISTORY_KPI.RANGE_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the benchmark history list.
 *
 * @remarks
 * Delegates the computation to `BuildBenchmarkHistoryKpis` and
 * the memoization to the shared entity KPI hook.
 *
 * @param history - The rows of the benchmark history list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useBenchmarkHistoryKpis(
  history: BenchmarkHistoryRow[]
): EntityKpi[] {
  const compute = useCallback(
    (items: readonly BenchmarkHistoryRow[]) =>
      BuildBenchmarkHistoryKpis(items),
    []
  )

  return useEntityKpis({
    items: history,
    compute,
  })
}

export { useBenchmarkHistoryKpis }
