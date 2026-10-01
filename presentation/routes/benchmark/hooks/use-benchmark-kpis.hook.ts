"use client"

import { useCallback } from "react"

import type { EntityKpi } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { useEntityKpis } from "@/presentation/parts/hooks/use-entity-kpis.hook"
import { FormatCount } from "@/presentation/presenters/count.presenter"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

import { BENCHMARK_KPI } from "../settings/labels.settings"

/**
 * @summary
 * Builds the data-driven KPI cards of the benchmark list.
 *
 * @remarks
 * Tallies the registered benchmarks. The value is
 * formatted through the count presenter.
 *
 * @param benchmarks - The rows of the benchmark list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function BuildBenchmarkKpis(
  benchmarks: readonly BenchmarkRow[]
): EntityKpi[] {
  return [
    {
      key: "benchmarks",
      title: BENCHMARK_KPI.BENCHMARK_COUNT_TITLE,
      value: FormatCount(benchmarks.length),
      comparison: BENCHMARK_KPI.BENCHMARK_COUNT_COMPARISON,
    },
  ]
}

/**
 * @summary
 * Resolves the KPI cards of the benchmark list.
 *
 * @remarks
 * Delegates the computation to `BuildBenchmarkKpis` and the
 * memoization to the shared entity KPI hook.
 *
 * @param benchmarks - The rows of the benchmark list.
 *
 * @returns The KPI card props.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
function useBenchmarkKpis(
  benchmarks: BenchmarkRow[]
): EntityKpi[] {
  const compute = useCallback(
    (items: readonly BenchmarkRow[]) =>
      BuildBenchmarkKpis(items),
    []
  )

  return useEntityKpis({
    items: benchmarks,
    compute,
  })
}

export { useBenchmarkKpis }
