/**
 * @summary
 * Props for the benchmark history list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"
import type { BenchmarkRow } from "@/presentation/types/benchmark-row.types"

export interface BenchmarkHistoryListProps {
  data: BenchmarkHistoryRow[] | null
  // Indices the record dialog offers, so an entry is recorded
  // against an index the list already knows about.
  benchmarks: BenchmarkRow[]
}
