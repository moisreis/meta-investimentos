import { LoadBenchmarks } from "../helpers/load-benchmarks.helper"
import type { BenchmarkListProps } from "../pages/list"

/**
 * @summary
 * Resolves the props for the benchmark list page.
 *
 * @remarks
 * Loads the session benchmarks handed to the screen.
 *
 * @returns The benchmark list props, or empty props when
 * there is no active session.
 *
 * @example
 * const PROPS = await LoadBenchmarkPageProps();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export async function LoadBenchmarkPageProps(): Promise<BenchmarkListProps> {
  const BENCHMARKS = await LoadBenchmarks()

  return { data: BENCHMARKS }
}
