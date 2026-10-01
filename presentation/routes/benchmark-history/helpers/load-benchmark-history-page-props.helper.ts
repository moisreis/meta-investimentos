import { LoadBenchmarkHistory } from "../helpers/load-benchmark-history.helper"
import type { BenchmarkHistoryListProps } from "../types/benchmark-history-list.types"

/**
 * @summary
 * Resolves the props for the benchmark history list page.
 *
 * @remarks
 * Loads the session benchmark history rows composed across
 * all benchmarks.
 *
 * @returns The benchmark history list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadBenchmarkHistoryPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export async function LoadBenchmarkHistoryPageProps(): Promise<BenchmarkHistoryListProps> {
  const LOADED = await LoadBenchmarkHistory()

  if (LOADED) {
    return {
      data: LOADED.history,
    }
  }

  return {
    data: null,
  }
}
