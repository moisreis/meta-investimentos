import { RequireSessionUser } from "@/lib/auth/require-session"
import { BenchmarkContainer } from "@/presentation/composition/benchmark.container"
import { ToBenchmarkRows } from "@/presentation/mappers/benchmark-row.mapper"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

/**
 * @summary
 * Resolves the session user and the registered
 * benchmarks.
 *
 * @remarks
 * Derives the acting user from the session and lists all
 * benchmarks of the platform through the use case. Returns
 * null when there is no active session.
 *
 * @explanation
 * Use this helper from the page loader so the session
 * resolution and the benchmark listing stay in a single
 * place.
 *
 * @returns The benchmark rows, or `null`.
 *
 * @example
 * const BENCHMARKS = await LoadBenchmarks();
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
export async function LoadBenchmarks(): Promise<
  BenchmarkRow[] | null
> {
  const USER = await RequireSessionUser()

  if (!USER) return null

  const { list: LIST_BENCHMARKS } = BenchmarkContainer()

  return ToBenchmarkRows(await LIST_BENCHMARKS.execute({}))
}
