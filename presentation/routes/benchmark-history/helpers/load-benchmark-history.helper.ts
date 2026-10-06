import { RequireSessionUser } from "@/lib/auth/require-session"
import { BenchmarkContainer } from "@/presentation/composition/benchmark.container"
import { BenchmarkHistoryContainer } from "@/presentation/composition/benchmark-history.container"

import { ToBenchmarkRows } from "@/presentation/mappers/benchmark-row.mapper"
import { ToBenchmarkHistoryRows } from "@/presentation/mappers/benchmark-history-row.mapper"
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

// Data resolved by the benchmark history list loader.
export interface LoadedBenchmarkHistoryList {
  history: BenchmarkHistoryRow[]
  benchmarks: BenchmarkRow[]
}

/**
 * @summary
 * Resolves the session user, the benchmarks and the benchmark
 * history across all of them, composed server-side.
 *
 * @remarks
 * Lists all benchmarks, then fetches the history for each
 * benchmark in parallel, flattens the groups into one global
 * index and attaches the benchmark name and acronym to each
 * row. Returns null when there is no active session.
 *
 * The benchmarks travel back with the history rather than
 * being loaded again by the screen: the record dialog needs
 * them for its index picker, and the loader already read them
 * to compose the rows, so handing them over is free and keeps
 * the picker from ever offering an index the list did not.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the benchmark history composition stay in a
 * single composition point.
 *
 * @returns The benchmark history rows and the benchmarks, or
 * null.
 *
 * @example
 * const LOADED = await LoadBenchmarkHistory();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export async function LoadBenchmarkHistory(): Promise<LoadedBenchmarkHistoryList | null> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const { list: LIST_BENCHMARKS } = BenchmarkContainer()
  const BENCHMARKS = ToBenchmarkRows(
    await LIST_BENCHMARKS.execute({})
  )
  const BENCHMARKS_BY_ID = Object.fromEntries(
    BENCHMARKS.map((benchmark) => [benchmark.id, benchmark])
  )

  const { list: LIST_BENCHMARK_HISTORY } =
    BenchmarkHistoryContainer()
  const HISTORY_GROUPS = await Promise.all(
    BENCHMARKS.map((benchmark) =>
      LIST_BENCHMARK_HISTORY.execute({
        benchmarkId: benchmark.id,
      })
    )
  )

  return {
    history: ToBenchmarkHistoryRows(
      HISTORY_GROUPS.flat(),
      BENCHMARKS_BY_ID
    ),
    benchmarks: BENCHMARKS,
  }
}
