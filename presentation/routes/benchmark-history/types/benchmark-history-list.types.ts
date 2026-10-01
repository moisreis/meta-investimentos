/**
 * @summary
 * Props for the benchmark history list page.
 *
 * @author Moisés Reis
 *
 * @date 2026-10-01
 */
import type { BenchmarkHistoryRow } from "@/presentation/types/benchmark-history-row.types"

export interface BenchmarkHistoryListProps {
  data: BenchmarkHistoryRow[] | null
}
